const mongoose = require('mongoose');

const PedidoSchema=mongoose. Schema({
    
    numPedido: {
        type: Number,
        required: true
    },
    idUsuario: {
        type: Number,
        required: true
    },
    direccion: String,
    fechaAlquiler: String,
    fechaEntrega: String
    
    
})

const PedidoModel = mongoose.model('pedido', PedidoSchema);
module.exports= PedidoModel;