export interface Register {
    email: string
    password: string
    firstName: string
    lastName: string
    birthDate: Date
    gender: string
    height: number
    weight: number
    profilePicture: string
    role: string
    isVerified: boolean
}

export interface Login {
    email: string
    password: string
}

export interface UserInfo {
    id: any
    email: string
    password: string
    role: string
    token: string
}

export interface AllUsers extends Register {
    _id: any
}