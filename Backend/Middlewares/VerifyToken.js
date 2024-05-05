import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export async function VerifyToken(request, response, next) {
    try {
        const authHeader = request.headers.authorization.split(" ")[1];

        const decode = jwt.verify(authHeader, process.env.JWT_SECRET,);
        request.user = decode;

        next();
    } catch (error) {
        response.status(StatusCodes.UNAUTHORIZED).json({ message: "Access Denied" });
    }
}


export async function localVariable(request, response, next) {
    request.app.locals={
        OTP: null,
        resetSession : false
    }
    next();
}