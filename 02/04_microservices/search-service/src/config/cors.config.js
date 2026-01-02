import cors from 'cors';

export const corsConfig = () => {
  return cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:5173',
        'https:actualdeployment',
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by Cors'));
      }
    },
    methods: ['GET'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Version'],
    exposedHeaders: ['X-Total-Count', 'Content-Range'],
    preflightContinue: false, // managed by cors
    maxAge: 60,
  });
};
