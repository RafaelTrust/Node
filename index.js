//config inicial
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const app = express()
require('dotenv').config()
const PORT = process.env.PORT || 8877

app.listen(PORT, () => {
    console.log("Escutando a porta: " + PORT);
})

app.use(cors())

app.use(fileUpload())
//forma de ler json / middlewares
app.use(
    express.urlencoded({
        extended: true,
    }),
)

app.use(express.json())
//rotas da API
const usuarioRoutes = require('./routes/usuarioRoutes')

app.use('/usr', usuarioRoutes)

//entregar uma porta
const DB_USR = process.env.DB_USR
const DB_PASS = encodeURIComponent(process.env.DB_PASS)

//mongoose.connect(`mongodb+srv://${DB_USR}:${DB_PASS}@apicluster.i6ure.mongodb.net/bancodaapi?retryWrites=true&w=majority`)
mongoose.connect(`mongodb+srv://Aero:y*K9IIqWdZFU@apicluster.i6ure.mongodb.net/bancodaapi?retryWrites=true&w=majority`)
.then(() => {
    console.log('Conectamos com Sucesso ao MongoDB')
    app.listen(3000)
})
.catch((err) => console.log(err))


//senha para o banco:y*K9IIqWdZFU  nome do banco:Aero