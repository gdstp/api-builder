import userRouter from "./user.router";
import { Router } from "express";

const router = Router();

/**
 *
 * API V1 Routes
 *
 */

router.use("/v1/user", userRouter);

export default router;
