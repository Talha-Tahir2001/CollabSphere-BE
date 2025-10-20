import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI environment variable is not set");
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI as string);
        if (!conn) {
            throw new Error("Failed to connect to MongoDB");
        }


    } catch (error) {
        if (error instanceof Error) {
            console.error("❌ MongoDB Connection Error:", error.message);
        } else {
            console.error("❌ MongoDB Connection Error:", error);
        }
        process.exit(1); // stop the app if DB fails
    }
};

export default connectDB;
