import express from "express";
import cors from "cors";
import morgan from "morgan";

import routes from "./routes/routes.js";

import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const app = express();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fake Social Media API",
      version: "2.0.0",
      description: "API de Rede Social para testes — sem autenticação",
    },
    servers: [
      {
        url: "https://fake-social-media-api.onrender.com",
        description: "Servidor de Produção",
      },
      {
        url: "http://localhost:3000",
        description: "Servidor Local",
      },
    ],
  },
  apis: ["./routes/*.js", "./server.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/", routes);

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 API rodando na porta ${port}`);
});

export default app;
