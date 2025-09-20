import SignUpController from "@/controllers/sign-up.controller";
import middlewares from "@/middlewares";
import { signUpSchema } from "@/schemas/sign-up.schema";
import { Router } from "express";

const router = Router();

router.post(
  "/sign-up",
  middlewares.withInputValidation({ schema: signUpSchema, field: "body" }),
  async (req, res) => {
    const data = await SignUpController(req.body);

    res.status(201).json({ success: true, data });
  },
);

export default router;
