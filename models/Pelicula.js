const mongoose = require('mongoose');

const PeliculaSchema=mongoose. Schema({
    
    id: Number,
    title: String,
    poster_path: String,
    overview: String,
    release_date: String,
    original_language: String
})
PeliculaSchema.methods.toJSON=function () {
    const {id, title, poster_path, overview, release_date, original_language} =this
    // title = titulo;
    return ({id, title, poster_path, overview, release_date, original_language})
}
const PeliculaModel = mongoose.model('movie', PeliculaSchema);
module.exports= PeliculaModel;