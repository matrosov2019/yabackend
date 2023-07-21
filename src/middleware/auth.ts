import jwt, {Secret, JwtPayload} from 'jsonwebtoken';
import {Request, Response, NextFunction} from 'express';

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

export const verifyJwt = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new Error();
        }
        const decoded: string | jwt.JwtPayload = jwt.verify(token, process.env.TOKEN_SECRET);
        (req as CustomRequest).token = decoded;
        next();
    } catch (err) {
        res.status(401).send('Please authenticate');
    }
};