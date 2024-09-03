import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import authRoutes from './routes/authRoutes'


const app = express();
app.use(express.json());

//USER
app.use('/auth', authRoutes)
//USER 

console.log('Esto esta siendo ejecutado!');


export default app