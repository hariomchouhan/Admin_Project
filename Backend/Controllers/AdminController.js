import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { AdminModel } from "../Models/AdminModel.js";
import jwt from "jsonwebtoken";

export async function userRegister(request, response) {
    try {
        const newFullName = request.body.fullName.toLowerCase();
        const existingAdmin = await AdminModel.findOne({ email: request.body.email });

        if (existingAdmin) {
            response.status(StatusCodes.BAD_REQUEST).json({ message: "Email is already existed!" })
        } else {
            const newPassword = bcrypt.hashSync(request.body.password, 12);
            request.body["password"] = newPassword;
            request.body["fullName"] = newFullName;
            const admin = new AdminModel(request.body);
            const savedAdmin = await admin.save();
            response.status(StatusCodes.CREATED).json({ message: "Admin is Successfully Registered!" });
        }
    } catch (error) {
        console.log(error);
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
}