require("dotenv").config(); // ESSA TEM QUE SER A LINHA 1
const cors = require("cors");
const express = require("express");
const app = express();

app.use(cors()); // Isso libera sua API para ser acessada por "fora"
app.use(express.json());

// Pega a porta do .env ou usa a 3000 como padrão (fallback)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

const produtosRoutes = require("./src/routes/produtosRoutes"); // Importa as rotas
const usuariosRoutes = require("./src/routes/usuariosRoutes"); // Importa as rotas
const tarefasRoutes = require("./src/routes/tarefasRoutes"); // Importa as rotas

app.use(express.json());

// Rota produtos
app.use("/produtos", produtosRoutes);

// Rota usuarios
app.use("/usuarios", usuariosRoutes);

// Rota tarefas
app.use("/tarefas", tarefasRoutes);

app.listen(PORT, () => {
  console.log(`Servidor organizado rodando na porta ${PORT}`);
});
