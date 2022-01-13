var path = require("path");
const { Message } = require("../models/Message");

const saveData = async (req, res) => {
	try {
		var data = new Message(req.body);
		data.save();
		res.status(200).send({
			message: "Data saved successfully.",
		});
	} catch (error) {
		res.status(500).send({
			message: error.message,
		});
	}
};

module.exports = {
	saveData,
};
