const express = require('express');
const app = express();
const UserModel = require('./models/User');
const PeliculaModel = require('./models/Pelicula');
const mongoose=require('mongoose')

app.use(express.json());


mongoose.connect('mongodb://localhost:27017/PelculasAlquiler', 
{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true })
.then(()=>console.log('conectado a mongodb'))
.catch(error=>console.log('Error al conectar a MongoDB ' +error))

app.get('/user',(req, res) => {
    UserModel.find({})
    .then(users => res.send(users))
    .catch(error=> console.log(error))
})

app.get('/pelicula', (req, res)=>{
    PeliculaModel.find({})
    .then(movies=>res.send(movies))
    .catch(error=>console.log(error))
})


app.get('./pelicula/:id', (req, res) => {
    PeliculaModel.findById(req.params.id)
    .then(movie => res.send(movie))
    .catch(error=>console.log(error))
})

// app.get('/peliculasGenero', (req, res) => {
//     peliculasGeneroModel.find({})
//     .then(moviesGenero => res.send(moviesGenero))
//     .catch(error => console.log(error))
// })

app.post('/user/register', async (req,res) => {
    try{
        const user = await new UserModel({
            username:req.body.username,
            password:req.body.password,
            id:req.body.id
        }).save()
        res.send(user);
    }catch(error){
        console.log(error)
    }
})

app.get('/user/:id', (req, res)=>{
    UserModel.findById(req.params.id)
    .then(user=>res.send(user))
    .catch(error=>console.log(error))
})

app.patch('/user/:id', (req, res)=>{
    UserModel.findByIdAndUpdate(req.params.id,{
        username:req.body.username
    }, {new:true, useFindAndModify:false})
    .then(user=>res.send(user))
    .catch(error=>console.log(error))
})

app.delete('/user/:id', (req, res)=>{
    UserModel.findByIdAndDelete(req.params.id)
    .then(user=>res.send({message: 'Usuario eliminado satisfactoriamente', user}))//ponemos al final user para que ademas de que en el Postman salga el mensaje tambien salga el user, pero en la base de datos, en MongDB no esta
    .catch(error=>console.log(error))
})


app.listen(3000, ()=> console.log('servidor levantado correctamente'));