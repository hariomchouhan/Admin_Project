import express from "express";
import { registerMail } from "../Controllers/Mailler.js";
import { createResetSession, fetchAllUsers, fetchByEmail, fetchByUsername, generateotp, resetPassword, updateUser, userLogin, userRegister, verifyotp } from "../Controllers/UserController.js";
import { validateLogin, validateRegistration } from "../Middlewares/authValidate.js";
import { VerifyToken } from "../Middlewares/VerifyToken.js";

const loginRouter = express.Router();

loginRouter.post('/register', validateRegistration, userRegister);
loginRouter.post('/login', validateLogin, userLogin);
loginRouter.post('/sendmail', registerMail);
loginRouter.get('/', fetchAllUsers);
loginRouter.get('/user/:email',fetchByEmail);
loginRouter.get('/user/:username', VerifyToken, fetchByUsername);
loginRouter.get('/generateotp', VerifyToken, generateotp);
loginRouter.get('/verifyotp/:code', VerifyToken, verifyotp);
loginRouter.get('/createResetSession', VerifyToken, createResetSession);
loginRouter.put('/updateuser/:id', VerifyToken, updateUser);
loginRouter.put('/resetpassword', VerifyToken, resetPassword);

export default loginRouter;