import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { UserModel } from "../Models/UserModel.js";
import jwt from "jsonwebtoken";
import otpGenerator from 'otp-generator';
import slugify from "slugify";

export async function userRegister(request, response) {
    try {
        const newFullName = request.body.fullName.toLowerCase();
        const existingUser = await UserModel.findOne({ email: request.body.email });

        if (existingUser) {
            response.status(StatusCodes.BAD_REQUEST).json({ message: "Email is already existed!" })
        } else {
            const newPassword = bcrypt.hashSync(request.body.password, 12);
            request.body["password"] = newPassword;
            request.body["fullName"] = newFullName;
            const user = new UserModel(request.body);
            const savedUser = await user.save();
            response.status(StatusCodes.CREATED).json({ message: "User is Successfully Registered!" });
        }
    } catch (error) {
        console.log(error);
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
}

export async function userLogin(request, response) {
    try {
        const email = await UserModel.findOne({ email: request.body.email });
        if (email) {
            if (bcrypt.compareSync(request.body.password, email.password)) {
                const token = jwt.sign({ email: email.email }, process.env.JWT_SECRET);
                response.status(StatusCodes.OK).json({ token: token });
            }
            else {
                response.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid password" });
            }
        } else {
            response.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid email" });
        }
    } catch (error) {
        console.log(error);
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
}

export async function fetchAllUsers(request, response) {
    try {
        const users = await UserModel.find();
        response.status(StatusCodes.OK).json(users);
    } catch (error) {
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
}

export async function fetchByEmail(request, response) {
    try {
        const user = await UserModel.findOne({ email: request.params.email });
        if (user) {
            response.status(StatusCodes.OK).json(user);
        }
        else {
            response.status(StatusCodes.BAD_REQUEST).json({ message: "User not found!" });
        }
    } catch (error) {
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
}

export async function fetchByUsername(request, response) {
    try {
        const user = await UserModel.findOne({ username: request.params.username });
        if (user) {
            response.status(StatusCodes.OK).json(user);
        }
        else {
            response.status(StatusCodes.BAD_REQUEST).json({ message: "User not found!" });
        }
    } catch (error) {
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
}

export async function updateUser(request, response) {
    try {
        const userId = request.params.id;
        if (userId) {
            const user = await UserModel.updateOne(request.body);
            response.status(StatusCodes.NO_CONTENT).json();
        }
        else {
            response.status(StatusCodes.BAD_REQUEST).json({ message: "User Not Found!" });
        }
    } catch (error) {
        console.log(error);
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
}

export async function generateotp(request, response) {
    request.app.locals.OTP = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    })
    response.status(StatusCodes.OK).json({ Code: request.app.locals.OTP });
}

export async function verifyotp(request, response) {
    try {
        const code = request.params.code;
        if (parseInt(code) === parseInt(request.app.locals.OTP)) {
            request.app.locals.OTP = null;
            request.app.locals.resetSession = true;
            response.status(StatusCodes.OK).json({ message: "OTP Verified" });
        }
        else {
            response.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid OTP" });
        }
    } catch (error) {
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
}
export async function createResetSession(request, response) {
    try {
        if (request.app.locals.resetSession) {
            request.app.locals.resetSession = false;
            response.status(StatusCodes.OK).json({ message: "Access Granted!" });
        }
        else {
            response.status(440).json({ message: "Session Expired!" });
        }
    } catch (error) {
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
}

export async function resetPassword(request, response) {
    try {
        if (!req.app.locals.resetSession) return res.status(440).send({ error: "Session expired!" });

        const { email, password } = request.body;

        try {
            UserModel.findOne({ email })
                .then(user => {
                    bcrypt.hashSync(password, 12)
                        .then(hashedPassword => {
                            UserModel.updateOne({ email: user.email }, { password: hashedPassword }, function (err, result) {
                                if (err) throw err;
                                req.app.locals.resetSession = false;
                                response.status(StatusCodes.NO_CONTENT).json();
                            })
                        })
                        .catch(e => {
                            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                                error: "Enable to hashed password"
                            })
                        })
                })
        } catch (error) {
            response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "email is not found!" });
        }
    } catch (error) {
        response.status(StatusCodes.UNAUTHORIZED).json();
    }
}