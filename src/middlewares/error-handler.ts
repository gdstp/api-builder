import { AppError } from "@/utils/AppError";
import logger from "@/utils/logger";
import { NextFunction, Request, Response } from "express";

export default function withErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
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
}
