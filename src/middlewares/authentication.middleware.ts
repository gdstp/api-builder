import TokenService from "@/services/token.service";
import { logger } from "@/utils";
import { NextFunction, Request, Response } from "express";

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

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
        code: "UNAUTHORIZED",
      });
      return;
    }

    const tokenService = new TokenService();
    const decoded = (await tokenService.verifyAccessToken(
      token,
    )) as TokenPayload;

    req.user = decoded.userId;

    next();
  } catch (error) {
    logger.error("Authentication error", {
      error: error instanceof Error ? error.message : String(error),
      endpoint: req.path,
      method: req.method,
    });

    res.status(401).json({
      success: false,
      message: "Unauthorized",
      code: "UNAUTHORIZED",
    });
  }
}
