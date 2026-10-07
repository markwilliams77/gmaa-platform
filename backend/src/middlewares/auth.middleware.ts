import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { getCookieValue } from "../utils/cookies";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const cookieToken = getCookieValue(req.headers.cookie, "gmaa_access_token");
  const token = cookieToken;

  const method = req.method.toUpperCase();
  const requiresCsrf = ["POST", "PUT", "PATCH", "DELETE"].includes(method);
  const csrfHeader = typeof req.headers["x-csrf-token"] === "string" ? req.headers["x-csrf-token"] : undefined;
  const csrfCookie = getCookieValue(req.headers.cookie, "gmaa_csrf_token");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (requiresCsrf && (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie)) {
    return res.status(403).json({ message: "CSRF token missing or invalid" });
  }

  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};