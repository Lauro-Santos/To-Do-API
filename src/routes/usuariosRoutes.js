const express = require("express");
const router = express.Router();

const pool = require("../config/db"); // Importa a conexão que você testou
const verificarToken = require("../middlewares/auth");

const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET; // No futuro, isso vai para o .env

// Rota de Login (Gera o Token)
// Rota de Login atualizada
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    // 1. Buscar o usuário pelo email
    const resultado = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email],
    );

    if (resultado.rowCount === 0) {
      return res.status(401).json({ erro: "Usuário ou senha inválidos" });
    }

    const usuario = resultado.rows[0];

    // 2. Comparar a senha enviada com o hash do banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: "Usuário ou senha inválidos" });
    }

    // 3. Se deu certo, gerar o Token (como já fazíamos)
    const token = jwt.sign({ id: usuario.id }, SECRET, { expiresIn: "1h" });

    res.json({ auth: true, token: token });
  } catch (err) {
    res.status(500).json({ erro: "Erro no servidor ao fazer login" });
  }
});

// GET - Listar
router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT * FROM usuarios");
    res.json(resultado.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ erro: "Erro ao salvar no banco de dados" });
  }
});

// POST - Criar
const bcrypt = require("bcrypt");
const saltRounds = 10; // Nível de "complexidade" da criptografia

// Registrar novo usuário
router.post("/registrar", async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    // 1. Gerar o hash da senha
    const hash = await bcrypt.hash(senha, saltRounds);

    // 2. Salvar no banco o HASH, nunca a senha pura
    const queryText =
      "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email";
    const values = [nome, email, hash];

    const resultado = await pool.query(queryText, values);
    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao registrar usuário" });
  }
});

// Deletar a própria conta (Precisa estar logado!)
// Usamos o 'verificarToken' para ter certeza de quem está deletando
router.delete("/me", verificarToken, async (req, res) => {
  const usuario_id = req.usuarioId; // ID que veio do Token

  try {
    // 1. Deletar as tarefas do usuário primeiro (se não houver ON DELETE CASCADE no BD)
    await pool.query("DELETE FROM tarefas WHERE usuario_id = $1", [usuario_id]);

    // 2. Deletar o usuário
    const resultado = await pool.query("DELETE FROM usuarios WHERE id = $1", [
      usuario_id,
    ]);

    if (resultado.rowCount === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    res.status(204).send(); // Sucesso, sem conteúdo para retornar
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao deletar conta" });
  }
});

//PUT - Atualiza
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, email } = req.body;

  try {
    const queryText = "UPDATE usuarios SET nome = $1 WHERE id = $2 RETURNING *";
    const values = [nome, id];

    const resultado = await pool.query(queryText, values);
    console.log(
      `Tentando atualizar o ID: ${id} com Nome: ${nome} e Email: ${email}`,
    );
    // Se o resultado.rowCount for 0, significa que o ID não existia no banco
    if (resultado.rowCount === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    // Retornamos o usuário atualizado com status 200
    res.status(200).json(resultado.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ erro: "Erro ao atualizar os dados" });
  }
});

// Exportamos o roteador
module.exports = router;
