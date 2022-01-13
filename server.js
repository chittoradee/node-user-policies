const express = require("express");
const mongoose = require("mongoose");
var os = require("os-utils");
const bodyParser = require("body-parser");
require("dotenv").config();
const { Message } = require("./models/Message");
const { MessageRecord } = require("./models/MessageRecord");
const PORT = process.env.PORT || 3001;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/welcome", (req, res) => {
	res.send("Welcome!!");
});

var Router = require("./routes");

app.use("/", Router);

setInterval(() => {
	os.cpuUsage(async function (v) {
		if (v >= 70) {
			try {
				server.close();
			} catch (e) {
				console.log("Cant't stop webserver:", "error");
				console.log(e, "error");
			}
			if(app.killed === undefined){
				app.killed = true;
				var exec = require("child_process").exec;
				exec(`node .\server.js`,{maxBuffer:1024*1024}, function () {
					console.log("appLICATION RESTARTED", "success");
				});
			}
		}
	});
}, 10000);
const cron = require("node-cron");

cron.schedule("* * * * *", async () => {
	const result = await Message.find({ issaved: false }).lean();
	const weekday = [
		"sunday",
		"monday",
		"tuesday",
		"wednesday",
		"thursday",
		"friday",
		"saturday",
	];
	const d = new Date();
	let day = weekday[d.getDay()];
	var hours = d.getHours();
	var minutes = d.getMinutes();
	minutes = minutes < 10 ? "0" + minutes : minutes;
	const time = hours + ":" + minutes;

	result.forEach(async (element) => {
		if (element.day === day && element.time == time) {
			//save data into db
			const result = await Message.findById(element._id);
			result.issaved = true;
			result.save();
			var data = new MessageRecord({ message: element.message });
			data.save();
		}
	});
});

var server = app.listen(PORT, (err) => {
	console.log("Server is running on ", PORT);
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

	mongoose.connection.on("connected", () => {
		open = true;
		console.log("Database is Connected.");
	});

	mongoose.connection.on("error", (err) => {
		console.log("Coudln't connect to database. Error: ", err);
	});

	mongoose.connection.on("disconnected", () => {
		open = false;
		console.log("Database has been disconnected.");
	});
});
