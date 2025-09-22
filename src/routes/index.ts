import swaggerRouter from "./swagger.router";
import userRouter from "./user.router";
import { Router } from "express";

const router = Router();

/**
 *
 * API V1 Routes
 *
 */

router.use("/v1/user", userRouter);

/**
 *
 * API Docs Routes
 *
 */

router.use("/v1/docs", swaggerRouter);

export default router;
