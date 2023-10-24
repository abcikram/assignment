const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true  
    },
    roles: {
        type: String,
        enum: ['Admin', 'User'],
        default: 'User'
    },
    token: {
        type: String,
        unique : true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, {
    timestamps : true
})

module.exports = mongoose.model('user',userSchema)