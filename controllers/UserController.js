const { User } = require("../models/User");
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
				let users = [];
				rows.forEach((row) => {
					let user = {
						first_name: row[0],
						dob: row[1],
						address: row[2],
						phonenumber: row[3],
						state: row[4],
						zipcode: row[5],
						email: row[6],
						gender: row[7],
						usertype: row[8],
					};
					users.push(user);
				});
				User.insertMany(users)
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
			let users = [];
			fs.createReadStream(filepath)
				.pipe(csv.parse({ headers: true }))
				.on("error", (error) => {
					throw error.message;
				})
				.on("data", (row) => {
					let user = {
						first_name: row["firstname"],
						dob: row["dob"],
						address: row["address"],
						phonenumber: row["phonenumber"],
						state: row["state"],
						zipcode: row["zipcode"],
						email: row["email"],
						gender: row["gender"],
						usertype: row["usertype"],
					};
					users.push(user);
				})
				.on("end", () => {
					User.insertMany(users)
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
