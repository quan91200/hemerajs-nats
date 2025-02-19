import cluster from "cluster"
import os from "os"
import startServer from "./src/server.js"

function startCluster() {
    if (cluster.isPrimary) {
        const numCPUs = os.cpus().length
        console.log(`🔁 Đang khởi chạy ${numCPUs} worker...`)

        for (let i = 0; i < numCPUs; i++) {
            cluster.fork()
        }

        cluster.on("exit", (worker) => {
            console.log(`❌ Worker ${worker.process.pid} chết, restart lại...`)
            cluster.fork() // Restart worker nếu bị crash
        })
    } else {
        startServer()
    }
}

export { startCluster }