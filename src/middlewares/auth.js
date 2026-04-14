// src/middlewares/auth.js
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

function verificarToken(req, res, next) {
  const token = req.headers["x-access-token"]; // O token virá no cabeçalho da requisição

  if (!token) {
    return res.status(403).json({ erro: "Nenhum token fornecido" });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      // Se houver erro, ele responde e PARA aqui.
      return res.status(500).json({ erro: "Falha ao autenticar o token" });
    }

    // Se estiver correto, ele salva o ID e chama o next()
    req.usuarioId = decoded.id;
    next(); // <--- ESSA LINHA É O QUE FAZ A FILA ANDAR!
  });
}

module.exports = verificarToken;
