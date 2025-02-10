import React from "react";
 
const Square =(props)=>{
  const backgroundColor =props.value ==='X'?'red':(props.value === 'O'? 'green':'transaprent')
  const color = props.value === 'X'?'white':(props.value ==='O'?'yellow':'')
  const textShadow = props.value === 'X'?'2px 2px 4px rgba(0, 0, 0, 0.3)':(props.value ==='O'?'2px 2px 4px rgba(223, 203, 24, 0.3)':'')
  return(
<>
<div onClick={props.onClick}
style={{
  border:"2px solid brown" ,
  height:"100px",
  width:"100%",
  display:"flex",
  justifyContent:"center",
  alignItems:"center",
  fontSize:"1.3rem",
  backgroundColor:backgroundColor,
  color:color,
  textShadow:textShadow,
}}
className="square">
  <h5>{props.value?props.value:''}</h5>
</div>
</>
  )
}
export default Square;