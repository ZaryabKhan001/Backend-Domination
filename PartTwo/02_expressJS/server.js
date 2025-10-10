import express from 'express';
import dotenv from 'dotenv';
import { configureCors } from './config/cors.config.js';
import { requestLogger, addTimestamp } from './middleware/custom.middleware.js';
import { globalErrorHandler } from './middleware/error.middleware.js';
import { urlVersioning } from './middleware/apiVersion.middleware.js';
import { rateLimiter } from './middleware/rateLimiter.middleware.js';
import itemsRouter from "./routes/item.route.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(requestLogger);
app.use(addTimestamp);

app.use(express.json());
app.use(configureCors());

app.use(urlVersioning('v1'));

app.use(rateLimiter(100, 15 * 60 * 1000));

app.use('/api/v1/items', itemsRouter);

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`App is listening on Port: ${port}`);
});
