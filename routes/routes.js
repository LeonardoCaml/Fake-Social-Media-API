import express from "express";
import { prisma } from "../lib/prisma.js";
import { validate, userSchema, postSchema } from "../middlewares/validateMiddleware.js";
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
router.get("/users", listUsers);
router.get("/users/:username", getUserProfile);
router.post("/users", validate(userSchema), createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// ── Posts ─────────────────────────────────────────────
router.get("/posts", async (req, res) => {
  const posts = await prisma.post.findMany({
    include: { author: { select: { username: true, displayName: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(posts);
});

router.post("/posts", validate(postSchema), createPost);

// ── Feed ──────────────────────────────────────────────
router.get("/feed/:userId", getFollowersFeed);

// ── Follows ───────────────────────────────────────────
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
