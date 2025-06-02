import React, { useEffect } from 'react'
import {useContext,createContext,useState,} from 'react'
const AuthorizeContext = createContext();
 export const AuthContext = ({children}) => {
  const [token ,settoken] = useState(localStorage.getItem('token')||'');
  const login =(newtoken)=>{
localStorage.setItem("token",newtoken)
settoken(newtoken)
  }
    const logout = ()=>{
    localStorage.removeItem("token")
    settoken('')
  }
  return (
    <div>
      <AuthorizeContext.Provider value={{token,login,logout,isAuthenticated: !!token}}>
{children}
      </AuthorizeContext.Provider>
    </div>
  )
}
export const useAuth = ()=>{
  return useContext(AuthorizeContext)
}
