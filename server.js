const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const PORT = process.env.PORT || 3001;
const app = express();

app.get("/welcome", (req, res) => {
	res.send("Welcome!!");
});

var Router = require("./routes");

app.use("/", Router);

app.listen(PORT, (err) => {
	console.log("Server is running on ",PORT);
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
