const mongoose = require('mongoose');

const messagerecordSchema = new mongoose.Schema(
    {
        message : {
            type : String
        }
    },
    {
        timestamps : true
    }
);

messagerecordSchema.methods.toJSON = function () {
    const messagerecord = this;
    const messagerecordObject = messagerecord.toObject();
    return messagerecordObject;
}

const MessageRecord = mongoose.model('message_records',messagerecordSchema);

module.exports = { MessageRecord };