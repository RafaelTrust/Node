const router = require('express').Router()
const Usuario = require('../models/Usuario')
const rimraf = require('rimraf')
const fs = require('fs')

//Create
router.post('/', async (req, res) => {
    // req.body {nome: "Rafael", email: "rafaelima@email.com", telefone: "(21) 98888-7777", anexo: "texto.txt", observacao: "foi cadastrado"}
    const { nome, email, telefone, observacao } = req.body
    let arquivo = req.files.anexo
    let anexo = arquivo.name


    if((!nome && !email && !telefone && !anexo && !observacao)
    || (nome === "" || email === "" || telefone === "" || anexo === "" || observacao === "")) {
        res.status(422).json({error: 'Todos os campos devem ser preenchidos'})
        return
    }

    let ext = anexo.split('.')[1]
    let nomeAnexo = anexo.split('.')[0]

    if(ext != "pdf"){
        res.status(422).json({error: 'Arquivo invalido'})
        return
    }
    let caminhoAnexo = `anexos/${email}`
    if(!fs.existsSync(`./${caminhoAnexo}`)){
        fs.mkdirSync(`./${caminhoAnexo}`)
    }

    anexo = `${caminhoAnexo}/${nomeAnexo}.${ext}`
    arquivo.mv(`./${anexo}`)


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

        res.status(201).json({message: 'Usuario criado com Sucesso!'})
        return

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
        return
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
        return
    } catch (error) {
        res.status(500).json({error: error})
    }
})

//Update - atualização do objeto completo (PUT) atualização do objeto parciamente (PATCH)
router.patch('/:id', async (req, res) =>{
    const id = req.params.id
    let nome = ""
    let email = ""
    let telefone = ""
    let anexo = ""
    let observacao = ""
    
    if(req.body.boolAnexo === "true"){
        //const { nome, email, telefone, observacao, emailAntigo} = req.body
        let emailAntigo = req.body.emailAntigo
        nome = req.body.nome
        email = req.body.email
        telefone = req.body.telefone
        observacao = req.body.observacao

        let arquivo = req.files.anexo
        let anexoInterno = arquivo.name

        let ext = anexoInterno.split('.')[1]
        let nomeAnexo = anexoInterno.split('.')[0]

        if(ext != "pdf"){
            res.status(422).json({error: 'Arquivo invalido'})
            return
        }

        let caminhoAnexo = `anexos/${email}`
        let caminhoAntigo = `anexos/${emailAntigo}`

        anexoInterno = `${caminhoAnexo}/${nomeAnexo}.${ext}`
        caminhoAnexo = `./${caminhoAnexo}`
        caminhoAntigo = `./${caminhoAntigo}`
        if(emailAntigo == email){
            if(!fs.existsSync(`./${anexoInterno}`)){
                rimraf.sync(caminhoAnexo)
                fs.mkdirSync(caminhoAnexo)
                arquivo.mv(`./${anexoInterno}`)
            }
        }else{
            rimraf.sync(caminhoAntigo)
            fs.mkdirSync(caminhoAnexo)
            arquivo.mv(`./${anexoInterno}`)
        }
        anexo = anexoInterno;
    }else{
        //const { nome, email, telefone, observacao, anexoAntigo} = req.body
        nome = req.body.nome
        email = req.body.email
        telefone = req.body.telefone
        observacao = req.body.observacao
        anexo = req.body.anexoAntigo;
    }

    console.log(anexo)

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
        res.status(200).json({message: 'Usuario atualizado com sucesso!'})
        return
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

    let anexo = `./${usuario.get('anexo')}`;
    let nomeArquivo = anexo.split('/')[3]
    anexo = anexo.replace(`/${nomeArquivo}`, "")

    rimraf.sync(anexo)

    try {
     
        await Usuario.deleteOne({_id: id})

        res.status(200).json({message: 'Usuario deletado com sucesso!'})
        
    } catch (error) {
        res.status(500).json({error: error})
    }
})

module.exports = router