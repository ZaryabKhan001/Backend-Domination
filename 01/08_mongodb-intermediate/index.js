import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './database/connectDb.js';
import productRoutes from './routes/product.routes.js';
import bookRoutes from './routes/book.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/reference', bookRoutes);
app.use('/api/v1/product', productRoutes);

app.listen(port, () => {
  console.log(`App is listening on Port: ${port}`);
});
