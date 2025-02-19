import hp from "hemera-plugin"
import { redisSub } from "./redis.js"
import { notificationSchema } from "../schemas/notification.schema.js"

const notificationPlugin = hp((hemera, opts, done) => {

    // Định nghĩa hành động gửi thông báo
    hemera.add(
        { topic: "notification", cmd: "send", schema: notificationSchema },
        async (req) => {
            hemera.log.info(`📤 Gửi thông báo đến người dùng: ${req.userId}`)
            return { success: true, userId: req.userId, message: req.message }
        }
    )

    // Đảm bảo Redis Subscriber đang hoạt động trước khi lắng nghe sự kiện
    if (redisSub) {
        redisSub.on("message", async (channel, message) => {
            if (channel === "notifications") {
                try {
                    const notification = JSON.parse(message)

                    // Gửi thông báo bằng Hemera
                    await hemera.act({ topic: "notification", cmd: "send", ...notification })
                } catch (err) {
                    hemera.log.error("❌ Lỗi khi xử lý thông báo:", err)
                }
            }
        })

        hemera.log.info("🔔 Đang lắng nghe thông báo từ Redis...")
    } else {
        hemera.log.error("❌ Không thể kết nối Redis Subscriber")
    }

    done()
})

export default notificationPlugin