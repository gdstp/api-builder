import withAuthenticationMiddleware from "@/middlewares/authentication.middleware";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeRequest, makeResponse } from "__tests__/helpers/test-functions";
import { logger } from "@/utils";
import TokenService from "@/services/token.service";
import { TokenExpiredError } from "jsonwebtoken";

beforeEach(() => {
  logger.level = "silent";
});

describe("withAuthenticationMiddleware", () => {
  it("should return a 401 error if the token is not provided", async () => {
    const middleware = withAuthenticationMiddleware;
    const req = makeRequest();
    const res = makeResponse() as any;
    const next = vi.fn();

    middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: "Missing or invalid token",
        code: "MISSING_TOKEN",
      },
    });
  });

  it("should return a 401 error if the token is invalid", async () => {
    const middleware = withAuthenticationMiddleware;
    const req = makeRequest({
      headers: {
        authorization: "invalid token",
      },
    });
    const res = makeResponse() as any;
    const next = vi.fn();

    middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: "Missing or invalid token",
        code: "MISSING_TOKEN",
      },
    });
  });

  it("should return a 401 error if the token is expired", async () => {
    const middleware = withAuthenticationMiddleware;
    const req = makeRequest({
      headers: {
        authorization: "Bearer Token expired",
      },
    });
    const res = makeResponse() as any;
    const next = vi.fn();

    vi.spyOn(TokenService.prototype, "verifyAccessToken").mockImplementation(
      () => {
        throw new TokenExpiredError("Token expired", new Date());
      },
    );

    middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: "Token expired",
        code: "TOKEN_EXPIRED",
      },
    });
  });
});
