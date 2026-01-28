import { z } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      error: "Falha na validação dos dados",
      details: error.errors.map((err) => ({
        field: err.path[0],
        message: err.message,
      })),
    });
  }
};

export const userSchema = z.object({
  username: z.string().min(3, "Mínimo 3 caracteres").max(20),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 dígitos"),
  displayName: z.string().min(2).optional(),
});

export const postSchema = z.object({
  content: z.string().min(1).max(280),
  authorId: z.string(),
});
