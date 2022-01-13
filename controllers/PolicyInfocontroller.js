const { PolicyInfo } = require("../models/PolicyInfo");
const { User } = require("../models/User");
var path = require("path");
const { PolicyCategory } = require("../models/PolicyCategory");
const { Agent } = require("../models/Agent");
const { PolicyCarrier } = require("../models/PolicyCarrier");
const { Worker } = require("worker_threads");
const upload = async (req, res) => {
	try {
		if (req.file == undefined) {
			return res.status(400).send("Please upload an excel or csv file!");
		}
		let filepath = __dirname + "/../uploads/" + req.file.filename;
		const fileExt = path.extname(req.file.filename);
		const worker = new Worker("./controllers/policyinfoworker.js", {
			workerData: { filepath: filepath, fileExt: fileExt },
		});

		worker.once("message", (result) => {
			res.status(200).send({
				message: result.message,
			});
		});

		worker.on("error", (error) => {
			res.status(500).send({
				message: "Fail to import data into database!",
				error: error.message,
			});
		});

		worker.on("exit", (exitCode) => {
			res.status(200).send({
				message: "Uploaded the file successfully: " + req.file.originalname,
			});
		});
	} catch (error) {
		res.status(500).send({
			message: "Could not upload the file: " + req.file.originalname,
		});
	}
};

const searchInfo = async (req, res) => {
	const name = req.query.username || "";
	const result = await PolicyInfo.aggregate([
		{
			$lookup: {
				from: User.collection.name,
				localField: "user_id",
				foreignField: "_id",
				as: "user",
			},
		},
		{
			$lookup: {
				from: PolicyCategory.collection.name,
				localField: "policy_category",
				foreignField: "_id",
				as: "policycategory",
			},
		},
		{
			$lookup: {
				from: Agent.collection.name,
				localField: "collection_id",
				foreignField: "_id",
				as: "agent",
			},
		},
		{
			$lookup: {
				from: PolicyCarrier.collection.name,
				localField: "company_collection_id",
				foreignField: "_id",
				as: "policycarrier",
			},
		},
		{ $unwind: "$user" },
		{ $unwind: "$policycategory" },
		{ $unwind: "$agent" },
		{ $unwind: "$policycarrier" },
		{
			$match: { "user.first_name": name },
		},
		{
			$project: {
				first_name: "$user.first_name",
				category_name: "$policycategory.category_name",
				agent_name: "$agent.name",
				company_name: "$policycarrier.company_name",
				policy_number: 1,
				policy_start_date: 1,
				policy_end_date: 1,
			},
		},
	]);

	res.status(200).send(result);
};

const getPolicyInfoByUser = async (req, res) => {
	const users = await User.find({}).populate({
		path: "policyinfo",
		model: PolicyInfo,
		populate: [
		  {
			path: "policy_category",
			model: PolicyCategory,
			select:['category_name']
		  },{
			path: "collection_id",
			model: Agent,
			select:['name']
		  },
		  {
			path: "company_collection_id",
			model: PolicyCarrier,
			select:['company_name']
		  }
		]
	  });
	res.status(200).send(users);
};

module.exports = {
	upload,
	searchInfo,
	getPolicyInfoByUser,
};
