import dotenv from "dotenv";
import express from "express";
import { requireEnv, logger } from "./utils";
import middlewares from "./middlewares";
import apiRouter from "./routes";
import setupHelmetConfig from "./lib/helmet-config";
import swaggerUi from "swagger-ui-express";
import { swaggerConfig, swaggerSpec } from "./lib/swagger-config";

dotenv.config();

export const app = express();
const PORT = requireEnv("API_PORT");

app.use(express.json());

app.use(setupHelmetConfig());

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerConfig),
);

app.use("/api", apiRouter);

app.use(middlewares.withErrorHandler);

app.listen(PORT, () => {
  logger.info(`Server started at PORT: ${PORT}`);
});
