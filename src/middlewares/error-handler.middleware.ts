import { AppError } from "@/utils/app-error";
import logger from "@/utils/logger";
import { NextFunction, Request, Response } from "express";

export default function withErrorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  logger.error("Application error occurred", {
    message: err.message,
    stack: err.stack,
    endpoint: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    timestamp: new Date().toISOString(),
  });

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
        ...(err.fields && { fields: err.fields }),
      },
    });
    return;
  }

  if (err.message.includes("Unique constraint failed")) {
    res.status(409).json({
      success: false,
      error: {
        code: "DUPLICATE_ENTRY",
        message: "A record with this information already exists",
      },
    });
    return;
  }

  res.status(500).json({ success: false, error: "Internal Server Error" });
}
