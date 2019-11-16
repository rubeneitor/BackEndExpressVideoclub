const express = require('express');
const app = express();

var jwt = require('jsonwebtoken')
var bodyParser = require('body-parser')

const UserModel = require('./models/User');
const PeliculaModel = require('./models/Pelicula');
const mongoose=require('mongoose')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json({limit:'10mb'}))

app.use(express.json());


mongoose.connect('mongodb://localhost:27017/PelculasAlquiler', 
{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true })
.then(()=>console.log('conectado a mongodb'))
.catch(error=>console.log('Error al conectar a MongoDB ' +error))


//Muestra todos los usuarios
app.get('/user',(req, res) => {
    UserModel.find({})
    .then(users => res.send(users))
    .catch(error=> console.log(error))
})

// Registra un usuario nuevo
app.post('/user/register', async (req,res) => {
    try{
        const user = await new UserModel({
            username:req.body.username,
            password:req.body.password,
            nombre: req.body.nombre,
            email : req.body.email
        })
        const longitudPattern = /.{8,}/
        if (!longitudPattern.test(user.password)) {
            return res
              .status(400)
              .json({ message: `password too short` });
         } else {
             if(UserModel.username === req.body.username){
                return res
                .status(400)
                .json({ message: `username ya esta` });
             } else{
                 user.save();
             }
              
         }

       
        res.send(user);
    }catch(error){
        console.log(error)
    }
})

//Logueamos por username
app.get('/user/:username', (req, res)=>{
    UserModel.findOne({username:req.params.username})
    .then(user=>res.send(user))
    .catch(error=>console.log(error))
})

//Actualiza un usuario existente
// app.patch('/user/:id', (req, res)=>{
//     UserModel.findByIdAndUpdate(req.params.id,{
//         username:req.body.username
//     }, {new:true, useFindAndModify:false})
//     .then(user=>res.send(user))
//     .catch(error=>console.log(error))
// })

//Borramos un usuario
// app.delete('/user/:id', (req, res)=>{
//     UserModel.findByIdAndDelete(req.params.id)
//     .then(user=>res.send({message: 'Usuario eliminado satisfactoriamente', user}))//ponemos al final user para que ademas de que en el Postman salga el mensaje tambien salga el user, pero en la base de datos, en MongDB no esta
//     .catch(error=>console.log(error))
// })

//Muestra todas las peliculas
app.get('/pelicula', (req, res, next)=>{
    PeliculaModel.find({})
    .then(movies=>res.send(movies))
    .catch(error=>console.log(error))
   
})

//Musetra la pelcula por id
app.get('/pelicula/:id', (req, res) => {
    PeliculaModel.findOne({id:parseInt(req.params.id)})
    .then(movie => res.send(movie))
    .catch(error=>console.log(error))
})

//Muestra la pelicula por titulo
app.get('/pelicula/:title', (req, res) => {
    PeliculaModel.findOne({title:req.params.title})
    .then(movie => res.send(movie))
    .catch(error => console.log(error));
})


// app.get('/peliculasGenero', (req, res) => {
//     peliculasGeneroModel.find({})
//     .then(moviesGenero => res.send(moviesGenero))
//     .catch(error => console.log(error))
// })

// Validacion email
// const longitudPattern = /.{8,}/

// if (!longitudPattern.test(user.password)) {
//     return res
//       .status(400)
//       .json({ message: `password too short` });
//  }



app.post('/login', (req, res) => {
    var username = req.body.user
    var password = req.body.password
  
    if( !(username === UserModel.username && password === UserModel.password)){
      res.status(401).send({
        error: 'usuario o contraseña inválidos'
      })
      return
    }
  
    var tokenData = {
      username: username
      // ANY DATA
    }
  
    var token = jwt.sign(tokenData, 'Secret Password', {
       expiresIn: 60 * 60 * 24 // expires in 24 hours
    })
  
    res.send({
      token
    })
  })

  app.get('/secure', (req, res) => {
    var token = req.headers['authorization']
    if(!token){
        res.status(401).send({
          error: "Es necesario el token de autenticación"
        })
        return
    }

    token = token.replace('Bearer ', '')

    jwt.verify(token, 'Secret Password', function(err, user) {
      if (err) {
        res.status(401).send({
          error: 'Token inválido'
        })
      } else {
        res.send({
          message: 'Awwwww yeah!!!!'
        })
      }
    })
})




app.listen(3000, ()=> console.log('servidor levantado correctamente'));