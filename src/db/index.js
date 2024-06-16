import mongoose from "mongoose"

const connectDb = async () => {
    try {
        const connectionInstances = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        console.log(`mongodb connected !! DB HOST : ${connectionInstances.connection.host}`)
    } catch (error) {
        console.log("mongodb connection failed", error)
        process.exit(1)
    }
}

export default connectDb