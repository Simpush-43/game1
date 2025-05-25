const jwt = require('jsonwebtoken')
const verifytoken = ( req,res,next)=>{
  const authHeader = req.headers.authorization
  if(!authHeader) return res.status(401).json({message:"No token is found"})
    const token = authHeader.split(" ")[1]
  console.log("Token received:", token);
  jwt.verify(token,process.env.ACCESS_SECRET,(err,user)=>{
    if(err) return res.status(403).send({message:"Invalid token"})
      req.user = { _id: user.id };
    next();
  })
}
module.exports = verifytoken