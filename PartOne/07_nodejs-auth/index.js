import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import homeRoutes from './routes/home.routes.js';
import adminRoutes from './routes/admin.routes.js';
import imageRoutes from './routes/image.routes.js';
import { connectDb } from './database/connectDb.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/home', homeRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/image', imageRoutes);

app.listen(port, () => {
  console.log(`App is listening on Port: ${port}`);
});
