const mongoose = require('mongoose')

const Usuario = mongoose.model('Usuario', {
    nome: String,
    email: String,
    telefone: String,
    anexo: String,
    observacao: String
})

module.exports = Usuario