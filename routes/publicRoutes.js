import express from "express";
import { register } from "../controllers/authController.js";
import { validate, userSchema } from "../middlewares/validateMiddleware.js";
import { prisma } from "../lib/prisma.js";

const router = express.Router();

router.post("/register", validate(userSchema), register);

router.get("/posts", async (req, res) => {
  const posts = await prisma.post.findMany({
    include: { author: { select: { username: true, displayName: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(posts);
});

export default router;
