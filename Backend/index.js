import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { configureDb } from './src/Configs/LoginDb.js';

const app = express();

app.use(cors());
app.use(express.json());
app.disable('x-powered-by');

app.listen(process.env.SERVER_PORT || 5000, () =>{
    configureDb();
    console.log(`Server is running on port ${process.env.SERVER_PORT}`);
})