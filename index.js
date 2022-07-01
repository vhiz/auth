const express = require('express')
const { default: helmet } = require('helmet')
const app = express()
require('dotenv/config')
const bodyParser= require('body-parser')
app.use(helmet())
const mongoose= require('mongoose')
const{MongoClient} = require('mongodb')
const Joi= require('joi')
const bcrypt= require('bcryptjs')
const jwt = require('jsonwebtoken')


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const Schema = mongoose.Schema


//mongoose connet

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, ()=>{
    console.log('welcome to mongo')
});

const joiuserSchema= Joi.object({
    name: Joi.object({
        first: Joi.string().required(),
        last: Joi.string().required(),
      }),
    email: Joi.string().email().required(),
    
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    mobileNo : Joi.number().min(11)

})

const joiloginSchema= Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))

})


const userSchema = new Schema ({
    name:({
        first:{type:String, required:true},
        last:{type:String, required: true}
    }),
    email:{type: String, required:true},
    password:{type: String, required: true},
    date:{type: Date, default:Date.now()}
})

const User = mongoose.model('User', userSchema)

app.get('/', (req, res)=>{
    res.send("welcome")
})

// CREATE NEW USER

app.post('/register', async(req, res)=>{

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

app.post('/login', async(req,res)=>{
    const {error} = joiloginSchema.validate(req.body, {abortEarly: false})
    if (error){
        res.send(error.details[0].message)
        
    }

    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send('email or password wrong')

    //password

    const validpass = await bcrypt.compare(req.body.password, user.password)
    if(!validpass) return res.status(400).send('password not correct')

    res.send ('log in sucess')
})





var Port = process.env.PORT || 8080;
app.listen(Port, ()=>{
    console.log(`THIS APP IS UP AT THIS PORT ${Port}`)
})