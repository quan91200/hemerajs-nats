import prisma from "../plugins/prisma.js"
import bcrypt from "bcryptjs"

export async function register({ email, password }) {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
        throw new Error("EMAIL_ALREADY_EXISTS")
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    return await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        }
    })
}

export async function login({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
        throw new Error("USER_NOT_FOUND")
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error("INVALID_CREDENTIALS")
    }

    return { token: "fake-jwt-token" } // Giả lập token
}

async function lists() {
    const users = await prisma.user.findMany({
        select: { id: true, email: true } // Đảm bảo chỉ lấy id và email
    })
    return users ?? [] // Trả về mảng rỗng nếu undefined
}

export async function logout({ userId }) {
    console.log(`User ${userId} logged out`)
    return { message: "User logged out successfully" }
}

const userService = {
    register,
    login,
    lists,
    logout
}

export default userService