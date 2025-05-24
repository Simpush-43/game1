import React, { useState, useEffect ,useRef} from 'react';
import Square from './Square';
import { useNavigate, useParams ,useLocation} from 'react-router-dom';
import socket from './Socket';
import axios from 'axios';
import Player_Avatar from "../assets/Game_avatar.png"
const Multiplayer = () => {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [myTurn, setMyturn] = useState(false);
  const [winner, setwinner] = useState(null);
  const [message, setmessage] = useState('Connecting to the room...');
    const [user,setuser] = useState(null);
    const [opponent,setopponent] = useState(null)
  const playerSymbolRef = useRef(null);
  const location = useLocation();
  const winnerCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const checkWinner = (newboard) => {
    for (let combo of winnerCombos) {
      const [a, b, c] = combo;
      if (newboard[a] && newboard[a] === newboard[b] && newboard[a] === newboard[c]) {
        return newboard[a];
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (!myTurn || board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = playerSymbol;
    setBoard(newBoard);
    setMyturn(false);

    const win = checkWinner(newBoard);
    if (win) setwinner(win);

    socket.emit('Makemove', {
      index,
      symbol: playerSymbol,
      roomCode,
    });
  };

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/profile`,{
    headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
}).then(res=>{
  setuser(res.data)
  if(res.data){
    console.log("user data:",res.data)
  }else{
    console.log("User kaha hia")
  }
}).catch(err=>{
  console.log("Not Logged in",err);
  setuser(null)
})
        if (location.state?.symbol) {
      const symbol = location.state.symbol;
      setPlayerSymbol(symbol);
      playerSymbolRef.current = symbol;
      setMyturn(symbol === 'X');
      setmessage(`You are ${symbol}`);
    }
    socket.on("connect", () => {
      console.log("✅ Connected to server");

      socket.emit("JoinRoom", { roomCode,user });
      if (!location.state?.symbol) {
        setmessage("Connected to room ✅");
      }
    });

    socket.on("Start", ({ symbol,opponent }) => {
      if (!playerSymbolRef.current) {
        setPlayerSymbol(symbol);
        playerSymbolRef.current = symbol;
        setMyturn(symbol === 'X');
        setmessage(`You are ${symbol}`);
        setopponent(opponent)
      }
    });

    socket.on("MoveMade", ({ index, symbol,nextTurn }) => {
    setBoard(prevBoard=>{
      const newBoard = [...prevBoard];
      newBoard[index]= symbol;
      const win = checkWinner(newBoard);
      if (win) setwinner(win);
      setMyturn(playerSymbolRef.current === nextTurn);
      return newBoard
    })
    });

    socket.on("reset", ({ symbol }) => {
      setBoard(Array(9).fill(null));
      setwinner(null);
      setMyturn(symbol === playerSymbol);
    });

    socket.on("JoinFailed", ({ message }) => {
      setmessage(message);
      setTimeout(() => navigate('/'), 2000);
    });

    socket.on("disconnect", () => {
      setmessage("❌ Disconnected from server");
    });

    return () => {
      socket.off("connect");
      socket.off("Start");
      socket.off("MoveMade");
      socket.off("reset");
      socket.off("JoinFailed");
      socket.off("disconnect");
    };
  }, [ navigate, roomCode,location.state?.symbol]);
  useEffect(()=>{
if(winner && user){
  const result = winner === playerSymbolRef.current ? "win":"loss"
  axios.put(`${import.meta.env.VITE_API_URL}/profile/Update-gamestats`,{
    result,
  }, {headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
    ).then(res=>console.log("game stats:",res.data))
    .catch((err)=>{
      console.log("error",err)
    })
}
  },[winner,user])

  const handleReset = () => {
    socket.emit("reset", { roomCode });
  };

  return (
    <>
       {user && (
      <div className="user-info_Multiplayer">
        <img src={Player_Avatar} alt=""  className='Profile_League_Avatar' />
        <div className="User_stats">
        <p><strong>Username:</strong> {user.Username}</p>
        <p><strong>Level: </strong>{user?.rank||'silver'}</p>
        </div>
      </div>
    )}
    {opponent && (
  <div className="user-info_Multiplayer">
    <img src={Player_Avatar} alt="Opponent Avatar" className='Profile_League_Avatar' />
    <div className="User_stats">
      <p><strong>Opponent:</strong> {opponent.Username}</p>
      <p><strong>Level: </strong>{opponent.rank || 'silver'}</p>
    </div>
  </div>
)}
    <div className="Board-mesh">
      <p className="Board-title">Multiplayer Tic Tac Toe</p>
      <p><strong>Room Code:</strong> {roomCode}</p>
      <p>{message}</p>
      {winner && <p className="WinnerName">{winner} won the game!</p>}
<div className="board-container">
  {[0, 1, 2].map(row => (
    <div className="board-row" key={row}>
      {board.slice(row * 3, row * 3 + 3).map((value, idx) => (
        <Square
          key={row * 3 + idx}
          value={value}
          onClick={() => handleClick(row * 3 + idx)}
        />
      ))}
    </div>
  ))}
</div>

      {winner && (
        <button onClick={handleReset} className="reset-button">
          Play Again
        </button>
      )}
      <button onClick={() => navigate('/homepage')} className="back-button">
        Go Back
      </button>
    </div>
    </>
  );
};

export default Multiplayer;
