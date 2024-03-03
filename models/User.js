const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email : {
        type : String,
        required : true,
        lowercase : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model('user', userSchema);