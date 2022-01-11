const mongoose = require('mongoose');

const policyInfoSchema = new mongoose.Schema(
    {
        policy_number : {
            type : String
        },
        policy_start_date : {
            type : String
        },
        policy_end_date:{
            type : String
        },
        policy_category:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'PolicyCategory'
        },
        collection_id:{
            type : String
        },
        company_collection_id:{
            type : String
        },
        user_id:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        }
    },
    {
        timestamps : true
    }
);

policyInfoSchema.methods.toJSON = function () {
    const policyinfo = this;
    const policyinfoObject = policyinfo.toObject();
    return policyinfoObject;
}

const PolicyInfo = mongoose.model('policy_info',policyInfoSchema);

module.exports = { PolicyInfo };