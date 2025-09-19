/* eslint-disable @typescript-eslint/no-explicit-any */

import { logger } from "@/utils";
import { AppError } from "@/utils/AppError";
import { RequestHandler } from "express";
import z from "zod";

type Infer<T extends z.ZodType | undefined> = T extends z.ZodType
  ? z.infer<T>
  : unknown;

type ZodType = z.ZodType | undefined;

export default function withInputValidation<
  P extends ZodType,
  Q extends ZodType,
  B extends ZodType,
>({
  body,
  query,
  params,
}: {
  body?: B;
  query?: Q;
  params?: P;
}): RequestHandler<Infer<P>, any, Infer<B>, Infer<Q>> {
  return (req, _res, next) => {
    try {
      if (params) req.params = params.parse(req.params) as any;
      if (query) req.query = query.parse(req.query) as any;
      if (body) req.body = body.parse(req.body) as any;
      next();
    } catch (error) {
      logger.error("Error parsing input", { error });
      if (error instanceof z.ZodError) {
        next(
          new AppError(
            "Invalid request input",
            400,
            "INVALID_REQUEST",
            error.issues.reduce(
              (acc, issue) => {
                acc[issue.path.join(".")] = issue.message;
                return acc;
              },
              {} as Record<string, string>,
            ),
          ),
        );
      }
    }
    next(new AppError("Invalid request input", 400, "INVALID_REQUEST"));
  };
}
