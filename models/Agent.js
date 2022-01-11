const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema(
    {
        name : {
            type : String
        }
    },
    {
        timestamps : true
    }
);

agentSchema.methods.toJSON = function () {
    const agent = this;
    const agentObject = agent.toObject();
    return agentObject;
}

const Agent = mongoose.model('agents',agentSchema);

module.exports = { Agent };