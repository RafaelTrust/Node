//iniciando a pagina com os dados
//READ (pegando valores existentes no banco)
async function getContent(){
    try {
        const response = await fetch('https://crudrafaeltrust.herokuapp.com/usr')   

        const data = await response.json()
        show(data)
    } catch (error) {
        console.error(error)
    }
}
getContent()

//colocando os dados na tabela
function show(users){
    const listaUsuarios = document.querySelector('#listaUsuarios')
    listaUsuarios.innerHTML = "";
    
    for(let user of users){
        let usuarioLi;
        var dadosForm = ["Nome:", "Email:", "Telefone:", "Anexo:", "Observação:"]
        var dadosInfo = new Array(user.nome, user.email, user.telefone, user.anexo, user.observacao)
        listaUsuarios.innerHTML += `<h3>Usuario: ${user._id}</h3><hr><ul data-id="${user._id}">`
        for(var i = 0; i < dadosInfo.length; i++){
            usuarioLi = document.createElement('li');
            if(i == (dadosInfo.length - 1)){
                usuarioLi.innerHTML = `<span>${dadosForm[i]} ${dadosInfo[i]}</span><br>`
            }else{
                usuarioLi.innerHTML = `<span>${dadosForm[i]} ${dadosInfo[i]}</span>`
            }
            listaUsuarios.appendChild(usuarioLi);
        }

        const buttond = document.createElement('button')
        buttond.dataset.id = user._id
        buttond.setAttribute("id", `delete-button-${user._id}`)
        buttond.innerText = "Deletar"
        buttond.setAttribute("onclick", `deleteUsuario('${user._id}')`)
        listaUsuarios.appendChild(buttond);

        const buttonu = document.createElement('button')
        buttonu.dataset.id = user._id
        buttonu.setAttribute("id", `update-button-${user._id}`)
        buttonu.innerText = "Editar"
        var jsonUser = JSON.stringify(user)
        buttonu.setAttribute("onclick", `editUsuario(${jsonUser})`)
        listaUsuarios.appendChild(buttonu)
        
        listaUsuarios.innerHTML += "</ul><br><hr>"
    }    
}

//escutador de eventos de formulario
document.addEventListener('DOMContentLoaded', (event) => {
    const usuarioForm = document.querySelector('#createUsuario')
    const usuarioUpdateForm = document.querySelector('#updateUsuario')

    usuarioUpdateForm.addEventListener('submit', updateUsuario)
    usuarioForm.addEventListener('submit', createUsuario)
});

//resgatando dados de formulario de evento
function reunirInfoForm(){
    return {
        id: event.target.id.value,
        nome: event.target.nome.value,
        email: event.target.email.value,
        telefone: event.target.telefone.value,
        anexo: event.target.anexo.value,
        observacao: event.target.observacao.value
    }
}

//CREATE (colocando o usuario no banco)
async function createUsuario(event){
    event.preventDefault();
    let novoUsuario = reunirInfoForm();
    try {
        const response = await fetch('https://crudrafaeltrust.herokuapp.com/usr', {
        method: "POST",
        headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(novoUsuario)
        }) 
        const users = await fetch('https://crudrafaeltrust.herokuapp.com/usr')
        const data = await users.json();
        show(data)
    } catch (error) {
        console.log(error)
    }
}

//UPDATE (atualizando o usuario no banco)
//alimentando formulario de edição
function editUsuario(user){
    const usuarioUpdate = document.querySelector('#updateUsuario')
    usuarioUpdate.setAttribute("style", "display: block;")
    document.querySelector('#upTitulo').innerHTML = `Editando ${user.nome}`
    document.querySelector('#upNome').value = user.nome;
    document.querySelector('#upEmail').value = user.email;
    document.querySelector('#upTelefone').value = user.telefone;
    document.querySelector('#upAnexo').value = user.anexo;
    document.querySelector('#upObservacao').value = user.observacao;
    document.querySelector('#upId').value = user._id;
}

//voltar da edição
function voltar(){
    document.querySelector('#updateUsuario').setAttribute("style", "display: none;")
}

//atualizando usuario após o evento
async function updateUsuario(event){
    event.preventDefault();
    let upUsuario = reunirInfoForm()
    const zerarUpdate = document.querySelector('#updateUsuario')
    zerarUpdate.innerHTML = ""
    console.log(`${upUsuario.name} esta atualizando`)
    try {
        await fetch(`https://crudrafaeltrust.herokuapp.com/usr/${upUsuario.id}`, {
            method: "PATCH",
            body: JSON.stringify(upUsuario),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const users = await fetch('https://crudrafaeltrust.herokuapp.com/usr')
        const data = await users.json();
        show(data)
    } catch (error) {
        console.log(error)
    }
    console.log(`${upUsuario.nome} foi atualizado`)
}

//DELETE (deletando o usuario)
async function deleteUsuario(id){
    try {
        const resposta = await fetch(`https://crudrafaeltrust.herokuapp.com/usr/${id}`, {
            method: "DELETE"
        })   
        const users = await fetch('https://crudrafaeltrust.herokuapp.com/usr')
        const data = await users.json();
        show(data)
    } catch (error) {
        console.log(error)
    }
}