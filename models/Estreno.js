const mongoose = require('mongoose');

const EstrenoSchema = mongoose.Schema({
    name: String,
    id: String

})

const EstrenoModel = mongoose.model('estreno', EstrenoSchema);
module.exports = EstrenoModel;