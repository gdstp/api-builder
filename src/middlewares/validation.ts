/* eslint-disable @typescript-eslint/no-explicit-any */

import { logger } from "@/utils";
import { AppError } from "@/utils/AppError";
import { RequestHandler } from "express";
import z from "zod";

type Infer<T extends z.ZodType> = T extends z.ZodType ? z.infer<T> : unknown;

type ZodType = z.ZodType;

export default function withInputValidation<P extends ZodType>({
  schema,
  field,
}: {
  schema: P;
  field: "body" | "query" | "params";
}): RequestHandler<Infer<P>, any, Infer<P>, Infer<P>> {
  return (req, _res, next) => {
    try {
      schema.parse(req[field]);

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.issues.reduce(
          (acc, issue) => {
            acc[issue.path.join(".")] = issue.message;
            return acc;
          },
          {} as Record<string, string>,
        );

        logger.warn("Validation failed", {
          endpoint: req.path,
          method: req.method,
          errors: formattedErrors,
          userAgent: req.get("User-Agent"),
          ip: req.ip,
        });

        next(
          new AppError(
            "Invalid request input",
            400,
            "INVALID_REQUEST",
            formattedErrors,
          ),
        );
      }

      logger.error("Unexpected validation error", {
        error: error instanceof Error ? error.message : String(error),
        endpoint: req.path,
        method: req.method,
      });

      next(new AppError("Invalid request data", 400, "INVALID_REQUEST"));
    }
  };
}
