const express=require('express')
const mongoose=require('mongoose')
const dotenv=require('dotenv').config();
const app=express();

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


// server connection
app.listen(process.env.PORT,()=>{
    console.log(`Connected on port ${process.env.PORT}`)
})

