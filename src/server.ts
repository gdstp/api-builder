import dotenv from "dotenv";
import express from "express";
import { requireEnv, logger } from "./utils";

dotenv.config();

const app = express();
const PORT = requireEnv("API_PORT");

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(PORT, () => {
  logger.info(`Server started at PORT: ${PORT}`);
});
