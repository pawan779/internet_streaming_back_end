const express=require('express')
const mongoose=require('mongoose')
const bodyParser=require("body-parser")
const morgan=require("morgan")
const dotenv=require('dotenv').config();
const app=express();
const cors=require('cors')

const authRoute=require('./src/routes/auth')


app.use(bodyParser.json())
app.use(morgan("tiny"))
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));



// mongodb connection
const mongoUri =process.env.MONGODB;
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify:false
});

mongoose.connection.on("connected", () => {
  console.log("Connected to mongodb");
});

mongoose.connection.on("error", (err) => {
  console.log("Unable to connect to mongodb");
});


app.use('/',authRoute)

// server connection
app.listen(process.env.PORT,()=>{
    console.log(`Connected on port ${process.env.PORT}`)
})

