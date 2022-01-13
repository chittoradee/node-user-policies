const { parentPort, workerData } = require("worker_threads");
const { User } = require("../models/User");

function saveData(filepath, fileExt) {
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
			saveRecords(users);
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
				saveRecords(users);
			});
	}
}
saveData(workerData.filepath, workerData.fileExt);

function saveRecords(users) {
	try {
		const mongoose = require("mongoose");
		mongoose
			.connect(process.env.MONGO_DB_URL, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			})
			.then(() => {
				console.log("Database connection successfull");
			})
			.catch((err) => {
				console.log("error: ", err);
			});
		User.insertMany(users)
			.then(() => {
				parentPort.postMessage({ message: "Uploaded the file successfully." });
			})
			.catch((error) => {
				parentPort.postMessage({
					message: "Fail to import data into database!",
				});
			});
	} catch (error) {
		parentPort.postMessage({ message: "Fail to import data into database!" });
	}
}
