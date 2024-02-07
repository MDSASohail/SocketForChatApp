const socket=require('socket.io');
const io=require('socket.io')(8001,{

    cors: {
        // origin: "https://mdsasohail.github.io",
        // origin:'http://localhost:3000',
        origin:'*',
        methods: ["GET", "POST"]
      }

})


//storing all the login users
let users=[];

//adding user
function addUser(socketId,userId,fullName)
{
    !users.some((user)=>user.userId==userId)&&users.push({socketId,userId,fullName})
}

//removing a user
function removeUser(socketId)
{
    users=users.filter((user)=>user.socketId!==socketId);
}

//finding a socketid

function findSocketId(userId)
{
    return users.find((user)=>user.userId===userId);
}


io.on("connection",(socket)=>{
    console.log("A user is connected",socket.id);

    socket.on("addUser",(userId,fullName)=>{
        console.log("User id is ",userId,fullName)
              addUser(socket.id,userId,fullName);
              io.emit("getUsers",users);
              
    })


    //
    socket.on("disconnect",()=>{
        console.log("A user is disconnected")
        removeUser(socket.id);
        io.emit("getUsers",users);
    })
})