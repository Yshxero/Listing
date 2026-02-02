import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken"

export interface JWTPayload {
    userID: string;
    userName: string;
    userEmail: string;
}

export interface AuthRequest extends Request {
    user?: JWTPayload;
}

type tokenPayload = {
    userID: string;
    userName: string;
    userEmail: string;
    iat: number;
    exp: number;
}

export const Authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        return res.status(500).json({ message: "JWT Secret not found" });
    }

    try {
        const decodedToken = jwt.verify(token, jwtSecret) as tokenPayload;

        if (!decodedToken.userID) {
            return res.status(401).json({ message: "Invalid Token Payload" });
        }
        req.user = { userID: decodedToken.userID, userName: decodedToken.userName, userEmail: decodedToken.userEmail };
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token" });
    }
};