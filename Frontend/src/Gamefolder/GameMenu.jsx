import React from 'react'
import solo from '../../assets/solo.svg'
import Freinds from '../../assets/freinds.svg'
import Ai from '../../assets/computer.svg'
import Stars from '../../assets/Star_GameMenu.svg'
import {useNavigate} from 'react-router-dom'
const GameMenu = () => {
  const navigate = useNavigate();
  const HandleNavigateToSoloBoard= ()=>{
    console.log("naigating to solo board..")
    navigate('/board')
  } 
  const HandleNavigateToMuliplayer= ()=>{
    console.log("naigating to Custom Room..")
    navigate('/Gamemenu/CustomRoom')
  } 
  return (
    <>    <div className="glass-image">
      </div>
    <div className='Game_Menu'>
      <div className="Title_Game">
        <img src={Stars}alt="" />
        <p>
          Tic-Tak-Toe Battle!
        </p>
      </div>
      <div className="Outer_Border">
      <div className="Board_Container">
        <button className='Option1' onClick={HandleNavigateToSoloBoard}> 
          <img src={solo} alt="" />
          <p>Single Player</p>
        </button>
        <button className='Option2' onClick={HandleNavigateToMuliplayer}>
          <img src={Freinds} alt="" />
          <p>Multiplayer</p>
        </button>
        <button className='Option3'>
          <img src={Ai}alt="" />
          <p>Vs. Computer</p>
        </button>
      </div>
      </div>
      <div className='Back'>
        <button onClick={() => navigate('/homepage')} className='Gamemenu-Back'>
        Go Back
      </button>
      </div>
    </div>
    </>
  )
}

export default GameMenu

