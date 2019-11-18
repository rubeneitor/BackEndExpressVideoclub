const mongoose = require('mongoose');

const UserSchema=mongoose. Schema({
    username:{
        type: String,
        unique: true,
        required:true
    },
    password: String,
    id: Number,
    nombre: String,
    email: String,
    direccion: String
})
const UserModel = mongoose.model('user', UserSchema);
module.exports= UserModel;