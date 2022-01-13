var path = require("path");
const { Worker } = require("worker_threads");
const upload = async (req, res) => {
	try {
		if (req.file == undefined) {
			return res.status(400).send("Please upload an excel or csv file!");
		}
		let filepath = __dirname + "/../uploads/" + req.file.filename;
		const fileExt = path.extname(req.file.filename);

		const worker = new Worker("./controllers/policycarrierworker.js", {
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

		/* if (fileExt == ".xlsx") {
			const readXlsxFile = require("read-excel-file/node");
			readXlsxFile(filepath).then((rows) => {
				// skip header
				rows.shift();
				let companies = [];
				rows.forEach((row) => {
					let company = {
						company_name: row[0],
					};
					companies.push(company);
				});
				PolicyCarrier.insertMany(companies)
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
			let companies = [];
			fs.createReadStream(filepath)
				.pipe(csv.parse({ headers: true }))
				.on("error", (error) => {
					throw error.message;
				})
				.on("data", (row) => {
					let company = {
						company_name: row["name"],
					};
					companies.push(company);
				})
				.on("end", () => {
					PolicyCarrier.insertMany(companies)
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
		} */
	} catch (error) {
		res.status(500).send({
			message: "Could not upload the file: " + req.file.originalname,
		});
	}
};

module.exports = {
	upload,
};
