const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        first_name : {
            type : String
        },
        dob : {
            type : String
        },
        address:{
            type : String
        },
        phone_number:{
            type : String
        },
        state:{
            type : String
        },
        zipcode:{
            type : String
        },
        email:{
            type : String
        },
        gender:{
            type : String
        },
        usertype:{
            type : String
        }
    },
    {
        timestamps : true
    }
);

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    return userObject;
}

const User = mongoose.model('users',userSchema);

module.exports = { User };