import Hemera from 'nats-hemera'
import NATS from 'nats'
import Pino from 'pino'

const nats = NATS.connect(process.env.NATS_URL || "nats://localhost:4222")

const hemera = new Hemera(nats, {
    logLevel: 'info',
    logger: Pino({ transport: { target: "pino-pretty", options: { colorize: true } } })
})

export { nats }
export default hemera