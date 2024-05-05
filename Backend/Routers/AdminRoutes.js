import express from "express";
import { validateRegistration } from "../Middlewares/authValidate";


const adminRouter = express.Router();

adminRouter.post('/register', validateRegistration, userRegister);


export default loginRouter;