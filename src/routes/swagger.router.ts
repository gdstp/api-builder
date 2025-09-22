import { swaggerSpec } from "@/lib/swagger-config";
import { Router } from "express";

const router = Router();

router.get("/json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

export default router;
