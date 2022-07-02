const express = require('express')
const { default: helmet } = require('helmet')
const app = express()
require('dotenv/config')
const bodyParser= require('body-parser')
app.use(helmet())
const mongoose= require('mongoose')
const{MongoClient} = require('mongodb')

const authRoute = require('./routes/auth')
const loginRoute = require('./routes/login')
const exampleRoute = require('./example')


app.use('/', authRoute)
app.use('/', loginRoute )
app.use('/', exampleRoute)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())




//mongoose connet

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, ()=>{
    console.log('welcome to mongo')
});








app.get('/', (req, res)=>{
    res.send("welcome")
    console.log('welcome to home page')
})

// CREATE NEW USER









var Port = process.env.PORT || 8080;
app.listen(Port, ()=>{
    console.log(`THIS APP IS UP AT THIS PORT ${Port}`)
})