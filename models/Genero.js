const mongoose = require('mongoose');

const GeneroSchema = mongoose.Schema({
    name: String,
    id: String
})

GeneroSchema.methods.toJSON = function () {
    const { id, name } = this
    return ({ id, name })
}

const GeneroModel = mongoose.model('genero', GeneroSchema);
module.exports = GeneroModel;