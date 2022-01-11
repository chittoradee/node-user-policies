const { PolicyInfo } = require("../models/PolicyInfo");
var path = require("path");
const upload = async (req, res) => {
	try {
		if (req.file == undefined) {
			return res.status(400).send("Please upload an excel or csv file!");
		}
		let filepath = __dirname + "/../uploads/" + req.file.filename;
		const fileExt = path.extname(req.file.filename);
		if (fileExt == ".xlsx"){
			const readXlsxFile = require("read-excel-file/node");
			readXlsxFile(filepath).then((rows) => {
				// skip header
				rows.shift();
				let policies = [];
				rows.forEach((row) => {
					let policy = {
						policy_number: row[0],
						policy_start_date: row[1],
						policy_end_date: row[2],
						policy_category: row[3],
						collection_id: row[4],
						company_collection_id: row[5],
						user_id: row[6],
					};
					policies.push(policy);
				});
				PolicyInfo.insertMany(policies)
					.then(() => {
						res.status(200).send({
							message:
								"Uploaded the file successfully: " + req.file.originalname,
						});
					})
					.catch((error) => {
						res.status(500).send({
							message: "Fail to import data into database!",
							error: error.message,
						});
					});
			});
		} else {
			const fs = require("fs");
			const csv = require("fast-csv");
			let policies = [];
			fs.createReadStream(filepath)
				.pipe(csv.parse({ headers: true }))
				.on("error", (error) => {
					throw error.message;
				})
				.on("data", (row) => {
					let policy = {
						policy_number: row["policynumber"],
						policy_start_date: row["policystartdate"],
						policy_end_date: row["policyenddate"],
						policy_category: row["policycategory"],
						collection_id: row["collectionid"],
						company_collection_id: row["companycollectionid"],
						user_id: row["userid"],
					};
					policies.push(policy);
				})
				.on("end", () => {
					PolicyInfo.insertMany(policies)
						.then(() => {
							res.status(200).send({
								message:
									"Uploaded the file successfully: " + req.file.originalname,
							});
						})
						.catch((error) => {
							res.status(500).send({
								message: "Fail to import data into database!",
								error: error.message,
							});
						});
				});
		}
	} catch (error) {
		res.status(500).send({
			message: "Could not upload the file: " + req.file.originalname,
		});
	}
};

module.exports = {
	upload,
};
