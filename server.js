import express from "express";
import cors from "cors";
import morgan from "morgan";

import { authMiddleware } from "./middlewares/authMiddleware.js";

import publicRoutes from "./routes/publicRoutes.js";
import privateRoutes from "./routes/privateRoutes.js";

import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const app = express();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fake Social Media API",
      version: "1.0.0",
      description: "API de Rede Social com Autenticação JWT",
    },
    servers: [
      {
        url: "https://fake-social-media-api.onrender.com",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./server.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/", publicRoutes);
app.use("/", authMiddleware, privateRoutes);

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 API rodando na porta ${port}`);
});
