const express = require('express')  //taking express server
const app =express()                 //take it has object
const PORT = process.env.PORT || 5000 
const mongoose = require('mongoose')           
const {MONGOURI} = require('./config/keys')

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


if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))   //client request we will index.html where everything is present
    })
}



app.listen(PORT,()=>{
    console.log("server is running on" ,PORT)
})