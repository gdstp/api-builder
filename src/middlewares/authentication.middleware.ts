import TokenService from "@/services/token.service";
import { logger } from "@/utils";
import { NextFunction, Request, Response } from "express";
import { TokenExpiredError } from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  iat: number;
  exp: number;
}

export default async function withAuthenticationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.headers?.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      logger.warning("Authentication failed: No token provided", {
        endpoint: req.path,
        method: req.method,
        ip: req.ip,
        userAgent: req.get("User-Agent"),
      });

      res.status(401).json({
        success: false,
        error: {
          message: "Missing or invalid token",
          code: "MISSING_TOKEN",
        },
      });
      return;
    }

    const tokenService = new TokenService();
    const decoded = tokenService.verifyAccessToken(token) as TokenPayload;

    req.user = decoded.userId;

    next();
  } catch (error) {
    logger.error("Authentication error", {
      error: error instanceof Error ? error.message : String(error),
      endpoint: req.path,
      method: req.method,
    });

    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: {
          message: "Token expired",
          code: "TOKEN_EXPIRED",
        },
      });
      return;
    }

    res.status(401).json({
      success: false,
      error: {
        message: "Unauthorized",
        code: "UNAUTHORIZED",
      },
    });
  }
}
