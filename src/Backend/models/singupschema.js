const mongoose = require('mongoose');

const userSignUpSchema= new mongoose.Schema({
  Username:{
    required:true,
    unique:true,
    type:String,
    trim:true,
  },
  Email:{
    required:true,
    unique:true,
    type:String,
    trim:true,
  },
  Password:{
    type:String,
    required:true,
  },
  lastUpdated :{
type:Date,
default:null,
  }
},{timestamps:true});
const userStatsSchema = new mongoose.Schema({
  Wins:{
    type:Number,
    default:0,
  },
  lost:{
    type:Number,
    default:0,
  },
  Streak:{
    type:Number,
    default:0,
  },
  Total_Matches:{
    type:Number,
    default:0,
  },
  Points:{
    type:Number,
    default:1500,
  },
   user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
})
const User = mongoose.model('UserSignUp',userSignUpSchema);
const UserStats = mongoose.model('UserStat',userStatsSchema)
//exporting the module
module.exports={
  User,
  UserStats,
};