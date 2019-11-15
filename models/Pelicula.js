const mongoose = require('mongoose');

const PeliculaSchema=mongoose. Schema({
    
    poster_path: String,
    title: String
})
// PeliculaSchema.methods.toJSON=function () {
//     const {title, poster_path} =this
//     // title = titulo;
//     return ({title,poster_path})
// }
const PeliculaModel = mongoose.model('movie', PeliculaSchema);
module.exports= PeliculaModel;