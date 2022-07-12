const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/user')
require('dotenv/config')
const jwt = require('jsonwebtoken')
const bodyParser= require('body-parser')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
const Joi= require('joi')

const joiuserSchema= Joi.object({
    name: Joi.object({
        first: Joi.string().required(),
        last: Joi.string().required(),
      }),
    email: Joi.string().email().required(),
    
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    repeat: Joi.string().valid(Joi.ref('password')),

    mobileNo : Joi.number().min(11)

})





router.post('/register', async(req, res)=>{

    //VALIDATION
    const {error} = joiuserSchema.validate(req.body,{abortEarly: false})

    if(error){
        console.log('error')
        return res.send(error.details[0].message)
    }

    //CHECK OI USER EXIST
    const userExist = await User.findOne({email: req.body.email})
    if(userExist) return res.status(400).send('User already exist')

    // hash the password
    const salt= await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password ,salt)


    const newUser = new User({
        name: req.body.name,
        password: hashedPassword,
        email: req.body.email
    })
    try{
        const savedUser = await newUser.save()
        console.log('saved')
        res.send(newUser)
    }catch(err){
        res.status(400).send(err)
        console.log('error not saved')
    }
})




module.exports = router