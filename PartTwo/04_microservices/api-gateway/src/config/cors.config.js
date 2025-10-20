import cors from 'cors';

export const corsConfig = () => {
  return cors({
    origin: (origin, callback) => {
      const allowedOrigins = ['http://localhost:5173', 'https://acualHeaders'];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not Allowed by Cors'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Version'],
    exposedHeaders: ['X-Total-Count', 'Content-Range'],
    preflightContinue: false,
    maxAge: 600,
  });
};
