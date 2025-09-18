import dotenv from "dotenv";
import express from "express";
import { requireEnv } from "./utils";

dotenv.config();

const app = express();
const PORT = requireEnv("API_PORT");

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
