export default function postExtension(hemera) {
    // Middleware chạy trước khi xử lý action cho post
    hemera.ext('onRequest', (req, reply, next) => {
        if (req.topic === 'post') {
            hemera.log.info(`📢 Incoming post request: ${req.topic}.${req.cmd}`)
        }
        next()
    })

    // Middleware xử lý logs sau khi hoàn thành action cho post
    hemera.ext('onActFinished', (req, reply, next) => {
        if (req.topic === 'post') {
            hemera.log.info(`✅ Completed post action: ${req.topic}.${req.cmd}`)
        }
        next()
    })

    // Middleware chạy khi có lỗi cho post
    hemera.ext('onError', (err, req, reply) => {
        if (req.topic === 'post') {
            hemera.log.error(`❌ Error in post action: ${req.topic}.${req.cmd}`, err)
        }
        reply(err)
    })
}