const socket=require('socket.io');
const cors=require('cors');
const io=require('socket.io')(8001,{

    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        
    }
});

io.use((socket, next) => {
    socket.handshake.headers.origin = "*";
    next();
});
io.use(cors())

//storing all the login users
let users=[];

//adding user
function addUser(socketId,userId,fullName)
{
    !users.some((user)=>user._id==userId)&&users.push({socketId,_id:userId,fullName})
}

//removing a user
function removeUser(socketId)
{
    users=users.filter((user)=>user.socketId!==socketId);
}

//finding a socketid

function findSocketId(userId)
{
    // console.log("to be find is ",userId)
    return users.find((user)=>user._id===userId);
}


io.on("connection",(socket)=>{
    // console.log("A user is connected",socket.id);

    socket.on("addUser",(userId,fullName)=>{
        // console.log("User id is ",userId,fullName)
              addUser(socket.id,userId,fullName);
              io.emit("getUsers",users);
              
    })

    socket.on("saveMSG",async(data)=>{
        // console.log("Data is ",data);
        const soc=await findSocketId(data.receiverId);
        // console.log("Socket id of receiver is ",soc)
        io.to(soc?.socketId).emit("receiveMSG",data);
    })


    //
    socket.on("disconnect",()=>{
        // console.log("A user is disconnected")
        removeUser(socket.id);
        io.emit("getUsers",users);
    })
})