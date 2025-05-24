import { Request, Response, NextFunction } from 'express';
export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
    code?: string;
    path?: string;
    value?: any;
    errors?: any;
}
export declare const errorHandler: (error: AppError, req: Request, res: Response, next: NextFunction) => void;
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
export declare const createError: (message: string, statusCode?: number, isOperational?: boolean) => AppError;
export declare const notFound: (req: Request, res: Response, next: NextFunction) => void;
export default errorHandler;
//# sourceMappingURL=errorHandler.d.ts.map