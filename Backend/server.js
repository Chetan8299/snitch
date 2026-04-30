import app from "./src/app.js"
import { env } from "./src/config/env.js"
import connectDB from "./src/config/db.js"


const startServer = async () => {
    try {
        await connectDB();
        app.listen(env.PORT, () => {
            console.log(`Server is running on port ${env.PORT}`)
        })
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

startServer();