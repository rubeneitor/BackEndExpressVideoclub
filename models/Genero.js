const mongoose = require('mongoose');

const GeneroSchema=mongoose. Schema({
    name:String,
    id: String
    // poster_path: String,
    // title: String
})
// PeliculaSchema.methods.toJSON=function () {
//     const {title, poster_path} =this
//     // title = titulo;
//     return ({title,poster_path})
// }
const GeneroModel = mongoose.model('genero', GeneroSchema);
module.exports= GeneroModel;