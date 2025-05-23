import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Config {
  // Database
  DATABASE_URL: string;
  REDIS_URL: string;

  // JWT
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;

  // Session
  SESSION_SECRET: string;

  // OAuth
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  LINKEDIN_CLIENT_ID: string;
  LINKEDIN_CLIENT_SECRET: string;

  // Email
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASS: string;
  FROM_EMAIL: string;

  // Akismet
  AKISMET_API_KEY: string;
  AKISMET_BLOG_URL: string;

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;

  // Security
  BCRYPT_ROUNDS: number;
  CORS_ORIGIN: string;

  // Server
  PORT: number;
  NODE_ENV: string;

  // File Upload
  MAX_FILE_SIZE: string;
  UPLOAD_PATH: string;

  // Logging
  LOG_LEVEL: string;
  LOG_FILE: string;

  // Analytics
  GOOGLE_ANALYTICS_ID: string;

  // URLs
  CLIENT_URL: string;
  SERVER_URL: string;

  // Verification
  EMAIL_VERIFICATION_EXPIRES_IN: string;
  PASSWORD_RESET_EXPIRES_IN: string;

  // Moderation
  AUTO_MODERATE_THRESHOLD: number;
  REVIEW_MIN_LENGTH: number;
  REVIEW_MAX_LENGTH: number;
}

const getEnvVar = (name: string, defaultValue?: string): string => {
  const value = process.env[name] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
};

const getEnvVarOptional = (name: string, defaultValue: string): string => {
  return process.env[name] || defaultValue;
};

const getEnvNumber = (name: string, defaultValue?: number): number => {
  const value = process.env[name];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value ? parseInt(value, 10) : defaultValue!;
};

export const config: Config = {
  // Database
  DATABASE_URL: getEnvVarOptional('DATABASE_URL', 'postgresql://test:test@localhost:5432/test'),
  REDIS_URL: getEnvVarOptional('REDIS_URL', 'redis://localhost:6379'),

  // JWT
  JWT_SECRET: getEnvVarOptional('JWT_SECRET', 'development-jwt-secret-key'),
  JWT_REFRESH_SECRET: getEnvVarOptional('JWT_REFRESH_SECRET', 'development-refresh-secret-key'),
  JWT_EXPIRES_IN: getEnvVarOptional('JWT_EXPIRES_IN', '15m'),
  JWT_REFRESH_EXPIRES_IN: getEnvVarOptional('JWT_REFRESH_EXPIRES_IN', '7d'),

  // Session
  SESSION_SECRET: getEnvVarOptional('SESSION_SECRET', 'development-session-secret-key'),

  // OAuth
  GOOGLE_CLIENT_ID: getEnvVarOptional('GOOGLE_CLIENT_ID', 'placeholder-google-client-id'),
  GOOGLE_CLIENT_SECRET: getEnvVarOptional('GOOGLE_CLIENT_SECRET', 'placeholder-google-client-secret'),
  LINKEDIN_CLIENT_ID: getEnvVarOptional('LINKEDIN_CLIENT_ID', 'placeholder-linkedin-client-id'),
  LINKEDIN_CLIENT_SECRET: getEnvVarOptional('LINKEDIN_CLIENT_SECRET', 'placeholder-linkedin-client-secret'),

  // Email
  SMTP_HOST: getEnvVarOptional('SMTP_HOST', 'smtp.gmail.com'),
  SMTP_PORT: getEnvNumber('SMTP_PORT', 587),
  SMTP_USER: getEnvVarOptional('SMTP_USER', 'placeholder-email@gmail.com'),
  SMTP_PASS: getEnvVarOptional('SMTP_PASS', 'placeholder-app-password'),
  FROM_EMAIL: getEnvVarOptional('FROM_EMAIL', 'noreply@clientscore.com'),

  // Akismet
  AKISMET_API_KEY: getEnvVarOptional('AKISMET_API_KEY', 'placeholder-akismet-api-key'),
  AKISMET_BLOG_URL: getEnvVarOptional('AKISMET_BLOG_URL', 'https://clientscore.com'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: getEnvNumber('RATE_LIMIT_WINDOW_MS', 900000),
  RATE_LIMIT_MAX_REQUESTS: getEnvNumber('RATE_LIMIT_MAX_REQUESTS', 100),

  // Security
  BCRYPT_ROUNDS: getEnvNumber('BCRYPT_ROUNDS', 12),
  CORS_ORIGIN: getEnvVarOptional('CORS_ORIGIN', 'http://localhost:3000'),

  // Server
  PORT: getEnvNumber('PORT', 5000),
  NODE_ENV: getEnvVarOptional('NODE_ENV', 'development'),

  // File Upload
  MAX_FILE_SIZE: getEnvVarOptional('MAX_FILE_SIZE', '5mb'),
  UPLOAD_PATH: getEnvVarOptional('UPLOAD_PATH', './uploads'),

  // Logging
  LOG_LEVEL: getEnvVarOptional('LOG_LEVEL', 'info'),
  LOG_FILE: getEnvVarOptional('LOG_FILE', './logs/app.log'),

  // Analytics
  GOOGLE_ANALYTICS_ID: getEnvVarOptional('GOOGLE_ANALYTICS_ID', ''),

  // URLs
  CLIENT_URL: getEnvVarOptional('CLIENT_URL', 'http://localhost:3000'),
  SERVER_URL: getEnvVarOptional('SERVER_URL', 'http://localhost:5000'),

  // Verification
  EMAIL_VERIFICATION_EXPIRES_IN: getEnvVarOptional('EMAIL_VERIFICATION_EXPIRES_IN', '24h'),
  PASSWORD_RESET_EXPIRES_IN: getEnvVarOptional('PASSWORD_RESET_EXPIRES_IN', '1h'),

  // Moderation
  AUTO_MODERATE_THRESHOLD: getEnvNumber('AUTO_MODERATE_THRESHOLD', 5),
  REVIEW_MIN_LENGTH: getEnvNumber('REVIEW_MIN_LENGTH', 50),
  REVIEW_MAX_LENGTH: getEnvNumber('REVIEW_MAX_LENGTH', 2000),
};

// Validate critical configuration
const validateConfig = () => {
  const requiredVars = [
    'JWT_SECRET',
    'SESSION_SECRET'
  ];

  for (const varName of requiredVars) {
    if (!process.env[varName] || process.env[varName]?.includes('placeholder') || process.env[varName]?.includes('your-')) {
      console.warn(`⚠️  Warning: ${varName} is using a default/placeholder value. Please set a secure value in production.`);
    }
  }
};

// Run validation
validateConfig();

export default config; 