const mongoose = require('mongoose');
// handle connect to mongoose 

const handleConnectToMongoose = async(url)=>{
  try{
    const con = await mongoose.connect(url,{
    })
  }catch(err){
    console.log('error in connecting to mongoose',err)
  }
} 
module.exports={
handleConnectToMongoose,
}