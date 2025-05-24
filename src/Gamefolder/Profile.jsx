import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Avatar_User from "../assets/Game_avatar.png";
import Avatar_Badge from "../assets/Silver_League.png";
const Profile = () => {
  const [user, setuser] = useState(null);
  const [loading, setlaoding] = useState(true);
  const [editmode, seteditmode] = useState(false);
  const [maileditmode, setmaileditmode] = useState(false);
  const [passeditmode, setpasseditmode] = useState(false);
  const [newUsername, setnewUsername] = useState("");
  const [newEmail, setnewEmail] = useState("");
  const [oldPassword, setoldpassword] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [message, setmessage] = useState("");
  const [stats,setstats] = useState({
    Wins:0,
    Streak:0,
    Total_Matches:0,
    lost:0,
  });
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:2929/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setuser(res.data);
        if (res.data) {
          console.log("user data", res.data);
          setlaoding(false);
        } else {
          console.log("User kaha hia");
        }
      });
  }, []);
    useEffect(()=>{
      console.log('stats useEffect fired')
axios.get('http://localhost:2929/profile/gamestats',{
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
  const hanldeusernameupdate = () => {
    setmessage("");
    console.log("edit button clicked");
    if (!newUsername.trim()) return;
    axios
      .put(
        "http://localhost:2929/profile/update-username",
        { Username: newUsername },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setuser((prev) => ({ ...prev, Username: newUsername }));
        alert(`username updated to ${res.data.Username}`);
        seteditmode(false);
      })
      .catch((err) => {
        if (err.response && err.response.status === 403) {
          setmessage(err.response.data.message);
        } else {
          alert("soemthing went wrong");
        }
      });
  };
  const handleEmailUpdate = () => {
    setmessage("");
    console.log("edit button clicked");
    if (!newEmail.trim()) return;
    axios
      .put(
        "http://localhost:2929/profile/update-email",
        { Email: newEmail },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setuser((prev) => ({ ...prev, Email: newEmail }));
        alert(`Email updated to ${res.data.Email}`);
        setmaileditmode(false);
      })
      .catch((err) => {
        if (err.response && err.response.status === 403) {
          setmessage(err.response.data.message);
        } else {
          alert("soemthing went wrong");
        }
      });
  };
  const handlePassUpdate = () => {
    setmessage("");
    console.log("edit button clicked");
    if (!newPassword.trim() || !oldPassword.trim()) {
      setmessage("Both feilds are required");
      return
    }
    axios
      .put(
        "http://localhost:2929/profile/Update-Password",
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        alert(`Password updated to succesfully`);
        setpasseditmode(false);
        setnewPassword("");
        setoldpassword("");
      })
      .catch((err) => {
        if (err.response && err.response.status === 403) {
          setmessage(err.response.data.message);
        } else {
          alert("soemthing went wrong");
        }
      });
  };
  if (loading) {
    return (
      <div className="loader_wrapper">
        <div className="loader">
          <div className="wrapper">
            <div className="circle"></div>
            <div className="line-1"></div>
            <div className="line-2"></div>
            <div className="line-3"></div>
            <div className="line-4"></div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="Profile_wrapper">
      <div className="Profile_card">
        <div className="Avatar">
          <img src={Avatar_User} alt="" srcset="" />
        </div>
        <div className="User_Info">
          <div className="User_Name">
            {editmode ? (
              <>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setnewUsername(e.target.value)}
                  placeholder="Enter new username"
                  className="username-input"
                />
                {message && <p className="error-message">{message}</p>}
                <div className="button-group">
                  <button
                    className="Update_Button"
                    onClick={hanldeusernameupdate}
                  >
                    💾 Save
                  </button>
                  <button
                    className="Cancel_Button"
                    onClick={() => seteditmode(false)}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>{user ? user.Username : "Guest"}</p>
                <button
                  className="Update_Button"
                  onClick={() => {
                    seteditmode(true);
                    setnewUsername(user?.Username || "");
                  }}
                >
                  ✏️ Edit
                </button>
              </>
            )}
          </div>
          <hr />
          <div className="User_Mail">
            {maileditmode ? (
              <>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setnewEmail(e.target.value)}
                  placeholder="Enter new Email"
                  className="username-input"
                />
                {message && <p className="error-message">{message}</p>}
                <div className="button-group">
                  <button className="Update_Button" onClick={handleEmailUpdate}>
                    💾 Save
                  </button>
                  <button
                    className="Cancel_Button"
                    onClick={() => setmaileditmode(false)}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>{user ? user.Email : "Guest"}</p>
                <button
                  className="Update_Button"
                  onClick={() => {
                    setmaileditmode(true);
                    setnewEmail(user?.Email || "");
                  }}
                >
                  ✏️ Edit
                </button>
              </>
            )}
          </div>
          <hr />
          <div className="User_Password">
            {passeditmode ? (
              <>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setoldpassword(e.target.value)}
                  placeholder="Enter current password"
                  className="username-input"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setnewPassword(e.target.value)}
                  placeholder="Enter new Password"
                  className="username-input"
                />
                {message && <p className="error-message">{message}</p>}
                <div className="button-group">
                  <button className="Update_Button" onClick={handlePassUpdate}>
                    💾 Save
                  </button>
                  <button
                    className="Cancel_Button"
                    onClick={() => setpasseditmode(false)}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>Password:******</p>
                <button
                  className="Update_Button"
                  onClick={() => {
                    setpasseditmode(true);
                    setnewPassword("");
                    setoldpassword("")
                  }}
                >
                  ✏️ Edit
                </button>
              </>
            )}
          </div>
          <hr />
          <div className="User_Stats">
            <p>🏅 Wins: {stats.Wins || 0}</p>
            <hr />
            <p>😞 Lost: {stats.lost || 0}</p>
            <hr />
            <p>🕹️ Games Played: {stats.Total_Matches || 0}</p>
            <hr />
            <p>🔥 Streak: {stats.Streak || 0}</p>
            <hr />
          </div>
          <hr />
          XP:{" "}
          <div className="XP_Bar">
            <div
              className="XP_Fill"
              style={{ width: `${user?.xpPercent || 40}%` }}
            ></div>
          </div>
          <hr />
          <div className="Badges">
            <p>🏆 Achievements:</p>
            <div className="badge-icons">
              <img
                src={Avatar_Badge}
                alt="badge"
                className="Profile_League_Avatar1"
              />
            </div>
          </div>
          <hr />
          <p>🎉 Joined: {new Date(user?.joinedAt).toLocaleDateString()}</p>
          <hr />
          <p>⭐ Rank: {user?.rank || "Silver"}</p>
          <hr />
        </div>
        <div className="Back1">
          <button
            onClick={() => navigate("/homepage")}
            className="Gamemenu-Back1"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
