const { Agent } = require("../models/Agent");
var path = require("path");
const upload = async (req, res) => {
	try {
		if (req.file == undefined) {
			return res.status(400).send("Please upload an excel or csv file!");
		}
		let filepath = __dirname + "/../uploads/" + req.file.filename;
		const fileExt = path.extname(req.file.filename);
		if (fileExt == ".xlsx") {
			const readXlsxFile = require("read-excel-file/node");
			readXlsxFile(filepath).then((rows) => {
				// skip header
				rows.shift();
				let agents = [];
				rows.forEach((row) => {
					let agent = {
						name: row[0],
					};

					agents.push(agent);
				});
				Agent.insertMany(agents)
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
			let agents = [];
			fs.createReadStream(filepath)
				.pipe(csv.parse({ headers: true }))
				.on("error", (error) => {
					throw error.message;
				})
				.on("data", (row) => {
					let agent = {
						name: row["Agent Name"],
					};
					agents.push(agent);
				})
				.on("end", () => {
					Agent.insertMany(agents)
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
		console.log(error);
		res.status(500).send({
			message: "Could not upload the file: " + req.file.originalname,
		});
	}
};

module.exports = {
	upload,
};
