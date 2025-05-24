import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Board from "./Gamefolder/Board";
import "./Board.css";
import "./Homepage.css";
import "./SignUp.css";
import "./Gamemenu.css";
import "./Profile.css";
import "./Multiplayer.css"
import Homepage from "./Gamefolder/Homepage";
import Sign_Up from "./Gamefolder/Sign_Up";
import GameMenu from "./Gamefolder/GameMenu";
import Multiplayer from "./Gamefolder/Multiplayer";
import ErrorBoundary from "./Gamefolder/ErrorBoundary";
import { useAuth } from "./Gamefolder/AuthContext";
import CustomRoom from "./Gamefolder/CustomRoom";
import Profile from "./Gamefolder/Profile";
import ProtectedRoute from "./Gamefolder/ProtectedRoute";
function AppContent() {
  const [homepage, sethomepage] = useState(true);
    const [loading, setLoading] = useState(true); // 👈 NEW
    const {token} = useAuth();
  useEffect(() => {
    setLoading(false);
  }, []);
  const handleVisiblity = () => {
    sethomepage(false);
    const audio = new Audio("menu-button-89141.mp3");
    audio.play();
    if (audio) {
      console.log("audio played");
    } else {
      console.log("audiio nhi play hua");
    }
  };
    if (loading) {
    return <div>Loading...</div>; // or splash screen
  }
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<Navigate to="/homepage" />} />
        {!token &&(
          <>
            <Route
              path="/homepage"
              element={homepage?(<ErrorBoundary><Homepage handleVisiblity={handleVisiblity}/></ErrorBoundary>):(<Sign_Up/>)}
            />
            <Route path="/homepage/signup" element={<Sign_Up/>}/>
            <Route path="*" element={<Navigate to ="/"/>}/>
          </>
        ) }
        {token &&(
          <>
          <Route path ="/homepage" element={
             <ProtectedRoute>
              <ErrorBoundary>
<Homepage handleVisiblity={handleVisiblity}/>
              </ErrorBoundary>
             </ProtectedRoute>
          }/>
          <Route path="/homepage/profile" element={
            <ProtectedRoute>
              <ErrorBoundary>
              <Profile/>
              </ErrorBoundary>
            </ProtectedRoute>
          }/>
          <Route path="/board" element={
            <ProtectedRoute>
              <Board/>
            </ProtectedRoute>
          }/>
          <Route path="/Gamemenu" element={
            <ProtectedRoute>
              <GameMenu/>
            </ProtectedRoute>
          }/>
          <Route path="/Gamemenu/CustomRoom" element={
            <ProtectedRoute>
              <ErrorBoundary>
              <CustomRoom/>
              </ErrorBoundary>
            </ProtectedRoute>
          }/>
          <Route path="/Gamemenu/:roomCode" element={
            <ProtectedRoute>
              <ErrorBoundary>
              <Multiplayer/>
              </ErrorBoundary>
            </ProtectedRoute>
          }/>
          <Route path="*" element={<Navigate to="/homepage" />} />
          </>
        )
        }
      </Routes>
    </BrowserRouter>
  );
}


export default AppContent;
