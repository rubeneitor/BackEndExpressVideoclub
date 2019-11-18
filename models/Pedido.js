const mongoose = require('mongoose');

const PedidoSchema=mongoose. Schema({
    
    numPedido: Number,
    idUsuario: {
        type: Number,
        required: true
    },
    direccion: String,
    fechaAlquiler: {
        type: Date,
        default: Date.now
    },
    fechaEntrega: Date
     
    
})

const PedidoModel = mongoose.model('pedido', PedidoSchema);
module.exports= PedidoModel;