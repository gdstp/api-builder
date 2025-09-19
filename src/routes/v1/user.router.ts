import SignUpController from "@/controllers/SignUpController";
import middlewares from "@/middlewares";
import { signUpSchema } from "@/schemas/signUp.schema";
import logger from "@/utils/logger";
import { Router } from "express";

const router = Router();

router.post(
  "/sign-up",
  middlewares.withInputValidation({ body: signUpSchema }),
  async (req, res) => {
    try {
      const data = await SignUpController(req.body);

      res.status(200).json({ data });
    } catch (error) {
      logger.error("Error signing up", { error });
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

export default router;
