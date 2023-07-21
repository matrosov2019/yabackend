import jwt, {Secret, JwtPayload} from 'jsonwebtoken';
import {Request, Response, NextFunction} from 'express';

export const SECRET_KEY: Secret = 'your-secret-key-here';

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

export const verifyJwt = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error();
        }

        const decoded: string | jwt.JwtPayload = jwt.verify(token, SECRET_KEY);
        (req as CustomRequest).token = decoded;

        next();
    } catch (err) {
        res.status(401).send('Please authenticate');
    }
};