import React from 'react'
import {useState} from 'react'
import {motion} from 'framer-motion'
import {Menu,X} from 'lucide-react'

const Navbar = ({props}) => {
  const [isOpen,setisOpen] = useState(false)
  return (
    <div className='App-Container'>
      <div className="Top_Navbar">
        <h2>Username:{props.data.Username}</h2>
      </div>
    </div>
  )
}

export default Navbar
