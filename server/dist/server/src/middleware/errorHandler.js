"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
function notFoundHandler(req, res, next) {
    res.status(404);
    next(new Error(`Route not found: ${req.method} ${req.originalUrl}`));
}
function errorHandler(err, _req, res, _next) {
    const statusCode = res.statusCode >= 400 ? res.statusCode : 500;
    const message = err instanceof Error ? err.message : 'Unexpected server error';
    res.status(statusCode).json({ message });
}
