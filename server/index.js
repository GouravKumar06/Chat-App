const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
const connectDatabase = require("./database/db");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const path = require("path");

const socket = require("socket.io");

//middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(
    {
        origin: ["http://localhost:3000"],
        credentials: true
    }
));

// connect database
connectDatabase();
//routes
app.use("/api/user", userRoutes);
app.use("/api/message",messageRoutes);

// ------------------- Deployment ------------------

const __dirname1 = path.resolve();
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname1,"/public/build")));
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname1,"public","build","index.html"));
    })
}
else{
    app.get("/",(req,res)=>{
        res.send("API is running..");
    })
}

// -------------------Deployment ------------------


const server = app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
})

const io = socket(server,{
    cors:{
        origin:"http://localhost:3000",
        credentials:true
    }
});

global.onlineUsers = new Map();

io.on("connection",(socket)=>{
    global.chatSocket = socket;

    socket.on("add-user",(userId)=>{
        onlineUsers.set(userId,socket.id);
    })
    
    socket.on("send-msg",(data)=>{
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve",data.message);
        }
    })
})