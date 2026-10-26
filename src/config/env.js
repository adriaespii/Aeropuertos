function requireMinLength(value, name, minLength) {
  if (
    typeof value !== "string" ||
    value.length < minLength
  ) {
    throw new Error(
      `${name} debe tener al menos ${minLength} caracteres`
    );
  }

  return value;
}
export const env = Object.freeze({
  port: parsePositiveInteger(
    process.env.PORT ?? "3000",
    "PORT"
  ),

  passwordRounds: parsePositiveInteger(
    process.env.PASSWORD_ROUNDS ?? "12",
    "PASSWORD_ROUNDS"
  ),

  jwt: Object.freeze({
    secret: requireMinLength(
      requireEnv("JWT_SECRET"),
      "JWT_SECRET",
      32
    ),
    expiresIn: requireEnv("JWT_EXPIRES_IN"),
    issuer: requireEnv("JWT_ISSUER"),
    audience: requireEnv("JWT_AUDIENCE")
  }),

  db: Object.freeze({
    host: requireEnv("DB_HOST"),
    port: parsePositiveInteger(
      process.env.DB_PORT ?? "3306",
      "DB_PORT"
    ),
    user: requireEnv("DB_USER"),
    password: requireEnv("DB_PASSWORD"),
    database: requireEnv("DB_NAME"),
    connectionLimit: parsePositiveInteger(
      process.env.DB_CONNECTION_LIMIT ?? "10",
      "DB_CONNECTION_LIMIT"
    )
  })
});