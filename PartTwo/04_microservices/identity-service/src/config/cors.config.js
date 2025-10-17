import cors from 'cors';

export const corsConfig = () => {
  return cors({
    origin: (origin, callback) => {
      const allowedOrigins = ['http://localhost:5173', 'http:actualdeployment'];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not Allowed by Cors'));
      }
    },
    methods: ['POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Version'],
    exposedHeaders: ['X-Total-Count', 'Content-Range'],
    preflightContinue: false, // handle by cors
    maxAge: 600,
  });
};
