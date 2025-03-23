import React,{useState} from 'react'
import Square from './Square'
const Homepage = ({handleVisiblity}) => {
  const [state, setstate] =useState(Array(9).fill(null))
  const [player,setplayer] = useState(true);
 const [visible, isvisible] = useState(false);

 const handleClick =(index)=>{
  const copyState = [...state];
  // prevent overiding 

  copyState[index]= player? 'X':'O';
  setstate(copyState);
  setplayer(!player);
  const music = new Audio('menu-button-89141.mp3');
  music.play();
  if(music){
    console.log('music played')
  }else{
    console.log('music not played')
  }
  }

const renderBoard =()=>{
  return(
  <>
  <div className="board-container"> 
  <div className="board-row">
 {[0,1,2].map((i)=>(
    <Square key={i} onClick={()=>handleClick(i)} value={state[i]}/>
  ))
  }
  </div>
  <div className="board-row">
  {[3,4,5].map((i)=>(
     <Square key={i} onClick={()=>handleClick(i)} value={state[i]}/>
   ))
   }
   </div>
   <div className="board-row">
  {[6,7,8].map((i)=>(
     <Square key={i} onClick={()=>handleClick(i)} value={state[i]}/>
   ))
   }
   </div>
  </div>
   </>
  )
}
  return (
    <>
    <div className='Homepage-body'> 
    <div>
      <p className='Title'>Tic-Tak Toe Battle!</p>
      </div>
    <div className='Homepage'>
      <div className='Rules'>
     {/* Always show the demo board */}
            {renderBoard()}
            {/* Game Board, shown on "Start" click */}
            {visible && (
              <>
                <h3>Game Board:</h3>
                {renderBoard()}
              </>
            )}
      </div>
<div>
<button onClick={handleVisiblity}>
  <p>Start!</p>
</button>
</div>
    </div>
    </div>
    </>
  )
}

export default Homepage
