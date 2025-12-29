export interface LoginRequest {
    email: string,
    password: string,
}

export interface LoginResponse {
    token: string,
    role: string,
    fullName: string,
}

export interface RegisterRequest {
    fullName: string,
    email: string,
    phone: string,
    dob: Date,
    password: string,
}

export interface UserInfo {
    fullName: string,
    role: string,
}

export interface ResetPasswordRequest {
    email: string,
    password: string,
    newPassword: string,
}