import { Request, Response, NextFunction } from "express";

export class ApiError extends Error {
  statusCode: number;
  timestamp: string;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
    this.name = "ApiError";

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      status: this.statusCode,
      message: this.message,
      timestamp: this.timestamp
    };
  }

  static notFound(message: string = "Resource not found"): ApiError {
    return new ApiError(message, 404);
  }

  static badRequest(message: string = "Bad request"): ApiError {
    return new ApiError(message, 400);
  }

  static unauthorized(message: string = "Unauthorized"): ApiError {
    return new ApiError(message, 401);
  }

  static forbidden(message: string = "Forbidden"): ApiError {
    return new ApiError(message, 403);
  }

  static internal(message: string = "Internal server error"): ApiError {
    return new ApiError(message, 500);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  console.error(err);
  res.status(500).json({
    status: 500,
    message: "An unexpected error occurred",
    timestamp: new Date().toISOString(),
  });
};
