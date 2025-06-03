const express = require('express');
const { handleConnectToMongoose } = require('./Connect');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const SignupRoute = require('./Routes/UserRoutes');
const SocketIoServer = require('./SocketIoServer');
// web socket server 

dotenv.config({path:'keys.env'});
console.log("Access key:",process.env.ACCESS_SECRET)

// creating port
const app = express();
 const PORT = process.env.APP_PORT;
 //setting up ws server

 const allowedOrigins = [
  "http://localhost:5173",
  "https://game1-r4h2.onrender.com",
  "https://game1-ad2f.onrender.com"
];

// Dynamic origin checker
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

//middlewares
  app.use(cors(corsOptions))
  app.options('*', cors(corsOptions)); 
  app.use(cookieParser())
  app.use(express.json())
app.use(SignupRoute);

// connection to mongodatabse
handleConnectToMongoose('mongodb://localhost:27017/Tictak').then(()=>{
  console.log('connected to database')
}).catch((err)=>{
  console.log('error in connecting to database')
})
// handling request 
app.get('/cors-test', (req, res) => {
  res.json({ message: 'CORS is working', origin: req.headers.origin });
});

app.get('/',(req,res)=>{
  res.json({message:"helloo bhayyy"})
})
app.get('/server',(req,res)=>{
  res.send("hiii from server")
})
app.put('/test-put', (req, res) => {
  res.json({ message: "PUT works!" });
});
const server= SocketIoServer(app)
// listening to the port
server.listen(PORT,(err)=>{
 if(err){
   console.log('Error',err)
 }else{
   console.log(`Server is running on ${PORT}`)
 }
});
