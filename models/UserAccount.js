const mongoose = require("mongoose");

const useraccountSchema = new mongoose.Schema(
	{
		account_name: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

useraccountSchema.methods.toJSON = function(){ 
	const useraccount = this;
	const useraccountObject = useraccount.toObject();
	return useraccountObject;
};

const UserAccount = mongoose.model("user_accounts", useraccountSchema);

module.exports = { UserAccount };
