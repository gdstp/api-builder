import dotenv from "dotenv";
import express from "express";
import { requireEnv } from "./utils";
import logger from "./logger";

dotenv.config();

const app = express();
const PORT = requireEnv("API_PORT");

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(PORT, () => {
  logger.info(`Server started at PORT: ${PORT}`, { port: PORT });
});
