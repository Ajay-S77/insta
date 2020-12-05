const express = require('express')  //taking express server
const app =express()                 //take it has object
const PORT = 5000 
const mongoose = require('mongoose')           
const {MONGOURI} = require('./keys')

mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true

})

mongoose.connection.on('connected',()=>{
    console.log("connected to mongo")
})

mongoose.connection.on('error',(err)=>{
    console.log("mongo error",err)
})


require('./models/user')   // user.js user schema
require('./models/post')


app.use(express.json())     //something like middleware to get name ,email and password   //postman

app.use(require('./routes/auth'))   //auth.js  routes
app.use(require('./routes/post'))
app.use(require('./routes/user'))





app.listen(PORT,()=>{
    console.log("server is running on" ,PORT)
})