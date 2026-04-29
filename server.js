import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import routes from "./routes/routes.js";
import { swaggerSpec } from "./lib/swagger.js";


const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/", routes);

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 API rodando na porta ${port}`);
});

export default app;
