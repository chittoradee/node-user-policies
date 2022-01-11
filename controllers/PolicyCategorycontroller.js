const { PolicyCategory } = require("../models/PolicyCategory");
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
				let categories = [];
				rows.forEach((row) => {
					let category = {
						category_name: row[0],
					};
					categories.push(category);
				});
				PolicyCategory.insertMany(categories)
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
			let categories = [];
			fs.createReadStream(filepath)
				.pipe(csv.parse({ headers: true }))
				.on("error", (error) => {
					throw error.message;
				})
				.on("data", (row) => {
					let category = {
						category_name: row["name"],
					};
					categories.push(category);
				})
				.on("end", () => {
					PolicyCategory.insertMany(categories)
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
