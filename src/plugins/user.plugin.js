import hp from "hemera-plugin"
import {
    registerSchema,
    loginSchema,
    logoutSchema,
    listUsersSchema
} from "../schemas/user.schema.js"
import {
    register,
    login,
    lists,
    logout
} from "../services/user.service.js"

const userPlugin = hp(async (hemera, opts, done) => {
    console.log(`User Plugin loaded on PID: ${process.pid}`)

    hemera.add({ topic: "user", cmd: "register", schema: registerSchema },
        async (req, reply) => {
            const user = await register(req)
            return reply(null, user)
        })

    hemera.add({ topic: "user", cmd: "login", schema: loginSchema },
        async (req, reply) => {
            const token = await login(req)
            return reply(null, { token })
        })

    hemera.add({ topic: "user", cmd: "list", schema: listUsersSchema },
        async (req, reply) => {
            const users = await lists()
            return reply(null, users)
        })

    hemera.add({ topic: "user", cmd: "logout", schema: logoutSchema },
        async (req, reply) => {
            const result = await logout(req)
            return reply(null, result)
        })

    done()
})

export default userPlugin