import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const JWT_ALGORITHM = "HS256";

export function signAccessToken(user) {
  return jwt.sign(
    {
      role: user.role
    },
    env.jwt.secret,
    {
      algorithm: JWT_ALGORITHM,
      subject: String(user.id),
      issuer: env.jwt.issuer,
      audience: env.jwt.audience,
      expiresIn: env.jwt.expiresIn
    }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(
    token,
    env.jwt.secret,
    {
      algorithms: [JWT_ALGORITHM],
      issuer: env.jwt.issuer,
      audience: env.jwt.audience
    }
  );
}

export function decodeToken(token) {
  return jwt.decode(token, {
    complete: true
  });
}