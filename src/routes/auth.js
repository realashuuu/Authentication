import { Router } from "express";
import * as authContoller from "../controller/authController.js";

const authRouter = Router();

//POST api/auth/register
authRouter.post("/register", authContoller.register);

//POST api/auth/login
authRouter.post("/login", authContoller.login);

//GET api/auth/get-me
authRouter.get("/get-me", authContoller.getMe);

//GET api/auth/refresh
authRouter.get("/refresh-token", authContoller.refreshToken);

//GET api/auth/logout
authRouter.get("/logout", authContoller.logout);

//GET api/auth/logout-all
authRouter.get("/logout-all", authContoller.logoutAll);

//GET api/auth/verify-email
authRouter.get("/verify-email", authContoller.verifyEmail);

export default authRouter;
