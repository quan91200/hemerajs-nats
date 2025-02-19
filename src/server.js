import prisma from './plugins/prisma.js'
import hemera from './plugins/hemera.js'
import userPlugin from './plugins/user.plugin.js'
import postPlugin from './plugins/post.plugin.js'
import notificationPlugin from './plugins/notification.plugin.js'
import HemeraAjv from "hemera-ajv"
import userExtension from './extensions/user.extension.js'
import postExtension from './extensions/post.extension.js'
import notificationExtension from './extensions/notification.extension.js'

// Đăng ký Prisma Plugin
hemera.decorate('prisma', prisma)

hemera.use(HemeraAjv)

userExtension(hemera)
postExtension(hemera)
notificationExtension(hemera)

// Đăng ký các plugin user, post, notification
hemera.use(userPlugin)
hemera.use(postPlugin)
hemera.use(notificationPlugin)

// Khởi chạy Hemera
export default function startServer() {
    hemera.ready(() => {
        hemera.log.info(`🚀 Hemera instance (PID: ${process.pid}) is running...`)
    })
}