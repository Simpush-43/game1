
const { createServer} = require('http')
const {Server} = require('socket.io')
// room class
class Room{
  constructor(roomCode){
    this.roomCode = roomCode;
    this.players = []
    this.turn = 0
  }
  addPlayer(socket,user){
  if(this.players.length >=2){
 console.log(`the room ${this.roomCode} is full`)   
 return false
  }
  this.players.push({socket,user})
  console.log(`you are added to room ${this.roomCode} with total no if players ${this.players.length}`)
  return true
}
getCurrentPlayer(){
  return this.players[this.turn]
}
switchTurn(){
   this.turn = 1-this.turn
}
}
const SocketIoServer = (app) =>{
  const server = createServer(app)
  const io = new Server(server,{
    cors:{
      origin:["http://localhost:5173", "https://game1-ivory.vercel.app"],
      methods:["GET","POST"],
      credentials:true
    }
  });
  console.log("setting up the server")

  const rooms = new Map();
  io.on('connection',(socket)=>{
    console.log("A user is connected");

    socket.on("CreateRoom",()=>{
      const roomCode = Date.now().toString(25);
      const room = new Room(roomCode)
      const added = room.addPlayer(socket,null);

      if(added){
        rooms.set(roomCode,room);
        socket.join(roomCode);
        socket.emit("RoomCreated",{roomCode})
        console.log(`Room Created with roomCode:${roomCode}`)
      }
    });
    socket.on("JoinRoom",({roomCode,user})=>{
      const room = rooms.get(roomCode)
      if(!room){
        console.log('No room Exists');
        socket.emit("JoinFailed", {message:"Room doesn't exists"})
        return;
      }
      socket.user = user;
      const success = room.addPlayer(socket,user)
      if(!success){
        socket.emit("JoinFailed",{message:"Room is full or invalid code"})
        return;
      }
      room.players.forEach((playerobj,index)=>{
        const opponent = room.players[1- index].user;
        playerobj.socket.join(roomCode)
        playerobj.socket.emit("Start",{
           symbol: index ===0?"X":"O",
           roomCode,
           opponent,
        })
      })
    })
    socket.on('Makemove',({roomCode,index,symbol})=>{
      const room = rooms.get(roomCode);
      if(!room){
        console.log("No Room Exists")
        return false
      }
      room.switchTurn();
      room.players.forEach(playerSocket=>{
      playerSocket.emit("MoveMade",{
        index,
        symbol,
      nextTurn: room.turn === 0?"X":"O"
      })
      })
    })
    socket.on("disconnect",()=>{
      console.log("A user has been disconnected")
    })
  })
  return server
}
module.exports = SocketIoServer