import type { NextFunction, Request, Response } from "express";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Handle body-parser JSON syntax errors
  if (err && err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON payload" });
  }
  if (err instanceof SyntaxError && "status" in err && (err as any).status === 400) {
    return res.status(400).json({ error: "Invalid JSON payload" });
  }

  const status = typeof err?.status === "number" ? err.status : 500;
  const message = err?.message || "Internal Server Error";
  return res.status(status).json({ error: message });
}

