import express from "express";
import { register } from "../controllers/authController.js";
import { prisma } from "../../lib/prisma.js"; // Ajuste o caminho se necessário

const router = express.Router();

// Rota de Cadastro Seguro
router.post("/register", register);

// Feed Global (público)
router.get("/posts", async (req, res) => {
  const posts = await prisma.post.findMany({
    include: { author: { select: { username: true, displayName: true } } },
    orderBy: { createdAt: "desc" }
  });
  res.json(posts);
});

export default router;