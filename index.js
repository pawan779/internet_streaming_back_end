const express=require('express')
const dotenv=require('dotenv').config();

const app=express();

app.listen(process.env.PORT,()=>{
    console.log(`Connected on port ${process.env.PORT}`)
})