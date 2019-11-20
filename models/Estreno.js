const mongoose = require('mongoose');

const EstrenoSchema=mongoose. Schema({
    name:String,
    id: String
    // poster_path: String,
    // title: String
})

const EstrenoModel = mongoose.model('estreno', EstrenoSchema);
module.exports= EstrenoModel;