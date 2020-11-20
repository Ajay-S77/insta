const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")    //for modal schema
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET}=require('../config/keys')

const requireLogin = require('../middleware/requireLogin')


//signup route
router.post('/signup',(req,res)=>{
    const {name,email,password,pic} = req.body 

    if(!email || !password || !name)
    {
       return res.status(422).json({error:"please add all the fields"})
    }

    User.findOne({email:email})   //comparing email with databaseemail
    .then((savedUser)=>{
        if(savedUser){
          return res.status(422).json({error:"user already exists with that email"})
        }
        bcrypt.hash(password,12) //default 10
        .then(hashedpassword=>{

            const user = new User({    //else save it in database
                email,
                password:hashedpassword,
                name,
                pic:pic
            })
    
            user.save()    //finally save user
    
            .then(user=>{
                res.json({message:"saved successfully"})
            })
    
            .catch(err=>{
    
                    console.log(err)
                })
     })
    
    })
    .catch(err=>{
        console.log(err)
    })
})


//signin routes
router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password)
    {
        return res.status(422).json({error:"please provide email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
           return res.status(422).json({error:"Invalid email"})
        }

        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                //return res.json({message:"successfully signed in"})
                const token =jwt.sign({_id:savedUser._id},JWT_SECRET)   //creatimg token
                const {_id,name,email,followers,following,pic} = savedUser
                res.json({token,user:{_id,name,email,followers,following,pic}})
       
            }
            else{
                return res.status(422).json({error:"invalid email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })

    })

})

module.exports = router