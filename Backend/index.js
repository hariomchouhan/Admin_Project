import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { configureDb } from './Configs/LoginDb.js';
import loginRouter from './Routers/LoginRouter.js';

const app = express();

app.use(cors());
app.use(express.json());
app.disable('x-powered-by');
app.use(loginRouter)

app.listen(process.env.SERVER_PORT || 5000, () =>{
    configureDb();
    console.log(`Server is running on port ${process.env.SERVER_PORT}`);
})