const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: String,
    id: Number,
    nombre: String,
    email: String,
    direccion: String,
    telefono:Number,
    tokens: []
})

UserSchema.methods.toJSON = function () {
    const user = this._doc;
    delete user.tokens
    return user;
}
UserSchema.methods.comparePassword = function (password) {
    const user = this;
    return bcrypt.compare(password, user.password)
}

UserSchema.pre('save', function (next) { //mongoose middleware que se ejecuta antes del save(), utilizamos ES5 functions porque queremmos el this para acceder a la instancia (UserModel). Si fuera function flexa (arow function), el this si que cogeria el de arriba, UserSchema
    const user = this;
    bcrypt.hash(user.password, 10).then(hash => {//generamos hash de forma asincrona
        user.password = hash;//sobreescribimos la propiedad del password con el hash ya encriptado
        next();//Cuando hace next(), es cuando hace el save() y se guarda en la base de datos
    })
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        })
})

const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;