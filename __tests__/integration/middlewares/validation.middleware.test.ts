import withInputValidation from "@/middlewares/validation.middleware";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import express from "express";
import { AppError } from "@/utils/app-error";
import { logger } from "@/utils";

function makeRequest(partial: any = {}) {
  return {
    path: "/test",
    method: "POST",
    ip: "127.0.0.1",
    get: (host: string) =>
      host.toLowerCase() === "user-agent" ? "vitest" : undefined,
    ...partial,
  } as any;
}

beforeEach(() => {
  vi.clearAllMocks();
  logger.level = "silent";
});

describe("ValidationMiddleware", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  it("should return a 400 error if the request body is invalid", async () => {
    const schema = z.object({ name: z.string() });
    const inputValidation = withInputValidation({ schema, field: "body" });
    const req = makeRequest({
      body: {},
    });
    const next = vi.fn();

    inputValidation(req, {} as any, next);

    expect(next).toHaveBeenCalledWith(
      new AppError("Invalid request input", 400, "INVALID_REQUEST", {
        name: "Invalid input: expected string, received undefined",
      }),
    );
  });

  it("should return a 400 error if zod throws an error", async () => {
    const schema = z.object({ name: z.string() });
    const inputValidation = withInputValidation({ schema, field: "body" });
    vi.spyOn(schema, "parse").mockImplementation(() => {
      throw new Error("Zod error");
    });
    const req = makeRequest({
      body: { name: "123" },
    });
    const next = vi.fn();

    inputValidation(req, {} as any, next);

    expect(next).toHaveBeenCalledWith(
      new AppError("Invalid request data", 400, "INVALID_REQUEST"),
    );
  });

  it("should continue if the request body is valid", async () => {
    const schema = z.object({ name: z.string() });
    const inputValidation = withInputValidation({ schema, field: "body" });
    const req = makeRequest({
      body: { name: "John" },
    });
    const next = vi.fn();

    inputValidation(req, {} as any, next);

    expect(next).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalledWith(AppError);
  });
});
