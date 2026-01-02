import express from 'express';
import dotenv from 'dotenv';
import { dbConnect } from './database/dbConnect.js';
import bookRoutes from './routes/book.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

dbConnect();

app.use(express.json());

app.use('/api/v1/book', bookRoutes);

app.listen(port, () => {
  console.log(`App is listening on Port: ${port}`);
});
