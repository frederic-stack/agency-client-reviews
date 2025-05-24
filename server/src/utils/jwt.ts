import jwt from 'jsonwebtoken';
import { config } from '../config';

export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || config.JWT_SECRET;
  
  // Use the synchronous version without options to avoid TypeScript issues
  return jwt.sign({ userId }, secret);
};

export const generateRefreshToken = (userId: string): string => {
  const secret = process.env.JWT_REFRESH_SECRET || config.JWT_REFRESH_SECRET;
  
  // Use the synchronous version without options to avoid TypeScript issues
  return jwt.sign({ userId }, secret);
};

export const verifyToken = (token: string): { userId: string } => {
  const secret = process.env.JWT_SECRET || config.JWT_SECRET;
  return jwt.verify(token, secret) as { userId: string };
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  const secret = process.env.JWT_REFRESH_SECRET || config.JWT_REFRESH_SECRET;
  return jwt.verify(token, secret) as { userId: string };
}; 