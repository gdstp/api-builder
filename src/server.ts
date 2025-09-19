import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import { requireEnv, logger } from "./utils";
import z from "zod";
import withInputValidation from "./middlewares/validation";
import { AppError } from "./utils/AppError";

dotenv.config();

const app = express();
const PORT = requireEnv("API_PORT");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

const signUpParams = z
  .object({
    name: z.string("name is a required field").min(1),
    email: z.email(),
    password: z.string("password is required field").min(8),
    confirmPassword: z.string("confirmPassword is required field").min(8),
  })
  .strict();

// type SignUpParams = z.infer<typeof signUpParams>;

app.post(
  "/sign-up",
  withInputValidation({ body: signUpParams }),
  (req, res) => {
    // const input = req.body;
    res.send("Hello, world!");
  },
);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ error: err.message, details: err.fields ?? null });
  }

  if ((err as { type: string })?.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  logger.error("UnhandledError", {
    err: {
      name: (err as { name: string })?.name,
      message: (err as { message: string })?.message,
      stack: (err as { stack: string })?.stack,
    },
  });

  res.status(500).json({ error: "Internal Server Error" });
});

// app.post("/sign-up", (req, res) => {
//   try {
//     console.log(req.body);
//     const input = z.parse(signUpParams, req.body);
//     res.send("Hello, world!");
//     return;
//   } catch (error) {
//     logger.error("Error parsing sign up params", { error });
//     if (error instanceof z.ZodError) {
//       res.status(400).send({
//         message: "Invalid request",
//         statusCode: 400,
//         code: "INVALID_REQUEST",
//         fields: error.issues.reduce(
//           (acc, issue) => {
//             acc[issue.path.join(".")] = issue.message;
//             return acc;
//           },
//           {} as Record<string, string>,
//         ),
//       });
//       return;
//     }
//     res.status(400).send("Invalid request");
//     return;
//   }
// });

app.listen(PORT, () => {
  logger.info(`Server started at PORT: ${PORT}`);
});
