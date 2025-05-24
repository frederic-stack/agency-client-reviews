import { Request, Response, NextFunction } from 'express';
interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
        firstName?: string;
        lastName?: string;
    };
}
export declare const authenticateToken: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const optionalAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const requireRole: (roles: string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export {};
//# sourceMappingURL=auth.d.ts.map