import { Request, Response } from 'express';
export declare enum UserRole {
    AGENCY = "AGENCY",
    CLIENT = "CLIENT"
}
export declare const register: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const login: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const logout: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getMe: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const refreshToken: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=authController.d.ts.map