import type { CorsOptions } from 'cors';

const allowedOriginPatterns: RegExp[] = [
  /^http:\/\/localhost:(\d{2,5})$/,
  /^http:\/\/127\.0\.0\.1:(\d{2,5})$/,
  /^https?:\/\/([a-zA-Z0-9-]+\.)*cipilapp\.com$/,
];

export const CORS: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }
    const isAllowed = allowedOriginPatterns.some((re) => re.test(origin));
    if (isAllowed) return callback(null, true);
    return callback(new Error(`CORS: Origin no permitido: ${origin}`), false);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
  ],
  exposedHeaders: ['Content-Disposition'],
  optionsSuccessStatus: 204,
  preflightContinue: false,
  maxAge: 600,
};