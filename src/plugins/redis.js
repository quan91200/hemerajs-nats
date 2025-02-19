import Redis from "ioredis"
import chalk from "chalk"

const redisPub = new Redis()
const redisSub = new Redis()

// Lắng nghe các thông báo
redisSub.subscribe("notifications", (err, count) => {
    if (err) {
        console.log(chalk.red("❌ Lỗi khi subscribe:"), err)
    } else {
        console.log(chalk.green(`📡 Đang lắng nghe ${count} channel...`))
    }
})

// Xử lý thông báo
redisSub.on("message", (channel, message) => {
    try {
        const notification = JSON.parse(message)

        console.log(chalk.green("\n📡 Nhận thông báo mới!"))
        console.log(`${chalk.yellow("🔔 Loại:")} ${chalk.blue(notification.type)}`)
        console.log(`${chalk.cyan("👤 Người nhận ID:")} ${notification.userId}`)
        console.log(`${chalk.magenta("📨 Người gửi ID:")} ${notification.senderId}`)
        console.log(`${chalk.white("💬 Nội dung:")} ${chalk.gray(notification.message)}`)
        console.log(`${chalk.gray("📅 Thời gian:")} ${new Date(notification.createdAt).toLocaleString()}`)
        console.log(chalk.gray("---------------------------------------------------"))
    } catch (error) {
        console.log(chalk.red("❌ Lỗi khi xử lý thông báo:"), error)
    }
})

export { redisPub, redisSub }