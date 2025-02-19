import cluster from "cluster"
import { faker } from "@faker-js/faker" // Import Faker
import { startCluster } from "../../cluster.js"
import userService from "../services/user.service.js"
import prisma from "../plugins/prisma.js"
import { nats } from "../plugins/hemera.js"
import { redisPub, redisSub } from "../plugins/redis.js"

describe("User Service in Cluster Mode", () => {
    let worker

    beforeAll((done) => {
        if (cluster.isPrimary) {
            worker = cluster.fork() // Tạo một worker
            worker.on("online", () => {
                console.log(`🚀 Worker PID: ${worker.process.pid} đã sẵn sàng`)
                setTimeout(done, 3000) // Đợi worker khởi động xong
            })
        } else {
            startCluster()
        }
    })

    afterAll(async () => {
        if (worker) {
            worker.kill()
            await new Promise((resolve) => {
                worker.on("exit", () => resolve())
            })
        }
        await prisma.$disconnect()
        if (nats) {
            nats.close() // Đóng kết nối NATS
        }
        if (redisPub) {
            await redisPub.quit() // Đóng Redis Publisher
        }
        if (redisSub) {
            await redisSub.quit() // Đóng Redis Subscriber
        }
    })

    it("Đăng ký người dùng mới", async () => {
        const userData = {
            email: faker.internet.email(), // Tạo email ngẫu nhiên
            password: faker.internet.password() // Tạo mật khẩu ngẫu nhiên
        }

        const user = await userService.register(userData)

        expect(user).toBeDefined()
        expect(user.email).toBe(userData.email)
    })

    it("Danh sách người dùng", async () => {
        // Tạo danh sách user giả
        const usersToCreate = Array.from({ length: 5 }, () => ({
            email: faker.internet.email(),
            password: faker.internet.password()
        }))

        // Đăng ký nhiều user
        for (const user of usersToCreate) {
            await userService.register(user)
        }

        await new Promise((resolve) => setTimeout(resolve, 500))

        const users = await userService.lists()
        expect(users.length).toBeGreaterThan(0)
    })
})