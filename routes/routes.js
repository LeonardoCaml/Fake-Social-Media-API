import express from "express";
import { prisma } from "../lib/prisma.js";
import { validate, userSchema, updateUserSchema, postSchema } from "../middlewares/validateMiddleware.js";
import {
  listUsers,
  getUserProfile,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { createPost, getFollowersFeed } from "../controllers/postController.js";

const router = express.Router();

// ── Usuários ──────────────────────────────────────────

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Usuários]
 *     summary: Lista usuários com paginação e busca
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Filtra por username ou displayName
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/User' }
 */
router.get("/users", listUsers);

/**
 * @openapi
 * /users/{username}:
 *   get:
 *     tags: [Usuários]
 *     summary: Retorna o perfil de um usuário pelo username
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Perfil do usuário (sem senha)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       404:
 *         description: Usuário não encontrado
 */
router.get("/users/:username", getUserProfile);

/**
 * @openapi
 * /users:
 *   post:
 *     tags: [Usuários]
 *     summary: Cria um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email]
 *             properties:
 *               username: { type: string, minLength: 3, maxLength: 20 }
 *               email: { type: string, format: email }
 *               displayName: { type: string, minLength: 2 }
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Validação falhou ou e-mail/username já em uso
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.post("/users", validate(userSchema), createUser);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     tags: [Usuários]
 *     summary: Atualiza dados de um usuário (displayName, bio, avatarUrl)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayName: { type: string, minLength: 2 }
 *               bio: { type: string, maxLength: 160 }
 *               avatarUrl: { type: string, format: uri }
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *       400:
 *         description: Dados inválidos
 */
router.put("/users/:id", validate(updateUserSchema), updateUser);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags: [Usuários]
 *     summary: Remove um usuário e todos os seus posts/follows
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Usuário deletado
 *       500:
 *         description: Erro ao deletar
 */
router.delete("/users/:id", deleteUser);

// ── Posts ─────────────────────────────────────────────

/**
 * @openapi
 * /posts:
 *   get:
 *     tags: [Posts]
 *     summary: Lista todos os posts em ordem cronológica inversa
 *     responses:
 *       200:
 *         description: Lista de posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Post' }
 */
router.get("/posts", async (req, res) => {
  const posts = await prisma.post.findMany({
    include: { author: { select: { username: true, displayName: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(posts);
});

/**
 * @openapi
 * /posts:
 *   post:
 *     tags: [Posts]
 *     summary: Cria um novo post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content, authorId]
 *             properties:
 *               content: { type: string, minLength: 1, maxLength: 280 }
 *               authorId: { type: string }
 *     responses:
 *       201:
 *         description: Post criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Post' }
 *       400:
 *         description: Validação falhou
 */
router.post("/posts", validate(postSchema), createPost);

// ── Feed ──────────────────────────────────────────────

/**
 * @openapi
 * /feed/{userId}:
 *   get:
 *     tags: [Feed]
 *     summary: Retorna o feed do usuário com posts de quem ele segue
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lista de posts do feed
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Post' }
 */
router.get("/feed/:userId", getFollowersFeed);

// ── Follows ───────────────────────────────────────────

/**
 * @openapi
 * /follow:
 *   post:
 *     tags: [Follows]
 *     summary: Cria uma relação de seguidor entre dois usuários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [followerId, followingId]
 *             properties:
 *               followerId: { type: string }
 *               followingId: { type: string }
 *     responses:
 *       201:
 *         description: Follow criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Follow' }
 *       400:
 *         description: Erro ao seguir (ex. já segue ou IDs inválidos)
 */
router.post("/follow", async (req, res) => {
  const { followerId, followingId } = req.body;
  try {
    const follow = await prisma.follows.create({
      data: { followerId, followingId },
    });
    res.status(201).json(follow);
  } catch (error) {
    res.status(400).json({ error: "Erro ao seguir usuário." });
  }
});

export default router;
