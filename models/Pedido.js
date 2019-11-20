const mongoose = require('mongoose');

const PedidoSchema=mongoose. Schema({
    
    numPedido: Number,
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