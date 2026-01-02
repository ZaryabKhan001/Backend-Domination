import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './database/database.js';
import { connectGraphQl } from './graphql/graphql.js';
import { expressMiddleware } from '@as-integrations/express5';
dotenv.config({ path: './.env' });
export const envMode = process.env.NODE_ENV?.trim() || 'DEVELOPMENT';
const port = Number(process.env.PORT) || 3000;
const mongoUri = process.env.MONGODB_URI;
connectDB(mongoUri);
const graphQlServer = connectGraphQl();
await graphQlServer.start();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*', credentials: true }));
app.use(morgan('dev'));
const isAdmin = (req, res, next) => {
    const user = { role: 'admin' };
    if (user.role === 'admin') {
        next();
    }
    else {
        return res.send('Na Kaka Na');
    }
};
app.use('/graphql', isAdmin, expressMiddleware(graphQlServer));
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
app.get('/*splat', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Page not found',
    });
});
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});
//# sourceMappingURL=app.js.map