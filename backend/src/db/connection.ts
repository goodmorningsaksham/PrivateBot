import { connect,disconnect } from "mongoose";
async function connectDB() {
    try {
        await connect(process.env.MONGODB_URL);
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
        throw new Error("Error connecting to MongoDB");
    }
}

async function disconnectDB() {
    try {
        await disconnect();
    } catch (error) {
        console.log("Error disconnecting from MongoDB", error);
        throw new Error("Error disconnecting from MongoDB");
    }
} 

export { connectDB, disconnectDB };