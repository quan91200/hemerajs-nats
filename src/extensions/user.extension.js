export default function userExtension(hemera) {
    // Middleware chạy trước khi xử lý action
    hemera.ext('onRequest', (req, reply, next) => {
        hemera.log.info(`📢 Incoming user request`, {
            topic: req?.topic || 'unknown',
            cmd: req?.cmd || 'unknown',
            payload: req
        })
        next()
    })

    // Middleware xử lý logs sau khi hoàn thành action
    hemera.ext('onActFinished', (req, reply, next) => {
        hemera.log.info(`✅ Completed user action`, {
            topic: req?.topic || 'unknown',
            cmd: req?.cmd || 'unknown',
            response: reply
        })
        next()
    })

    // Middleware xử lý lỗi
    hemera.ext('onError', (err, req, reply) => {
        hemera.log.error(`❌ Error in user action`, {
            topic: req?.topic || 'unknown',
            cmd: req?.cmd || 'unknown',
            error: err.message
        })
        reply(err)
    })
}