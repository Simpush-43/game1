import React,{useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom';
import socket from './Socket';
const Multiplayer = () => {
  const [roomCode,setroomCode ] = useState(null);
  const [inputroomcode,setinputroomcode] = useState('');
  const [isRoomCreator, setIsRoomCreator] = useState(false);
  const navigate = useNavigate();
  useEffect(()=>{
// connect to web socket sever

socket.on('connect',()=>{
  console.log("🚨 Socket.io is connected" )
})
socket.on('RoomCreated',({roomCode})=>{
  console.log('Room Created:',roomCode);
  setroomCode(roomCode);
  setIsRoomCreator(true);
  navigate(`/Gamemenu/${roomCode}`)
})
socket.on('Start',({symbol,roomCode})=>{
  alert(`Game Stared You are ${symbol} in room ${roomCode}`)
  navigate(`/Gamemenu/${roomCode}`,{
    state:{symbol}
  });
})
socket.on('JoinFailed',({message})=>{
  alert(message)
})
socket.on('disconnect', () => {
  console.log('Socket disconnected ❌');
});
    return () => {
      socket.off('connect');
      socket.off('RoomCreated');
      socket.off('Start');
      socket.off('JoinFailed');
      socket.off('disconnect');
    };
  },[navigate])
  const createRoom = ()=>{
    console.log('🔄 Trying to create room...');
    socket.emit('CreateRoom');
    setIsRoomCreator(true);
  }
  const joinRoom = ()=>{
    if (isRoomCreator) {
      alert("You're the creator. Share the code instead!");
      return;
    }
    if (inputroomcode.trim()) {
      socket.emit('JoinRoom', { roomCode: inputroomcode.trim() });
    }
  }
  return (
    <>
          <div style={{ padding: 20 }}>
      <h1>Multiplayer Room</h1>
      <button onClick={createRoom}>Create Room</button>
      <p>Your room code is :<strong>{roomCode}</strong></p>
      <hr />
      <h2>Join Room</h2>
      <input type="text"
      placeholder='Enter the roomCode'
      onChange={(e)=>setinputroomcode(e.target.value)}
      value={inputroomcode}
      />
      <button onClick={joinRoom}>Join Room</button>
    </div>
    </>
  )
}

export default Multiplayer
