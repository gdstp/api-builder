import withErrorHandler from "@/middlewares/error-handler.middleware";
import { AppError } from "@/utils/AppError";
import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import express from "express";
import logger from "@/utils/logger";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

beforeEach(() => {
  logger.level = "silent";
});

describe("ErrorHandlerMiddleware", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  it("should handle AppError", async () => {
    const error = new AppError("Not found test error", 404, "NOT_FOUND");
    app.get("/test", () => {
      throw error;
    });
    app.use(withErrorHandler);

    const result = await request(app)
      .get("/test")
      .send()
      .expect(error.statusCode);

    expect(result.body).toEqual({
      success: false,
      error: {
        message: error.message,
        code: error.code,
      },
    });
  });

  it("should handle Unique constraint failed", async () => {
    const error = new PrismaClientKnownRequestError(
      "Unique constraint failed",
      {
        code: "P2002",
        clientVersion: "6.16.2",
      },
    );
    app.get("/test", () => {
      throw error;
    });
    app.use(withErrorHandler);

    const result = await request(app).get("/test").send().expect(409);

    expect(result.body).toEqual({
      success: false,
      error: {
        code: "DUPLICATE_ENTRY",
        message: "A record with this information already exists",
      },
    });
  });
});
