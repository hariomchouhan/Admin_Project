import { StatusCodes } from "http-status-codes";

import { UserModel } from "../Models/UserModel.js";

export async function validateRegistration(request, response, next) {
    const { fullName, email, password } = request.body;
    if (!fullName) {
        return response.status(StatusCodes.BAD_REQUEST).json({ message: 'Full Name is required' });
    }
    else if (!email) {
        return response.status(StatusCodes.BAD_REQUEST).json({ message: 'Email Address is required' });
    }
    else if (!password) {
        return response.status(StatusCodes.BAD_REQUEST).json({ message: 'Password is required' });
    }
    else if (fullName.length < 3) {
        return response.status(StatusCodes.BAD_REQUEST).json({ message: 'name must be at least 3 characters long' });
    }
    else if (await UserModel.findOne({ email: request.body.email })) {
        response.status(StatusCodes.BAD_REQUEST).json({ message: "Email already exists" });
    }
    else if (password.length < 6) {
        return response.status(StatusCodes.BAD_REQUEST).json({ message: 'Password must be at least 6 characters long' });
    }


    // Create a new user object
    // const username = new UserModel({
    //     firstName,
    //     lastName
    // });

    // // Generate a username based on the first and last name
    // const user = slugify(username.firstName.toLowerCase() + '-' + username.lastName.toLowerCase());
    // console.log(user);
    // // Check if the username already exists in the database    
    // const existingUser = await UserModel.findOne({ username: user });
    // if (existingUser) {
    //     // If the username already exists, generate a new one by adding a number to the end
    //     let count = 1;
    //     while (true) {
    //       const newUsername = username + '-' + count;
    //       const existingUser = await UserModel.findOne({ username: newUsername });
    //       if (!existingUser) {
    //         username.username = username;
    //         console.log(username);
    //         break;
    //       }
    //       count++;
    //     }
    //   } else {
    //     // If the username doesn't exist, use the generated username
    //     username.username = username;
    //     console.log(username);
    //   }

    // Add more validation checks as needed
    next();
};



export async function validateLogin(request, response, next) {
    const { email, password } = request.body;
    if (!email) {
        return response.status(StatusCodes.BAD_REQUEST).json({ message: 'Email Address is required' });
    }
    else if (!password) {
        return response.status(StatusCodes.BAD_REQUEST).json({ message: 'Password is required' });
    }
    else if (password.length < 6) {
        return response.status(StatusCodes.BAD_REQUEST).json({ message: 'Password must be at least 6 characters long' });
    }
    // Add more validation checks as needed
    next();
};