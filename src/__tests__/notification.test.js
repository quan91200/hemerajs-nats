import notificationService from "../services/notification.service.js"
import userService from "../services/user.service.js"
import prisma from "../plugins/prisma.js"
import { faker } from "@faker-js/faker"
import { redisPub, redisSub } from '../plugins/redis.js'

describe("Notification Service", () => {
    let userId
    let senderId
    console.log(`PID: ${process.pid}`)

    beforeAll(async () => {
        // Lấy user có sẵn hoặc tạo mới
        let user = await prisma.user.findFirst()
        if (!user) {
            user = await userService.register({
                email: faker.internet.email(),
                password: faker.internet.password()
            })
        }
        userId = user.id

        // Tìm sender khác user hoặc tạo mới
        let sender = await prisma.user.findFirst({
            where: { id: { not: userId } }
        })
        if (!sender) {
            sender = await userService.register({
                email: faker.internet.email(),
                password: faker.internet.password()
            })
        }
        senderId = sender.id
    })

    it("Tạo thông báo mới", async () => {
        const notification = await notificationService.createNotification({
            userId,
            senderId,
            type: "NEW_MESSAGE",
            message: faker.lorem.words(10)
        })

        expect(notification).toHaveProperty("id")
        expect(notification.userId).toBe(userId)
        expect(notification.senderId).toBe(senderId)
        expect(notification.type).toBe("NEW_MESSAGE")
        expect(notification.message.length).toBeGreaterThan(5) // ✅ Sửa lỗi kiểm tra độ dài
    })

    it("Lấy danh sách thông báo của người dùng", async () => {
        await notificationService.createNotification({
            userId,
            senderId,
            type: "NEW_FRIEND_REQUEST",
            message: faker.lorem.sentence().slice(0, 255) // ✅ Sửa lỗi độ dài message
        })

        const notifications = await notificationService.getUserNotifications(userId)
        expect(notifications.length).toBeGreaterThan(0)
    })

    it("Đánh dấu thông báo đã đọc", async () => {
        const notification = await notificationService.createNotification({
            userId,
            senderId,
            type: "NEW_LIKE",
            message: faker.lorem.sentence().slice(0, 255)
        })

        const markedNotification = await notificationService.markNotificationAsRead(notification.id)
        expect(markedNotification.isRead).toBe(true)
    })

    it("Xóa thông báo", async () => {
        const notification = await notificationService.createNotification({
            userId,
            senderId,
            type: "SYSTEM_ALERT",
            message: "This is a test alert."
        })

        await notificationService.deleteNotification(notification.id)
        const foundNotification = await prisma.notification.findUnique({
            where: { id: notification.id }
        })

        expect(foundNotification).toBeNull()
    })

    it("Xóa tất cả thông báo của người dùng", async () => {
        await notificationService.createNotification({
            userId,
            senderId,
            type: "NEW_MESSAGE",
            message: faker.lorem.sentence().slice(0, 255)
        })
        await notificationService.createNotification({
            userId,
            senderId,
            type: "NEW_MESSAGE",
            message: faker.lorem.sentence().slice(0, 255)
        })

        await notificationService.clearUserNotifications(userId)
        const notifications = await prisma.notification.findMany({ where: { userId } })
        expect(notifications.length).toBe(0)
    })

    afterAll(async () => {
        await prisma.$disconnect()
        await redisPub.quit()
        await redisSub.quit()
    })
})