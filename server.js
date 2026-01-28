import express from "express";
import cors from "cors";
import morgan from "morgan";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import publicRoutes from "./routes/publicRoutes.js";
import privateRoutes from "./routes/privateRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/", publicRoutes);
app.use("/", authMiddleware, privateRoutes);

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 API rodando na porta ${port}`);
});
