import SignUpController from "@/controllers/SignUpController";
import middlewares from "@/middlewares";
import { signUpSchema } from "@/schemas/signUp.schema";
import { Router } from "express";

const router = Router();

router.post(
  "/sign-up",
  middlewares.withInputValidation({ schema: signUpSchema, field: "body" }),
  async (req, res) => {
    const data = await SignUpController(req.body);

    res.status(200).json({ data });
  },
);

export default router;
