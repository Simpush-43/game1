import React,{useState} from 'react'
import axios from 'axios'
import { useNavigate} from 'react-router-dom'
const Sign_Up = () => {
  const [formData,setformData] = useState({
    Username:'',
    Email:'',
    Password:'',
    Confirm_Password:'',
  })
const [error, setError] = useState('');
  const navigate = useNavigate();
  // handling the changes 
  const handleFormChanges = (e)=>{
 const {name,value} = e.target
 // setting the form data
 setformData({...formData,[name]:value})
  }
  const saveformData = async(e)=>{
    e.preventDefault();
      setError('');
    // basic validation that all fields are filled 
    if(!formData.Username || !formData.Email || !formData.Password){
      alert('all fields are required')
      return;
    }
    if( formData.Password !== formData.Confirm_Password){
      alert('password should match')
      return;
    }

    // saving the form data 
    try{
      const response = await axios.post('http://localhost:2929/signup',formData)
      alert('Sign-Up succesful');
      console.log('User details',response.data)
      localStorage.setItem('token',response.data.token);
    }catch(err){
console.log('Error in sign up',err.response?.data || err.message)
 setError(err.response?.data?.message || 'Signup failed. Please try again.');
alert('Error in signup,please try again later')
    }
  }

  const loggingUser = async(e)=>{
    e.preventDefault();
    if(!formData.Username || !formData.Password){
      alert('all fields are required')
      return;
    }
// logging the user in
try{
const response = await axios.post(`http://localhost:2929/login`,formData);
alert('login succesful')
console.log('User details',response.data);
localStorage.setItem('token',response.data.token);
//navigating user to game menu
navigate('/GameMenu')
}catch(error){
  console.log("error in logging in",error.response?.data || error.message)
  alert('Error in logging in,Please try again')
  setError(error.response?.data?.message || 'Login failed. Please try again.');
}
  } 
  return (
    <>
    <div className="signupbox">

        <div className="wrapper">
      <div className="card-switch">
        <label className="switch">
          <input type="checkbox" className="toggle" />
          <span className="slider"></span>
          <span className="card-side"></span>
          <div className="flip-card__inner">
            {/* Login Form */}
            <div className="flip-card__front">
              <div className="title">Log in</div>
              <form className="flip-card__form" method="POST" onSubmit={loggingUser}>
                <input
                  className="flip-card__input"
                  type="text"
                  name="Username"
                  placeholder="Username"
                  value={formData.Username}
                  onChange={handleFormChanges}
                  required
                />
                <input
                  className="flip-card__input"
                  type="password"
                  name="Password"
                  placeholder="Password"
                  value={formData.Password}
                  onChange={handleFormChanges}
                  required
                />
                    {error && <p className="error-message">{error}</p>}
                <button className="flip-card__btn" type="submit">Let’s go!</button>
              </form>
              <p className='Sign-up_flip'>flip it For Sign Up 🚀 </p>
            </div>

            {/* Sign-Up Form */}
            <div className="flip-card__back">
              <div className="title">Sign up</div>
              <form className="flip-card__form" method="POST" onSubmit={saveformData}>
                <input
                  className="flip-card__input"
                  type="text"
                  name="Username"
                  placeholder="Username"
                  value={formData.Username}
                  onChange={handleFormChanges}
                  required
                />
                <input
                  className="flip-card__input"
                  type="email"
                  name="Email"
                  placeholder="Email"
                  value={formData.Email}
                  onChange={handleFormChanges}
                  required
                />
                <input
                  className="flip-card__input"
                  type="password"
                  name="Password"
                  placeholder="Password"
                  value={formData.Password}
                  onChange={handleFormChanges}
                  required
                />
                <input
                  className="flip-card__input"
                  type="password"
                  name="Confirm_Password"
                  placeholder="Confirm Password"
                  value={formData.Confirm_Password}
                  onChange={handleFormChanges}
                  required
                />
                    {error && <p className="error-message">{error}</p>}
                <button className="flip-card__btn" type="submit">Confirm!</button>
              </form>
              <p className='Sign-in_flip'>flip it For Login 🚀 </p>
            </div>
          </div>
        </label>
      </div>
    </div>
    </div>
    </>
  )
}

export default Sign_Up
