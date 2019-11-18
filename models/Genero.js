const mongoose = require('mongoose');

const GeneroSchema=mongoose. Schema({
    name:String,
    id: String
    // poster_path: String,
    // title: String
})

const GeneroModel = mongoose.model('genero', GeneroSchema);
module.exports= GeneroModel;