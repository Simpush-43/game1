import { useState } from 'react'
import Board from './Gamefolder/Board';
import './Board.css'
import './Homepage.css'
import Homepage from './Gamefolder/Homepage';
function App() {
const [homepage,sethomepage] = useState(true);
const handleVisiblity=()=>{
  sethomepage(false);
  const audio = new Audio('menu-button-89141.mp3');
  audio.play();
  if(audio){
    console.log('audio played')
  }else{
    console.log('audiio nhi play hua')
  }
}
  return (
    <>
    <div className='App'>
      {homepage?(<Homepage handleVisiblity={handleVisiblity}/>):(<Board/>)}
    </div>
    </>
  )
}

export default App
