import express from "express";
import { getFollowersFeed } from "../controllers/postController.js";
import {
  listUsers,
  getUserProfile,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

// Feed Personalizado (Baseado em quem o usuário segue)
router.get("/feed/:userId", getFollowersFeed);
router.get("/users", listUsers);
router.get("/users/:username", getUserProfile);

// Rota para seguir alguém
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

router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

export default router;
