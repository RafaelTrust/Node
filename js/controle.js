//valor da url da api
//const url ='http://localhost:8877'
const url = 'https://crudapirafaeltrust.herokuapp.com'
var idUsuarios = new Array()
var usuariosBanco = new Array({})
var pagina = 1;
var totalPaginacao = 0;
//iniciando a pagina com os dados
//READ (pegando valores existentes no banco)
async function getContent(){
    usuariosBanco = new Array()
    try {
        const response = await fetch(`${url}/usr`)   

        const data = await response.json()
        for(let user of data){
            usuariosBanco.push(user)
        }
        show()
    } catch (error) {
        console.error(error)
    }
}
getContent()

//recarregar pagina
async function getContentEvent(event){
    event.preventDefault();
    usuariosBanco = new Array()
    try {
        const response = await fetch(`${url}/usr`)   

        const data = await response.json()
        for(let user of data){
            usuariosBanco.push(user)
        }
        show()
    } catch (error) {
        console.error(error)
    }
}

//colocando os dados na tabela
function show(){
    const listaUsuarios = document.querySelector('#listaUsuarios')
    const paginacao = document.querySelector('#paginacao')
    if(usuariosBanco.length > 0){
        listaUsuarios.innerHTML = "";
        paginacao.innerHTML = "";
        let posicaoPagina = pagina*5
        totalPaginacao = (usuariosBanco.length / 5)
        totalPaginacao = Math.ceil(totalPaginacao);
        let inicialPag = posicaoPagina - 5
        let finalPag = 0
        if(pagina < totalPaginacao){
            finalPag = posicaoPagina
        }else{
            finalPag = usuariosBanco.length
        }
        let qntMostrando = finalPag - inicialPag
        
        for(var i = inicialPag; i < finalPag; i++ ){
            let nomeArquivo = usuariosBanco[i].anexo.split('/')[2]
            listaUsuarios.innerHTML += `
            <tr>
                <td>
                    
                </td>
                <td>${usuariosBanco[i].nome}</td>
                <td>${usuariosBanco[i].email}</td>
                <td>${usuariosBanco[i].telefone}</td>
                <td>${usuariosBanco[i].observacao}</td>
                <td><a href="${usuariosBanco[i].anexo}" download>${nomeArquivo}</a></td>
                <td>
                    <a "javascript:;" onclick="editUsuario(${i})" style="cursor: pointer;" class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                    <a "javascript:;" onclick="delUsuario(${i})" style="cursor: pointer;" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                </td>
            </tr>`
        }
        paginacao.innerHTML += `<li class="page-item disabled"><a href="javascript:paginacaoAnterior()">Anterior</a></li>`
        for(var i = 1; i <= totalPaginacao; i++){
            if(pagina == i){
                paginacao.innerHTML += `<li class="page-item active"><a href="javascript:paraPagina(${i})" class="page-link">${i}</a></li>`
            }else{
                paginacao.innerHTML += `<li class="page-item"><a href="javascript:paraPagina(${i})" class="page-link">${i}</a></li>`
            }
        }
        paginacao.innerHTML += `<li class="page-item disabled"><a href="javascript:paginacaoProximo()">Próximo</a></li>`

        document.querySelector('#valoresPaginas').innerHTML = `Mostrando <b>${qntMostrando}</b> de um total de <b>${usuariosBanco.length}</b> respostas`
    }
}

function paginacaoAnterior(){
    if(pagina > 1){
        pagina--;
    }
    show()
}

function paginacaoProximo(){
    if(pagina < totalPaginacao){
        pagina++;
    }
    show()
}

function paraPagina(i){
    pagina = i;
    show()
}
//escutador de eventos de formulario
document.addEventListener('DOMContentLoaded', (event) => {
    const usuarioForm = document.querySelector('#createUsuario')
    const usuarioUpdateForm = document.querySelector('#updateUsuario')
    const deletarUsuario = document.querySelector('#confirmarDelete')
    const usuarioGet = document.querySelector('#recarregar')

    usuarioGet.addEventListener('onclick', getContentEvent)
    usuarioUpdateForm.addEventListener('submit', updateUsuario)
    usuarioForm.addEventListener('submit', createUsuario)
    deletarUsuario.addEventListener('submit', deleteUsuario)
});

//CREATE (colocando o usuario no banco)
function createUsuario(event){
    const usuarioForm = document.querySelector('#createUsuario')
    const file = document.getElementById('fileCreate')
    let novoUsuario = new FormData(usuarioForm);

    fetch(`${url}/usr`, {
        method: 'POST',
        body: novoUsuario,
        redirect: 'follow'
    }).then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

//UPDATE (atualizando o usuario no banco)
//alimentando formulario de edição
function editUsuario(i){
    let user = usuariosBanco[i];
    $("#editEmployeeModal").modal();
    document.querySelector('#upTitulo').innerHTML = `Editando ${user.nome}`
    document.querySelector('#upNome').value = user.nome;
    document.querySelector('#upEmail').value = user.email;
    document.querySelector('#upTelefone').value = user.telefone;
    document.querySelector('#anexoAntigo').value = user.anexo;
    document.querySelector('#upObservacao').value = user.observacao;
    document.querySelector('#upId').value = user._id;
    document.querySelector('#upEmailAntigo').value = user.email;
    document.querySelector('#boolAnexo').value = "false";
}

//função para habilitar alteração do anexo
function habilitarAnexo(){
    let anexoInput = document.querySelector('#upAnexo')
    let mudarAnexo = document.querySelector('#mudarAnexo')
    let boolAnexo = document.querySelector('#boolAnexo')

    if(boolAnexo.value === "false"){
        anexoInput.setAttribute('style', 'display: block;')
        mudarAnexo.value = "Não Inserir"
        boolAnexo.value = "true"
    }else{
        anexoInput.setAttribute('style', 'display: none;')
        mudarAnexo.value = "Inserir"
        boolAnexo.value = "false"
    }
    
}

//voltar da edição
function voltar(){
    document.querySelector('#updateUsuario').setAttribute("style", "display: none;")
}


//atualizando usuario após o evento
function updateUsuario(event){
    const usuarioUpForm = document.querySelector('#updateUsuario')
    let usuarioUp = new FormData(usuarioUpForm);

    if(!((usuarioUp.get('boolAnexo') === "true") && (usuarioUp.get('anexo').name === ''))){
        fetch(`${url}/usr/${usuarioUp.get("id")}`, {
            method: 'PATCH',
            body: usuarioUp,
            redirect: 'follow'
        }).then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }else{
        alert('Anexo vazio! Precisa colocar algum arquivo em anexo ou trocar para não inserir')
    }
}

function delUsuario(id){
    $('#deleteEmployeeModalInd').modal()
    let user = usuariosBanco[id]
    document.querySelector('#tituloDelete').innerHTML = `Deletando ${user.nome}`
    document.querySelector('#idDelete').value = user._id
}

//DELETE (deletando o usuario)
async function deleteUsuario(event){
    let id = document.querySelector('#idDelete').value
    try {
        const resposta = await fetch(`${url}/usr/${id}`, {
            method: "DELETE"
        })   
        getContent()
    } catch (error) {
        console.log(error)
    }
}

function selecionando(id){
    debugger;
    let checkDelete = documet.querySelector(`#checkbox${id}`)
    let repetiu = false;
    let index = 0
    for(let usr of idUsuarios){
        if(usr == id){
            repetiu = true;
        }
    }
    if(checkDelete.checked){
        if(!repetiu){
            idUsuarios.push(id);
        }
    }else{
        if(repetiu){
            index = idUsuarios.index(id)
            idUsuarios.splice(index, 1)
        }
    }
}

async function deleteVariosUsuario(){ 
    try {
        for(var id of idUsuarios){
            const resposta = await fetch(`${url}/usr/${id}`, {
                method: "DELETE"
            })
        }

        getContent()
    } catch (error) {
        console.log(error)
    }
}