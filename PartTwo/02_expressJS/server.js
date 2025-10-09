import express from 'express';
import dotenv from 'dotenv';
import { configureCors } from './config/cors.config.js';
import { requestLogger, addTimestamp } from './middleware/custom.middleware.js';
import { globalErrorHandler } from './middleware/error.middleware.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(requestLogger());
app.use(addTimestamp());


app.use(express.json());
app.use(configureCors());

app.use(globalErrorHandler());

app.listen(port, () => {
  console.log(`App is listening on Port: ${port}`);
});
