import userRouter from "./user.router";
import { Router } from "express";

const router = Router();

router.use("/user", userRouter);

export default router;
