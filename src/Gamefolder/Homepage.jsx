import React, { useState,useEffect, } from "react";
import Square from "./Square";
import axios from "axios"
axios.defaults.withCredentials = true;
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import STaricon from "../assets/reshot-icon-stars-WGC36LBUHF.svg";
import TicTakToeIcon from "../assets/Game_icon.png";
import Profile_Avatar from "../assets/Game_avatar.png";
import Silver_League from '../assets/Silver_League.png'
const Homepage = ({ handleVisiblity }) => {
  const [state, setstate] = useState(Array(9).fill(null));
  const [player, setplayer] = useState(true);
  const [visible, isvisible] = useState(false);
  const [login,setlogin] = useState(false);
  const [user,setuser] = useState(null)
  const [stats,setstats] = useState({
    Wins:0,
    lost:0,
    Points:1500,
  })
  const navigate = useNavigate();
  const {logout} = useAuth();
  useEffect(()=>{
axios.get(`${import.meta.env.VITE_API_URL}/profile`,{
    headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
}).then(res=>{
  setuser(res.data)
  setlogin(true)
  if(res.data){
    console.log("user data:",res.data)
  }else{
    console.log("User kaha hia")
  }
}).catch(err=>{
  console.log("Not Logged in",err);
  setlogin(false);
  setuser(null)
})
// getting the game stats 
axios.get(`${import.meta.env.VITE_API_URL}/profile/gamestats`,{
  headers:{
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
}).then((res)=>{
  setstats(res.data.stats);
  console.log(res.data.stats)
}).catch((err) => {
        console.error("Error fetching stats", err);
      });
  },[])
  const handleLogout = ()=>{
    if(login){
    logout();
    }else{
      navigate("/homepage/login")
    }
  }
  const handleLogin = ()=>{
    if(login){
      alert("you are already login")
    }else{
      navigate("/homepage/signup")
    }
  }
  const handleClick = (index) => {
    const copyState = [...state];
    // prevent overiding

    copyState[index] = player ? "X" : "O";
    setstate(copyState);
    setplayer(!player);
    const music = new Audio("menu-button-89141.mp3");
    music.play();
    if (music) {
      console.log("music played");
    } else {
      console.log("music not played");
    }
  };
  //handle start
  const handleStart = () => {
    handleClick();
    navigate("/Gamemenu");
  };
  return (
    <>
      <div className="Homepage-body">
        <div className="Profile-Card">
          <div className="Profilecard_top">
          <div className="Name_Card">
            <img src={Profile_Avatar} className="Profile_Avatar" alt="" />
            <p className="Avatar_Name">{user? user.Username:"Guest"}</p>
          </div>
          <div className="League">
            <img src={Silver_League} alt="" className="Profile_League_Avatar" />
            <p className="Level_Points">{stats.Points || 0}</p>
          </div>
          </div>
          <div className="Profilecard_Bottom">
            <div className="Wins_Lose_Stats">
              <p>🏅 Wins: {stats.Wins || 0}</p>
              <p>😞 Lost: {stats.lost || 0}</p>
            </div>
            <div className="Login_Logout">
              {
                login?<button onClick={handleLogout} className="Logout">
             Logout
             </button>:<button onClick={handleLogin} className="Login">
             Login
             </button>
              }
            </div>
            <div className="Details_Profile" onClick={()=>navigate('/homepage/Profile')}>
            <a className="Profile" href="">Profile</a>
            </div>
          </div>
        </div>
        <div className="Title_box">
          <img src={STaricon} alt="Star_Image" />
          <p className="Title">Tic-Tak Toe Battle!</p>
        </div>
        <div className="Homepage">
          <div className="Rules">
            <img src={TicTakToeIcon} alt="" />
          </div>
          <div>
            <button className="Button" onClick={handleStart}>
              <p>Start!</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage;
