import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        birthDate: {
            type: Date,
            required: true
        },
        gender: {
            type: String,
            required: true,
            enum: ["male", "female"]
        },
        height: {
            type: Number,
            default: 0
        },
        weight: {
            type: Number,
            default: 0
        },
        profilePicture: {
            type: String,
            default: ""
        },
        role: {
            type: String,
            required: true,
            enum: ["user", "trainer", "admin"],
            default: "user"
        },
        isVerified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

const UserModel = mongoose.model("User", UserSchema)

export default UserModel