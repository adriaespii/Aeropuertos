import {
  login,
  me,
  register
} from "../controllers/auth.controller.js";

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", me);