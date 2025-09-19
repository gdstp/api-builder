import dotenv from "dotenv";
import express from "express";
import { requireEnv, logger } from "./utils";
import middlewares from "./middlewares";
import v1Router from "./routes/v1";

dotenv.config();

const app = express();
const PORT = requireEnv("API_PORT");

app.use(express.json());

app.use("/v1", v1Router);

app.use(middlewares.withErrorHandler);

app.listen(PORT, () => {
  logger.info(`Server started at PORT: ${PORT}`);
});
