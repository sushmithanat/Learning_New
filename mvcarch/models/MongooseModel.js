const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
    },
    phone:{
        type: String,
        required: true,
        unique: true
    },
    contactType:{
        type: String
    }
})

const user = mongoose.model('user', userSchema)

module.exports = user