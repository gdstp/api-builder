import dotenv from "dotenv";
import express from "express";
import { requireEnv, logger } from "./utils";
import middlewares from "./middlewares";
import apiRouter from "./routes";
import setupHelmetConfig from "./lib/helmet-config";
import swaggerUi from "swagger-ui-express";
import { swaggerConfig, swaggerSpec } from "./lib/swagger-config";
import morganConfig from "./lib/morgan.config";
import rateLimit from "express-rate-limit";

dotenv.config();

export const app = express();
const PORT = requireEnv("API_PORT");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
});

app.use(limiter);
app.use(express.json());

app.use(setupHelmetConfig());
app.use(morganConfig);

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
