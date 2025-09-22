import ProfileController from "@/controllers/profile.controller";
import SignInController from "@/controllers/sign-in.controller";
import SignUpController from "@/controllers/sign-up.controller";
import middlewares from "@/middlewares";
import { signInSchema } from "@/schemas/sign-in.schema";
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

router.post(
  "/sign-in",
  middlewares.withInputValidation({ schema: signInSchema, field: "body" }),
  async (req, res) => {
    const data = await SignInController(req.body);

    res.status(200).json({ success: true, data });
  },
);

router.post(
  "/profile",
  middlewares.withAuthenticationMiddleware,
  async (req, res) => {
    const data = await ProfileController({ userId: req.userId });

    res.status(200).json({ success: true, data });
  },
);

export default router;
