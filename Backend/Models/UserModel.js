import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    fullName : {
        type: String,
        require: [true, "Please provide name"],
        unique: false
    },
    email : {
        type: String,
        require: [true, "Please provide email"],
        unique: true
    },
    password : {
        type: String,
        require: [true, "Please provide password"],
        unique: false
    },
})

export const UserModel = mongoose.model('User', userSchema);