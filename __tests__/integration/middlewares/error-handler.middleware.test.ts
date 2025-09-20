import withErrorHandler from "@/middlewares/error-handler.middleware";
import { AppError } from "@/utils/AppError";
import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import express from "express";
import logger from "@/utils/logger";

beforeEach(() => {
  logger.level = "silent";
});

describe("ErrorHandlerMiddleware", () => {
  it("should handle AppError", async () => {
    const error = new AppError("Not found test error", 404, "NOT_FOUND");
    const app = express();
    app.use(express.json());
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
});
