
const express = require("express");
const  {chats}  = require("./data/data.js");

const userRoutes = require("./Routes/userRoutes.js");
const chatRoutes = require("./Routes/chatRoutes.js");
const messageRoutes = require("./Routes/messageRoutes.js");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const { notFound, errorHandler } = require("./middlewares/errorMiddlewares.js");
const cors = require("cors");
const app = express();
dotenv.config();
connectDB();

/*CORS MIDDLEWARE - MUST BE BEFORE ROUTES */
app.use(
  cors({
    origin: ["http://localhost:5173"], // your Vite frontend in dev
    credentials: true, // safe even if you don't use cookies
  })
);

app.use(express.json()); // to accept json data

app.get("/",(req,res)=>{
    res.send("API IS RUNNING SUCCESSFULLY")
})

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;

const server = app.listen(5000, ()=>{
    console.log(`Server is running on port ${PORT}`);
})

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5173",
    },
});

io.on("connection", (socket)=>{
    console.log("Connected to socket.io");

    socket.on("setup", (userData)=>{
        socket.join(userData._id);
        console.log(userData._id);
        
        socket.emit("connected");
    });

    socket.on("join chat",(room)=>{
        socket.join(room);
        console.log("User Joined Room: " + room); 
    });

    socket.on("typing", (room)=>{
        socket.in(room).emit("typing");
    });

    socket.on("stop typing", (room)=>{
        socket.in(room).emit("stop typing");
    });

    socket.on("new message", (newMessageRecieved)=>{
        var chat = newMessageRecieved.chat; 

        if(!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user)=>{
            if(user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
            
        })
    });

    socket.off("setup", ()=>{
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
     
})