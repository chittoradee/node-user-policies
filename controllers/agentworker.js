const { parentPort, workerData } = require("worker_threads");
const { Agent } = require("../models/Agent");

function saveData(filepath, fileExt) {
	if (fileExt == ".xlsx") {
		const readXlsxFile = require("read-excel-file/node");
		readXlsxFile(filepath).then( (rows) => {
			// skip header
			rows.shift();
			let agents = [];
			rows.forEach((row) => {
				let agent = {   
					name: row[0],
				};
				agents.push(agent);
			});
            saveRecords(agents);
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
				saveRecords(agents);
			});
	}
}
saveData(workerData.filepath, workerData.fileExt);

function saveRecords(agents){
    try{
        const mongoose = require("mongoose");
        mongoose
            .connect(process.env.MONGO_DB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            .then(() => {
                console.log("Database connection successfull");
            })
            .catch((err) => {
                console.log("error: ", err);
            });
        Agent.insertMany(agents)
        .then(() => {
            parentPort.postMessage({ message: "Uploaded the file successfully." })
        })
        .catch((error) => {
            parentPort.postMessage({ message: "Fail to import data into database!" })
        }); 
    }catch(error){
        parentPort.postMessage({ message: "Fail to import data into database!" })
    }
}