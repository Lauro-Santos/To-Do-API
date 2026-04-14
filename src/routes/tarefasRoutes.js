const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const verificarToken = require("../middlewares/auth");

// Exemplo: Buscar tarefas agora exige o Token
// GET - Listar
// localhost:3000/tarefas/1
router.get("/", verificarToken, async (req, res) => {
  // Agora buscamos as tarefas do ID que veio do TOKEN!
  const usuario_id = req.usuarioId;

  try {
    const queryText = "SELECT * FROM tarefas WHERE usuario_id = $1";
    const resultado = await pool.query(queryText, [usuario_id]);
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar suas tarefas" });
  }
});

// POST - Criar
// Criar uma tarefa para o usuário logado
router.post("/", verificarToken, async (req, res) => {
  const { titulo } = req.body; // Não pegamos mais o usuario_id do body!
  const usuario_id = req.usuarioId; // Pegamos do Token

  try {
    const queryText =
      "INSERT INTO tarefas (titulo, usuario_id) VALUES ($1, $2) RETURNING *";
    const resultado = await pool.query(queryText, [titulo, usuario_id]);

    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao criar tarefa" });
  }
});

//DELETE - Deletar
// Deletar uma tarefa específica
router.delete("/:id", verificarToken, async (req, res) => {
  const { id } = req.params; // ID da tarefa que vem na URL
  const usuario_id = req.usuarioId; // ID do dono que vem do Token

  try {
    // Só deleta se o ID da tarefa bater E o dono for o mesmo do Token
    const queryText = "DELETE FROM tarefas WHERE id = $1 AND usuario_id = $2";
    const resultado = await pool.query(queryText, [id, usuario_id]);

    if (resultado.rowCount === 0) {
      // Se não deletou nada, ou a tarefa não existe ou não pertence a esse usuário
      return res
        .status(404)
        .json({ erro: "Tarefa não encontrada ou permissão negada." });
    }

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao deletar tarefa" });
  }
});

//PACTH - Atualização parcial
// Marcar tarefa como concluída ou pendente
router.patch("/:id", verificarToken, async (req, res) => {
  const { id } = req.params;
  const { concluida } = req.body; // Esperamos um booleano: true ou false

  try {
    const queryText =
      "UPDATE tarefas SET concluida = $1 WHERE id = $2 RETURNING *";
    const values = [concluida, id];

    const resultado = await pool.query(queryText, values);

    if (resultado.rowCount === 0) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    res.json(resultado.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao atualizar status da tarefa" });
  }
});

module.exports = router;
