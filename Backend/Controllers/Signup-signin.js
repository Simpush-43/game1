const User = require('../models/singupschema');
const UserModalData = require('../models/singupschema');

// userCreation models

const CreatenewUser = async(req,res)=>{
  const body = req.body;
  console.log("Received Data",body)
  try{
    const User = new UserModalData(body);
    const newUser = await new User.save();
    res.status(201).json({message:"user is created"});
  }catch(err){
    console.log("error in creating the user",err);
  }
}

// login user 


// exporting the module 
module.exports={
  CreatenewUser,

}