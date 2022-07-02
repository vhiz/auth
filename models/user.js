const mongoose= require('mongoose')
const{MongoClient} = require('mongodb')
const Schema = mongoose.Schema




const userSchema = new Schema ({
    name:({
        first:{type:String, required:true},
        last:{type:String, required: true}
    }),
    email:{type: String, required:true},
    password:{type: String, required: true},
    date:{type: Date, default:Date.now()}
})

module.exports = mongoose.model('User', userSchema)