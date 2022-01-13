const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        message : {
            type : String
        },
        day:{
            type:String
        },
        time:{
            type:String
        },
        issaved: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps : true
    }
);

messageSchema.methods.toJSON = function () {
    const message = this;
    const messageObject = message.toObject();
    return messageObject;
}

const Message = mongoose.model('message',messageSchema);

module.exports = { Message };