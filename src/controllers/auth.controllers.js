import { env } from "../config/env.js";

export async function login(req, res) {
  const result = await authService.login(req.body);

  return res.status(200).json({
    tokenType: "Bearer",
    expiresIn: env.jwt.expiresIn,
    ...result
  });
}
import { AppError }
  from "../errors/AppError.js";
import { extractBearerToken }
  from "../utils/bearer-token.js";

export async function me(req, res) {
  const token = extractBearerToken(
    req.headers.authorization
  );

  if (!token) {
    throw new AppError(
      401,
      "Se requiere un token Bearer"
    );
  }

  const user =
    await authService.getCurrentUser(token);

  return res.status(200).json({
    user
  });
}