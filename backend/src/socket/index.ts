import { Server } from "socket.io";
import http from "http";
import { prisma } from "../config/prisma.js";

let io: Server | undefined;

export const initSocket = (server: http.Server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        console.log("a user connected:", socket.id);

        socket.on("joinRoom", (userId:string)=>{
            socket.join(userId);
            console.log("user joined room:", userId);
        })

        socket.on("register", (userId: string) => {
            socket.join(userId);
        });

        socket.on(
            "send_message",
            async (data: { chatId: string; senderId: string; receiverId: string; content: string }) => {
                const { chatId, senderId, receiverId, content } = data;

                // Persist message using chatId-based schema
                let saved;
                try {
                    saved = await (prisma as any).message.create({
                        data: { chatId, senderId, content },
                    });
                } catch (err) {
                    console.error("Failed to save message:", err);
                    return;
                }

                // Emit the saved message to the receiver's room
                getIO().to(receiverId).emit("receive_message", saved);

                // Create and emit a notification to the receiver
                try {
                    const notification = await (prisma as any).notification.create({
                        data: {
                            userId: receiverId,
                            type: "chat",
                            message: `New message from user ${senderId}`,
                        },
                    });
                    getIO().to(receiverId).emit("notification", notification);
                } catch (err) {
                    console.error("Failed to create notification:", err);
                }
            }
        );

        socket.on("disconnect", ()=>{
            console.log("user disconnected:", socket.id);
        })
    });
    return io;
};

export const getIO = (): Server => {
    if (!io) {
        throw new Error("Socket.io not initialized. Call initSocket(server) first.");
    }
    return io;
};