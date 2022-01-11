const mongoose = require("mongoose");

const policycategorySchema = new mongoose.Schema(
	{
		category_name: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

policycategorySchema.methods.toJSON = function(){ 
	const policycategory = this;
	const policycategoryObject = policycategory.toObject();
	return policycategoryObject;
};

const PolicyCategory = mongoose.model("lob", policycategorySchema);

module.exports = { PolicyCategory };
