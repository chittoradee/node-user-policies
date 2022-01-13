const { parentPort, workerData } = require("worker_threads");
const { UserAccount } = require("../models/UserAccount");

function saveData(filepath, fileExt) {
	if (fileExt == ".xlsx") {
		const readXlsxFile = require("read-excel-file/node");
		readXlsxFile(filepath).then( (rows) => {
			// skip header
			rows.shift();
			let useraccounts = [];
			rows.forEach((row) => {
				let useraccount = {
					account_name: row[0],
				};
				useraccounts.push(useraccount);
			});
            saveRecords(useraccounts);
		});
	} else {
		const fs = require("fs");
		const csv = require("fast-csv");
		let useraccounts = [];
		fs.createReadStream(filepath)
			.pipe(csv.parse({ headers: true }))
			.on("error", (error) => {
				throw error.message;
			})
			.on("data", (row) => {
				let useraccount = {
					account_name: row["name"],
				};
				useraccounts.push(useraccount);
			})
			.on("end", () => {
				saveRecords(useraccounts);
			});
	}
}
saveData(workerData.filepath, workerData.fileExt);

function saveRecords(useraccounts){
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
		UserAccount.insertMany(useraccounts)
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