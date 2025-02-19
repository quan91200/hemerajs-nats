import prisma from "../plugins/prisma.js"
import { redisPub } from "../plugins/redis.js"

export async function createNotification({ userId, senderId, type, message }) {
    const notification = await prisma.notification.create({
        data: {
            userId,
            senderId,
            type,
            message,
        },
    })
    redisPub.publish("notifications", JSON.stringify(notification))
    return notification
}

export async function getUserNotifications(userId) {
    return await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    })
}

export async function markNotificationAsRead(notificationId) {
    return await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
    })
}

export async function deleteNotification(notificationId) {
    return await prisma.notification.delete({
        where: { id: notificationId }
    })
}

export async function clearUserNotifications(userId) {
    return await prisma.notification.deleteMany({
        where: { userId }
    })
}

const notificationService = {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    deleteNotification,
    clearUserNotifications
}

export default notificationService

