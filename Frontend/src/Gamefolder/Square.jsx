import React from "react";
 
const Square =(props)=>{
  const backgroundColor =props.value ==='X'?'red':(props.value === 'O'? 'green':'transaprent')
  const color = props.value === 'X'?'#00b6ff':(props.value ==='O'?'yellow':'')
  const textShadow = props.value === 'X'?'rgba(0, 0, 0, 0.3) 14px 11px 1px':(props.value ==='O'?'2px 2px 4px rgba(223, 203, 24, 0.3)':'')
  return(
<>
<div onClick={props.onClick}
style={{
  border:"1.5px solid white" ,
  height:"100px",
  width:"100%",
  display:"flex",
  justifyContent:"center",
  alignItems:"center",
  fontSize:"3rem",
  backgroundColor:backgroundColor,
  color:color,
  textShadow:textShadow,
  fontFamily: "Raleway",
}}
className="square">
  <h5>{props.value?props.value:''}</h5>
</div>
</>
  )
}
export default Square;