import dotenv from "dotenv";
import express from "express";
import { requireEnv, logger } from "./utils";
import middlewares from "./middlewares";
import { signUpSchema } from "./schemas/signUp.schema";

dotenv.config();

const app = express();
const PORT = requireEnv("API_PORT");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.post(
  "/sign-up",
  middlewares.withInputValidation({ body: signUpSchema }),
  (req, res) => {
    // const input = req.body;
    res.send("Hello, world!");
  },
);

app.use(middlewares.withErrorHandler);

app.listen(PORT, () => {
  logger.info(`Server started at PORT: ${PORT}`);
});
