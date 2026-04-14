const API_URL = "http://localhost:3000";
let token = "";

function alternarTelas() {
  const login = document.getElementById("secao-login");
  const cadastro = document.getElementById("secao-cadastro");
  const msg = document.getElementById("mensagem");

  msg.innerText = "";
  if (login.style.display === "none") {
    login.style.display = "block";
    cadastro.style.display = "none";
  } else {
    login.style.display = "none";
    cadastro.style.display = "block";
  }
}

async function registrarUsuario() {
  const nome = document.getElementById("cad-nome").value;
  const email = document.getElementById("cad-email").value;
  const senha = document.getElementById("cad-senha").value;

  try {
    const response = await fetch(`${API_URL}/usuarios/registrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
    });

    if (response.ok) {
      alert("Usuário criado com sucesso! Agora faça login.");
      alternarTelas();
    } else {
      const erro = await response.json();
      alert("Erro no cadastro: " + (erro.erro || "Verifique os dados"));
    }
  } catch (err) {
    console.error("Erro ao conectar com a API:", err);
  }
} // Fim do registrarUsuario

async function fazerLogin() {
  const email = document.getElementById("login-email").value;
  const senha = document.getElementById("login-senha").value;
  const mensagem = document.getElementById("mensagem");

  try {
    const response = await fetch(`${API_URL}/usuarios/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const dados = await response.json();

    if (response.ok && dados.token) {
      localStorage.setItem("token", dados.token);
      token = dados.token;

      mensagem.style.color = "green";
      mensagem.innerText = "Login realizado com sucesso!";

      document.getElementById("tela-auth").style.display = "none";
      document.getElementById("area-tarefas").style.display = "block";

      carregarTarefas();
    } else {
      mensagem.style.color = "red";
      mensagem.innerText =
        "Erro: " + (dados.erro || "Usuário ou senha inválidos");
    }
  } catch (err) {
    console.error("Erro na requisição:", err);
    mensagem.innerText = "Erro ao conectar com o servidor.";
  }
}

async function carregarTarefas() {
  const lista = document.getElementById("lista-tarefas");
  // Recuperamos o token que guardamos no login
  const tokenSalvo = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/tarefas`, {
      headers: { "x-access-token": tokenSalvo },
    });

    const tarefas = await response.json();
    lista.innerHTML = ""; // Limpa a lista antes de preencher

    tarefas.forEach((t) => {
      const li = document.createElement("li");

      // Se estiver concluída, adiciona um risco no texto
      const estiloTexto = t.concluida
        ? "text-decoration: line-through; color: gray; background-color: #88f797;"
        : "";

      li.innerHTML = `
        <span style="cursor: pointer; ${estiloTexto}" onclick="alternarConcluida(${t.id}, ${t.concluida})">
            ${t.titulo}
        </span>
        <button onclick="deletarTarefa(${t.id})" style="width: auto; background: #e74c3c; padding: 5px 12px; margin-left: 10px; font-size: 1.5rem;">
            🗑
        </button>
    `;
      lista.appendChild(li);
    });
  } catch (err) {
    console.error("Erro ao carregar tarefas:", err);
  }
}

async function criarTarefa() {
  const input = document.getElementById("nova-tarefa");
  const titulo = input.value;
  const tokenSalvo = localStorage.getItem("token");

  if (!titulo) return alert("Digite algo!");

  try {
    const response = await fetch(`${API_URL}/tarefas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": tokenSalvo,
      },
      body: JSON.stringify({ titulo }),
    });

    if (response.ok) {
      input.value = ""; // Limpa o campo
      carregarTarefas(); // Recarrega a lista para mostrar a nova tarefa
    }
  } catch (err) {
    console.error("Erro ao criar tarefa:", err);
  }
}

// Função para marcar/desmarcar tarefa como concluída
async function alternarConcluida(id, statusAtual) {
  const tokenSalvo = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/tarefas/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": tokenSalvo,
      },
      body: JSON.stringify({ concluida: !statusAtual }), // Inverte o status
    });

    if (response.ok) {
      carregarTarefas(); // Recarrega a lista para mostrar a mudança
    }
  } catch (err) {
    console.error("Erro ao atualizar tarefa:", err);
  }
}

// Função para deletar a tarefa
async function deletarTarefa(id) {
  if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;

  const tokenSalvo = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/tarefas/${id}`, {
      method: "DELETE",
      headers: { "x-access-token": tokenSalvo },
    });

    if (response.ok) {
      carregarTarefas();
    }
  } catch (err) {
    console.error("Erro ao deletar tarefa:", err);
  }
}

function logout() {
  localStorage.removeItem("token");
  location.reload(); // Recarrega a página e volta pro login
}
