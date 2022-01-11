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
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Agent'
        },
        company_collection_id:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'PolicyCarrier'
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
policyInfoSchema.virtual('policycategory',{
    ref:'lob',
    localField: '_id',
    foreignField: 'policy_category'
});
policyInfoSchema.set('toObject', { virtuals: true });
policyInfoSchema.set('toJSON', { virtuals: true });
const PolicyInfo = mongoose.model('policy_info',policyInfoSchema);

module.exports = { PolicyInfo };