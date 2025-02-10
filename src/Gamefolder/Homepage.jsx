import React from 'react'
const Homepage = ({handleVisiblity}) => {

  return (
    <>
    <div className='Homepage-body'> 
    <div className='Homepage'>
      <div>
      <p className='Title'>Welcome to Tic -Tac -toe</p>
      </div>
      <div className='Rules'>
      
        <p>Rules</p>
      <ul>
        <li>Player 1 is X,player 2 is O</li>
        <li>First one who has same X or O will win</li>
      </ul>
      </div>
<div className="button-border">
  <div className="button-base">
    <button className="button" onClick={handleVisiblity}>Start</button>
  </div>
</div>
    </div>
    </div>
    </>
  )
}

export default Homepage
