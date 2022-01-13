const { parentPort, workerData } = require("worker_threads");
const { PolicyCarrier } = require("../models/PolicyCarrier");

function saveData(filepath, fileExt) {
	if (fileExt == ".xlsx") {
		const readXlsxFile = require("read-excel-file/node");
		readXlsxFile(filepath).then( (rows) => {
			// skip header
			rows.shift();
			let companies = [];
            rows.forEach((row) => {
                let company = {
                    company_name: row[0],
                };
                companies.push(company);
            });
            saveRecords(companies);
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
				saveRecords(companies);
			});
	}
}
saveData(workerData.filepath, workerData.fileExt);

function saveRecords(companies){
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
        PolicyCarrier.insertMany(companies)
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