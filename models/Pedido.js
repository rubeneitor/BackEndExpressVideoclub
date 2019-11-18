const mongoose = require('mongoose');

const PedidoSchema=mongoose. Schema({
    
    numPedido: Number,
    idUsuario: Number,
    direccion: String,
    fechaAlquiler: {
        type: Date,
        default: Date.now
    },
    fechaEntrega: Date
     
    
})
// PeliculaSchema.methods.toJSON=function () {
//     const {title, poster_path} =this
//     // title = titulo;
//     return ({title,poster_path})
// }
const PedidoModel = mongoose.model('pedido', PedidoSchema);
module.exports= PedidoModel;