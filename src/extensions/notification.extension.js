export default function notificationExtension(hemera) {
    // Middleware chạy trước khi xử lý action cho notification
    hemera.ext('onRequest', (req, reply, next) => {
        if (req.topic === 'notification') {
            hemera.log.info(`📢 Incoming notification request: ${req.topic}.${req.cmd}`)
        }
        next()
    })

    // Middleware xử lý logs sau khi hoàn thành action cho notification
    hemera.ext('onActFinished', (req, reply, next) => {
        if (req.topic === 'notification') {
            hemera.log.info(`✅ Completed notification action: ${req.topic}.${req.cmd}`)
        }
        next()
    })

    // Middleware chạy khi có lỗi cho notification
    hemera.ext('onError', (err, req, reply) => {
        if (req.topic === 'notification') {
            hemera.log.error(`❌ Error in notification action: ${req.topic}.${req.cmd}`, err)
        }
        reply(err)
    })
}