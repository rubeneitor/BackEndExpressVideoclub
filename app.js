const express = require('express');
const app = express();

var jwt = require('jsonwebtoken')
var bodyParser = require('body-parser')

const UserModel = require('./models/User');
const PeliculaModel = require('./models/Pelicula');
const GeneroModel = require('./models/Genero');
const PedidoModel = require('./models/Pedido');
const EstrenoModel = require('./models/Estreno')

const mongoose = require('mongoose')

//Funcion que permite enlazar el backend con el frontend, para poder usar los metodos get, post, put y delete para gestionar usuarios, peliculas y pedidos
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "GET, POST,PUT,DELETE");
	next();
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '10mb' }))
app.use(express.json());

//Conectamos a mongoDB
mongoose.connect('mongodb://localhost:27017/PelculasAlquiler',
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true
	})
	.then(() => console.log('conectado a mongodb'))
	.catch(error => console.log('Error al conectar a MongoDB ' + error))


//GESTION USUARIOS
//Muestra todos los usuarios
app.get('/user', (req, res) => {
	UserModel.find({})
		.then(users => res.send(users))
		.catch(error => console.log(error))
})

// Registra un usuario nuevo
app.post('/user/register', async (req, res) => {
	try {
		if (!req.body.username) {
			return res.send({ message: 'Tienes que introducir un username' })
		}
		const usernameFound = await UserModel.findOne({ username: req.body.username })
		if (usernameFound) {
			return res.send({ message: 'Ya existe un usuario con ese username' })
		}
		const user = await new UserModel({
			username: req.body.username,
			password: req.body.password,
			nombre: req.body.nombre,
			email: req.body.email,
			id: req.body.id
		})
		const longitudPattern = /.{8,}/
		if (!longitudPattern.test(user.password)) {
			return res
				.status(400)
				.json({ message: `password corto` });
		} else {
			if (user.username == null) {
				return res
					.status(400)
					.json({ message: `username es obligatorio` });
			} else {
				user.save();
			}
		}
		res.send(user);
	} catch (error) {
		console.log(error)
	}
})

//Motramos el perfil de un usuario
app.get('/user/perfil/:username', (req, res) => {
	UserModel.findOne({ username: req.params.username })
		.then(user => res.send(user))
		.catch(error => console.log(error))
})

//Login y token
app.post('/user/login', async (req, res) => {
	try {
		let user = await UserModel.findOne({
			username: req.body.username
		})
		if (!user) {
			return res.status(400).send({
				message: 'Usuario o contraseña incorrectos'
			})
		}

		const token = jwt.sign({ _id: user._id }, 'missecretito', {
			expiresIn: '24h'
		});
		await UserModel.findOneAndUpdate({ _id: user._id }, {
			$push: {
				tokens: token
			}
		})
		const isMatch = await user.comparePassword(req.body.password)
		if (!isMatch) {

			return res.status(400).send({
				message: 'Usuario o contraseña incorrectos'
			})
		}
		else {
			res.send({
				message: 'Bienvenido  ' + user.username, user, token
			})
		}

	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}

})

//Comprobamos que el token del usuario existe 
app.get('/secure', (req, res) => {
	var token = req.headers['authorization']
	if (!token) {
		res.status(401).send({
			error: "Es necesario el token de autenticación"
		})
		return
	}

	token = token.replace('Bearer ', '')

	jwt.verify(token, 'missecretito', function (err, user) {
		if (err) {
			res.status(401).send({
				error: 'Token inválido'
			})
		} else {
			res.send({
				message: 'Token correcto'
			})
		}
	})
})


//GESTION PELICULAS

//Muestra todas las peliculas
app.get('/pelicula', (req, res) => {
	PeliculaModel.find({})
		.then(movies => res.send(movies))
		.catch(error => console.log(error))

})

//Musetra la pelcula por id
app.get('/pelicula/id/:id', (req, res) => {
	PeliculaModel.findOne({ id: parseInt(req.params.id) })
		.then(movie => res.send(movie))
		.catch(error => console.log(error))

})

//Muestra las peliculas de esteno
app.get('/pelicula/estrenos', (req, res) => {
	EstrenoModel.find({})
		.then(estrenos => {
			res.send(estrenos)
		})
		.catch(err => {
			console.log(err)
		})
})

//Muestra la pelicula por titulo
app.get('/pelicula/title/:title', (req, res) => {
	PeliculaModel.find({ title: req.params.title })
		.then(movie => res.send(movie))
		.catch(error => console.log(error));

})

//Muestra las peliculas por genero mediante id (18, 28, ...)
app.get('/peliculas/generos/id/:genreId', (req, res) => {
	let genreId = parseInt(req.params.genreId);
	PeliculaModel.find({
		genre_ids: genreId
	}).then((peliculas) => {
		res.send(peliculas)

	}).catch((err) => {
		console.log(err)
	})
})

//Pelicula por genero mediante nombre (Drama, Acción, ...)
app.get('/peliculas/generos/name/:name', (req, res) => {
	let nombreGenero = req.params.name;
	GeneroModel.findOne({
		name: nombreGenero
	})
		.then((genero) => {
			let idGenero = parseInt(genero.id)
			PeliculaModel.find({ genre_ids: idGenero })
				.then((pelicula) => {
					res.send(pelicula)
				})
				.catch((error) => {
					console.log(error)
				})
		})
		.catch((err) => {
			console.log(err)
		})

})

//PEDIDOS

//Registrar pedido con fecha con formato dd/mm/yyyy
app.post('/pedidos/addPedido', async (req, res) => {
	try {
		if (!req.body.numPedido) {
			return res.send({ message: 'Tienes que introducir un numero de pedido' })
		}
		const pedidoFound = await PedidoModel.findOne({ numPedido: req.body.numPedido })

		if (pedidoFound) {
			return res.send({ message: 'Ya existe un pedido con esta referencia' })
		}
		const pedido = await new PedidoModel({
			numPedido: req.body.numPedido,
			idUsuario: req.body.idUsuario,
			direccion: req.body.direccion,
			fechaAlquiler: req.body.fechaAlquiler,
			fechaEntrega: parseInt(req.body.fechaAlquiler) + 2 + ' del mismo mes'

		}).save();
		res.send(pedido);
	} catch (error) {
		console.log(error)
	}
})

//Leer un pedido por id de usuario que esta en el registro de pedido
app.get('/pedidos/id/:idUsuario', (req, res) => {

	let idUsuario = parseInt(req.params.idUsuario)
	PedidoModel.find({
		idUsuario: idUsuario
	}).then((pedidos) => {
		res.send(pedidos)
	}).catch((err) => {
		console.log(err)
	})


})

app.listen(3000, () => console.log('servidor levantado correctamente'));