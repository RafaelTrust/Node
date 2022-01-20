const router = require('express').Router()
const Usuario = require('../models/Usuario')

//Create
router.post('/', async (req, res) => {
    // req.body {nome: "Rafael", email: "rafaelima@email.com", telefone: "(21) 98888-7777", anexo: "texto.txt", observacao: "foi cadastrado"}
    const { nome, email, telefone, anexo, observacao } = req.body

    if(!nome && !email && !telefone && !anexo && !observacao) {
        res.status(422).json({error: 'Todos os campos devem ser preenchidos'})
        return
    }

    const usuario = {
        nome,
        email,
        telefone,
        anexo,
        observacao
    }

    //create

    try {
        
        await Usuario.create(usuario)

        res.status(201).json({message: 'Pessoa inserida com sucesso'})

    } catch (error) {
        res.status(500).json({error: error})
    }
    
})

//Read
router.get('/', async (req, res) => {
    //mostrar requisição
    try {
        const usuarios = await Usuario.find()

        res.status(200).json(usuarios)
    } catch (error) {
        res.status(500).json({error: error})
    }
})

router.get('/:id', async (req, res) =>{
    //para ver tudo do req jogue no console: console.log(req)

    //extrair o dado da requisição, pela url = req.params
    const id = req.params.id

    try {
        const usuario = await Usuario.findOne({_id: id})

        if(!usuario){
            res.status(422).json({message: 'Usuario não foi encontrado!'})
            return
        }

        res.status(200).json(usuario)
    } catch (error) {
        res.status(500).json({error: error})
    }
})

//Update - atualização do objeto completo (PUT) atualização do objeto parciamente (PATCH)
router.patch('/:id', async (req, res) =>{
    const id = req.params.id

    const { nome, email, telefone, anexo, observacao } = req.body

    const usuario = {
        nome,
        email,
        telefone,
        anexo,
        observacao
    }

    try {
        const updateUsuario = await Usuario.updateOne({_id: id}, usuario)

        if(updateUsuario.matchedCount === 0){
            res.status(422).json({message: 'Usuario não foi encontrado!'})
            return
        }

        res.status(200).json(usuario)
    } catch (error) {
        res.status(500).json({error: error})
    }
})

//Delete
router.delete('/:id', async (req, res) => {
    const id = req.params.id

    const usuario = await Usuario.findOne({_id: id})
    if(!usuario){
        res.status(422).json({message: 'Usuario não foi encontrado!'})
        return
    }

    try {
     
        await Usuario.deleteOne({_id: id})

        res.status(200).json({message: 'Usuario deletado com sucesso!'})
        
    } catch (error) {
        res.status(500).json({error: error})
    }
})

module.exports = router