import { z } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      error: "Falha na validação dos dados",
      details: error.issues.map((err) => ({
        field: err.path[0],
        message: err.message,
      })),
    });
  }
};

export const userSchema = z.object({
  username: z.string().min(3, "Mínimo 3 caracteres").max(20),
  email: z.string().email("E-mail inválido"),
  displayName: z.string().min(2).optional(),
});

export const updateUserSchema = z.object({
  displayName: z.string().min(2).optional(),
  bio: z.string().max(160).optional(),
  avatarUrl: z.string().url("URL inválida").optional(),
});

export const postSchema = z.object({
  content: z.string().min(1).max(280),
  authorId: z.string(),
});
