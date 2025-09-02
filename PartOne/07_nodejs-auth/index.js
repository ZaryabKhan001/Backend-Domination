import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import { connectDb } from './database/connectDb.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

connectDb();

app.use(express.json());

app.use('/api/v1/auth', authRoutes);

app.listen(port, () => {
  console.log(`App is listening on Port: ${port}`);
});
