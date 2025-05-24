const Express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = Express.Router();
const {User, UserStats} = require("../models/singupschema");
const cookieParser = require('cookie-parser');
const verifytoken = require('../middlewares/verifytoken')
// signUP route
router.post("/signup", async (req, res) => {
  try {
    const { Username, Email, Password, Confirm_Password } = req.body;
    if(!Username || !Email || !Password || !Confirm_Password){
      return res.status(400).json({message:"All fields are required"})
    }
    if (Password !== Confirm_Password)
      return res.status(400).json({ message: "Password do not match" });
    // check if user exist
    const Existing_User = await User.findOne({
      $or: [{ Username }, { Email }],
    });
    if (Existing_User)
      return res.status(400).json({ message: "Account already exist!" });
    //password hash
    const hashPassword = await bcrypt.hash(Password, 12);
    const New_User = new User({ Username, Email, Password: hashPassword });
    // saving the user
    await New_User.save();
     await UserStats.create({
      user: New_User._id, 
      Wins: 0,
      lost: 0,
      Streak: 0,
      totalMatches: 0,
    });
        const jwtToken = jwt.sign({ id: New_User._id }, process.env.ACCESS_SECRET, {
      expiresIn: "30d",
    });
        res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ message: "User created succesfully" ,token: jwtToken});
  } catch (error) {
    if (error) {
      res.status(500).json({ message: "Error form the server" });
      console.log("error is:", error);
    }
  }
});
router.post("/login", async (req, res) => {
  const body = req.body;
  try {
    const { Username, Password } = body;
    // finding user
    const user = await User.findOne({ Username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    // matching the passowrd:
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Password" });
    // jwt token
    const jwtToken = jwt.sign({ id: user._id }, process.env.ACCESS_SECRET, {
      expiresIn: "30d",
    });
        res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: false, // true if using HTTPS
      sameSite: "Lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.json({ message: "Logged in succesful", token: jwtToken });
  } catch (error) {
    console.log("Error in logging in:", error);
  }
});
router.post('/logout',async (req,res)=>{
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
})
router.get('/profile',async(req,res)=>{
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send({ message: "Unauthorized" });
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      const user = await User.findById(decoded.id).select('-Password'); // Don't send password
      res.json(user);
  } catch (err) {
      res.status(401).json({ message: "Invalid Token" });
  }
})
// for updating function
router.put('/profile/update-username',verifytoken,async(req,res)=>{
const {Username} = req.body;
if(!Username) return res.status(400).json({message:"Username required"})
  try{
const user = await User.findById(
  req.user._id,
)
const now = new Date();
const lastUpdated = user.lastUpdated || new Date(0);
const diffDate = Math.floor((now-lastUpdated)/(1000*60*60*24))
if(diffDate <15){
  return res.status(403).json({message:` You can change username in ${15-diffDate} days`})  
}
user.Username = Username;
user.lastUpdated = now;
await user.save();
res.json({message:"Username Updated", Username:user.Username})
  }catch(err){
    res.status(500).json({message:"Error updating Username",err})
  }
})

router.put('/profile/update-email',verifytoken,async(req,res)=>{
const {Email} = req.body;
if(!Email) return res.status(400).json({message:"Email required"})
  try{
const user = await User.findById(
  req.user._id,
)
const now = new Date();
const lastUpdated = user.lastUpdated || new Date(0);
const diffDate = Math.floor((now-lastUpdated)/(1000*60*60*24))
if(diffDate <30){
  return res.status(403).json({message:` You can change Email in ${30-diffDate} days`})  
}
user.Email =Email;
user.lastUpdated = now;
await user.save();
res.json({message:"Email Updated", Username:user.Email})
  }catch(err){
    res.status(500).json({message:"Error updating Username",err})
  }
})

router.put('/profile/Update-Password',verifytoken,async(req,res)=>{
  try{
  const {oldPassword,newPassword} = req.body
  if(!oldPassword || !newPassword) return res.status(403).send({message:"All Fields are required"})
  const user = await User.findById(req.user._id);
  const match = await bcrypt.compare(oldPassword,user.Password);
  if(!match) return res.status(400).send({message:"Incorrect current Password"})
    const hashed = await bcrypt.hash(newPassword,10)
  user.Password = hashed;
  await user.save();
  res.json("Password updated")
    }catch(error){
      console.log("error:",error);
res.status(500).json({message:"Error updating Password",error})
    }
})
// game stats updates
router.put('/profile/Update-gamestats',verifytoken,async(req,res)=>{
  try{
const {result} = req.body;
const userStats = await UserStats.findOne({user:req.user._id});
if(!userStats)return res.status(404).json({message:"Stats not found for user"})
if(result==='win'){
userStats.Wins +=1;
userStats.Streak +=1;
userStats.Total_Matches += 1;
userStats.Points +=50;
}else if(result ==='loss'){
userStats.lost += 1;
userStats.Streak =0;
userStats.Total_Matches += 1;
userStats.Points -= 50;
}
await userStats.save();
 res.json({ message: "Game stats updated", stats: userStats });
  }catch(err){
    console.log("error",err)
    res.status(500).json({message:"Error game stats",err})
  }
})
// get updated game stats
router.get('/profile/gamestats',verifytoken,async(req,res)=>{
  try {
    const userStats = await UserStats.findOne({user:req.user._id});
    if(!userStats) return res.status(404).json({message:"No user  stats found"})
    res.status(200).json({ message: "User stats found successfully", stats: userStats });
    console.log(userStats);
  } catch (err) {
     console.error("Error fetching stats", err);
    res.status(500).json({ message: "Server error" });
  }
})
module.exports = router;
