import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("MongoDB connected");
        console.log("Connected host:", mongoose.connection.host);
        console.log("Connected DB:", mongoose.connection.name);
        console.log("Connected readyState:", mongoose.connection.readyState);
    } catch (error) {
        console.log("MongoDB connection error: ", error);
        process.exit(1);
    }
};
