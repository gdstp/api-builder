import { logger } from "@/utils";
import { AppError } from "@/utils/AppError";
import { RequestHandler } from "express";
import z from "zod";

type ZodType = z.ZodType;

type Infer<T extends ZodType> = T extends ZodType ? z.infer<T> : unknown;

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

        logger.warning("Validation failed", {
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
