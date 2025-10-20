import { Server, Socket } from "socket.io";
import Message from "../models/messageModel.js";

export default function chatSocketHandler(io: Server) {
    io.on("connection", (socket: Socket) => {
        console.log(`🟢 User connected: ${socket.id}`);

        // Join a chat room
        socket.on("joinRoom", (roomId: string) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
        });

        // Send message event
        socket.on(
            "sendMessage",
            async (data: { roomId: string; senderId: string; receiverId?: string; message: string }) => {
                console.log(`💬 ${data.senderId}: ${data.message}`);

                try {
                    // ✅ Save message to MongoDB
                    const message = await Message.create({
                        sender: data.senderId,
                        receiver: data.receiverId || null,
                        workspace: data.roomId,
                        content: data.message,
                    });

                    const populatedMessage = await message.populate("sender", "username email");

                    // ✅ Emit the message to all clients in the room
                    io.to(data.roomId).emit("receiveMessage", populatedMessage);
                } catch (err) {
                    console.error("❌ Error saving message:", err);
                }
            }
        );

        // Typing indicator
        socket.on("typing", (roomId: string) => {
            socket.to(roomId).emit("userTyping");
        });

        // Disconnect event
        socket.on("disconnect", () => {
            console.log(`🔴 User disconnected: ${socket.id}`);
        });
    });
}
