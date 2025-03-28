import HttpException from "../exceptions/HttpException";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Login, Register, UserInfo } from "../interfaces/user.interface";
import UserModel from "../models/User";
import { emailValidator, schema } from "../middleware/validation.middleware";
import { DataStoredInToken } from "../interfaces/auth.interface";

//REGISTER A USER
export const registerService = async (userData: Register): Promise<Register> => {
    const ifAlreadyExistUser = await UserModel.findOne({ email: userData.email })
    if(ifAlreadyExistUser) throw new HttpException(409, "This User Already Exists")

    switch(true) {
        case !emailValidator.validate(userData.email):
            throw new HttpException(403, "Invalid Email Address, Email Address must be in the format foo@bar.com")
            break;
        case !schema.validate(userData.password):
            throw new HttpException(403, "Invalid Password, Password must contain uppercase letters, lowercase letters, a symbol and at least 2 digits")
            break;
        default:
            const salt = await bcrypt.genSalt(10)
            const hashedPassword  = await bcrypt.hash(userData.password, salt)
            const data = {
                email: userData.email,
                password: hashedPassword,
                firstName: userData.firstName,
                lastName: userData.lastName,
                birthDate: userData.birthDate,
                gender: userData.gender,
                height: userData.height,
                weight: userData.weight,
                profilePicture: userData.profilePicture,
                role: userData.role,
                isVerified: userData.isVerified
            }
            const newUser = new UserModel(data)
            const savedUser = await newUser.save()
            return savedUser
    }
}

//LOGIN AN EXISTING USER
export const loginService = async (userData: Login): Promise<UserInfo> => {
    const user = await UserModel.findOne({ email: userData.email })
    if(!user) throw new HttpException(404, "User Not Found!!!")

    const isPasswordCorrect = await bcrypt.compare(userData.password, user.password)
    if(!isPasswordCorrect) throw new HttpException(403, "Username and Password don't match")

    const dataStoredInToken: DataStoredInToken = {
        id: user._id,
        role: user.role
    }
    const accessToken = jwt.sign(dataStoredInToken, process.env.JWT_SEC, { expiresIn: "24h" })
    const loginData: UserInfo = {
        id: user._id,
        email: user.email,
        password: user.password,
        role: user.role,
        token: accessToken
    }
    return loginData
}