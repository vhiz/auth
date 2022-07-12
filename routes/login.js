const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/user')
require('dotenv/config')
const jwt = require('jsonwebtoken')
const bodyParser= require('body-parser')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
const Joi= require('joi')
    

const joiloginSchema= Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))

})



router.post('/login', async(req,res)=>{
    const {error} = joiloginSchema.validate(req.body, {abortEarly: false})
    if (error){
        res.send(error.details[0].message)
        
    }

    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send('email or password wrong')
    
    //password

    const validpass = await bcrypt.compare(req.body.password, user.password)
    if(!validpass) return res.status(400).send('password not correct')

    // create a token
    const token = jwt.sign({_id:user._id}, process.env.TOKEN, {expiresIn: '24h'})
    res.header('auth', token).send(token)
    console.log('loged in')
})

module.exports= router
