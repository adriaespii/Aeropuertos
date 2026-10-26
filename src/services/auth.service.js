import { AppError } from "../errors/AppError.js";
import * as usersRepository
  from "../repositories/users.repository.js";
import {
  hashPassword,
  verifyPassword
} from "./password.service.js";
import {
  normalizeLoginInput,
  normalizeRegisterInput,
  validateLogin,
  validateRegister
} from "../validators/auth.validator.js";
import { signAccessToken }
  from "./token.service.js";

export async function register(data) {
  const errors = validateRegister(data);

  if (errors.length > 0) {
    throw new AppError(
      422,
      "Datos de registro no válidos",
      errors
    );
  }

  const input = normalizeRegisterInput(data);

  const userExists =
    await usersRepository.existsByEmail(input.email);

  if (userExists) {
    throw new AppError(
      409,
      "Ya existe un usuario con ese correo"
    );
  }

  const passwordHash =
    await hashPassword(input.password);

  try {
    return await usersRepository.create({
      name: input.name,
      email: input.email,
      passwordHash
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new AppError(
        409,
        "Ya existe un usuario con ese correo"
      );
    }

    throw error;
  }
}

export async function login(data) {
  const errors = validateLogin(data);

  if (errors.length > 0) {
    throw new AppError(
      422,
      "Datos de acceso no válidos",
      errors
    );
  }

  const input = normalizeLoginInput(data);

  const user =
    await usersRepository.findPrivateByEmail(
      input.email
    );

  if (!user) {
    throw new AppError(
      401,
      "Correo o contraseña incorrectos"
    );
  }

  const passwordMatches =
    await verifyPassword(
      input.password,
      user.passwordHash
    );

  if (!passwordMatches) {
    throw new AppError(
      401,
      "Correo o contraseña incorrectos"
    );
  }

  const publicUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };

  const accessToken =
    signAccessToken(publicUser);

  return {
    user: publicUser,
    accessToken
  };
}
import {
  verifyAccessToken
} from "./token.service.js";

export async function getCurrentUser(token) {
  let payload;

  try {
    payload = verifyAccessToken(token);
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      throw new AppError(
        401,
        "Token no válido o caducado"
      );
    }

    throw error;
  }

  const userId = Number(payload.sub);

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new AppError(
      401,
      "El token no contiene un sujeto válido"
    );
  }

  const user =
    await usersRepository.findPublicById(userId);

  if (!user) {
    throw new AppError(
      401,
      "El usuario del token ya no existe"
    );
  }

  return user;
}