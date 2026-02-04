import express from "express";
import { register, login } from "../controllers/authController.js";
import { validate, userSchema } from "../middlewares/validateMiddleware.js";
import { prisma } from "../lib/prisma.js";

const router = express.Router();

/**
 * @swagger
 * /register:
 * post:
 * summary: Cria um novo usuário
 * tags: [Autenticação]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [username, email, password]
 * properties:
 * username: { type: string, example: "leonardo_dev" }
 * email: { type: string, example: "leo@email.com" }
 * password: { type: string, example: "senha123" }
 * displayName: { type: string, example: "Leo Camargo" }
 * responses:
 * 201:
 * description: Usuário criado com sucesso
 */
router.post("/register", validate(userSchema), register);

/**
 * @swagger
 * /login:
 * post:
 * summary: Realiza o login e gera o Token JWT
 * tags: [Autenticação]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [email, password]
 * properties:
 * email: { type: string, example: "leo@email.com" }
 * password: { type: string, example: "senha123" }
 * responses:
 * 200:
 * description: Login realizado com sucesso
 */
router.post("/login", login);

/**
 * @swagger
 * /posts:
 * get:
 * summary: Retorna todos os posts da rede (Feed Global)
 * tags: [Postagens]
 * responses:
 * 200:
 * description: Lista de posts recuperada
 */
router.get("/posts", async (req, res) => {
  const posts = await prisma.post.findMany({
    include: { author: { select: { username: true, displayName: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(posts);
});

export default router;
