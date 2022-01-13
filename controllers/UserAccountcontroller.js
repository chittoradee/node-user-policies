var path = require("path");
const { Worker } = require("worker_threads");
const upload = async (req, res) => {
	try {
		if (req.file == undefined) {
			return res.status(400).send("Please upload an excel or csv file!");
		}
		let filepath = __dirname + "/../uploads/" + req.file.filename;
		const fileExt = path.extname(req.file.filename);

		const worker = new Worker("./controllers/useraccountworker.js", {
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

module.exports = {
	upload
};
