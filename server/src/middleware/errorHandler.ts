import type { NextFunction, Request, Response } from 'express'

type ApiErrorResponse = {
  message: string
}

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  res.status(404)
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`))
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response<ApiErrorResponse>,
  _next: NextFunction,
) {
  const statusCode = res.statusCode >= 400 ? res.statusCode : 500
  const message = err instanceof Error ? err.message : 'Unexpected server error'

  res.status(statusCode).json({ message })
}
