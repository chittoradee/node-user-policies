const { parentPort, workerData } = require("worker_threads");
const { PolicyCategory } = require("../models/PolicyCategory");

function saveData(filepath, fileExt) {
	if (fileExt == ".xlsx") {
		const readXlsxFile = require("read-excel-file/node");
		readXlsxFile(filepath).then( (rows) => {
			// skip header
			rows.shift();
			let categories = [];
			rows.forEach((row) => {
				let category = {
					category_name: row[0],
				};
				categories.push(category);
			});
            saveRecords(categories);
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
				saveRecords(categories);
			});
	}
}
saveData(workerData.filepath, workerData.fileExt);

function saveRecords(categories){
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
		PolicyCategory.insertMany(categories)
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