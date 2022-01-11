const mongoose = require("mongoose");

const policycarrierSchema = new mongoose.Schema(
	{
		company_name: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

policycarrierSchema.methods.toJSON = function(){
	const policycarrier = this;
	const policycarrierObject = policycarrier.toObject();
	return policycarrierObject;
};

const PolicyCarrier = mongoose.model("carriers", policycarrierSchema);

module.exports = { PolicyCarrier };
