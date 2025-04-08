import { emailValidator, schema } from "../middleware/validation.middleware";
import HttpException from "../exceptions/HttpException";
import { AllUsers } from "../interfaces/user.interface";
import UserModel from "../models/User";
import bcrypt from "bcrypt"

//GET ALL USERS
export const getAllUsersService = async (): Promise<AllUsers[]> => {
    const users = await UserModel.find()
    return users
}

//GET A PARTICULAR USER
export const getUserService = async (userId: string): Promise<AllUsers> => {
    const user = await UserModel.findById(userId)
    if(!user) throw new HttpException(404, "This User does not exist!!!")
    return user
}

//UPDATE A PARTICULAR USERS
export const updateUserInformation = async (userId: string, userData: AllUsers): Promise<AllUsers> => {
    const user = await UserModel.findById(userId)
    if(!user) throw new HttpException(404, "This User does not Exist!!!")

    if(userData.email) {
        if(!emailValidator.validate(userData.email)) throw new HttpException(403, "Invalid Email Address. make sure email address is in the format foo@bar.com")
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $set: { email: userData.email }},
            { new: true }
        )
        return updatedUser
    } else if (userData.password) {
        if(!schema.validate(userData.password)) throw new HttpException(403, "Invalid Email Address. make sure email address is in the format foo@bar.com")
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(userData.password, salt)
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $set: { password: hashedPassword }},
            { new: true }
        )
        return updatedUser
    }
}

//DELETE A PARTICULAR USER
export const deleteUserService = async (userId: string): Promise<AllUsers> => {
    const user = await UserModel.findById(userId)
    if(!user) throw new HttpException(404, "This User does not Exist!!!")

    await UserModel.findByIdAndDelete(userId)
    return user
}