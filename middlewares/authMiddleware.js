import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  // O padrão do header é: "Bearer TOKEN_AQUI"
  const parts = authHeader.split(" ");
  const [scheme, token] = parts;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Injeta o ID do usuário na requisição
    return next(); // Autorizado! Pode ir para o Controller.
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
};