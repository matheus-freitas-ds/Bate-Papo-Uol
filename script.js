let username = "";
const inputEnviar = document.querySelector("input");

entrarChat();

function entrarChat() {
    username = prompt("Qual é o seu nome?");
    const usuario = { name: username };
    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", usuario);
    promessa.then(aceitarLogin);
    promessa.catch(negarLogin);
}

function aceitarLogin() {
    buscarDados();
    setInterval(buscarDados, 3000);
    avisarServidor();
    setInterval(avisarServidor, 5000);
}

function negarLogin(erro) {
    if (erro.response.status === 400) {
        alert("Tente outro nome, pois este já está sendo usado");
        entrarChat();
    }
}

function buscarDados() {
    const promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promessa.then(mostrarMensagens);
}

function mostrarMensagens(resposta) {
    console.log(resposta);
    const chat = document.querySelector(".chat");
    chat.innerHTML = "";
    for (let i = 0; i < resposta.data.lenght; i++) {
        if (resposta.data[i].type === "status") {u
            chat.innerHTML += `
            <li class="movimentacao-sala">
                <span class="tempo">(${resposta.data[i].time})</span> <span class="nome-usuarios">${resposta.data[i].from}</span> <span>${resposta.data[i].text}</span>
            </li>
                `;
        } else if (resposta.data[i].to === username && resposta.data[i].type === "private_message") {
            chat.innerHTML += ` 
            <li class="privada">
                <span class="tempo">(${resposta.data[i].time})</span> <span class="nome-usuarios">${resposta.data[i].from}</span> reservadamente para <span class="nome-usuarios">${resposta.data[i].to}:</span> <span>${resposta.data[i].text}</span>
            </li>
                `;
        } else {
            chat.innerHTML += `
            <li>
                <span class="tempo">(${resposta.data[i].time})</span> <span class="nome-usuarios">${resposta.data[i].from}</span> para <span class="nome-usuarios">${resposta.data[i].to}:</span> <span>${resposta.data[i].text}</span>
            </li>
                `;
        }
    }
    rolarMensagens();
}

function enviarMensagem() {
    const inputEnviar = document.querySelector("input");
    const textoInput = document.querySelector("input").value;
    const mensagem = {
        from: username,
        to: "Todos",
        text: textoInput,
        type: "message"
    }
    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagem);
    promessa.then(buscarDados);
    promessa.catch(recarregarPagina);
    resetarInput(inputEnviar);
}

function avisarServidor() {
    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", { name: username });
    promessa.catch(recarregarPagina);
}

function recarregarPagina() {
    window.location.reload();
}

function resetarInput(inputEnviar) {
    document.querySelector("input").value = "";
    inputEnviar.setAttribute("placeholder", "Escreva aqui...");
}

function rolarMensagens() {
    const ultimaMensagem = document.querySelector("li:last-child");
    ultimaMensagem.scrollIntoView();
}