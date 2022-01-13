const { parentPort, workerData } = require("worker_threads");
const { PolicyInfo } = require("../models/PolicyInfo");

function saveData(filepath, fileExt) {
	if (fileExt == ".xlsx") {
		const readXlsxFile = require("read-excel-file/node");
		readXlsxFile(filepath).then( (rows) => {
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
            saveRecords(policies);
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
				saveRecords(policies);
			});
	}
}
saveData(workerData.filepath, workerData.fileExt);

function saveRecords(policies){
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
		PolicyInfo.insertMany(policies)
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