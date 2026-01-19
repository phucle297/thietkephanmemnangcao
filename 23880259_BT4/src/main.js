// @ts-check
const express = require("express");
const path = require("node:path");
const { getListEmployee, searchEmployee } = require("./controller.js");

const initApp = () => {
	const app = express();
	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());
	app.use(
		"/Media",
		express.static(path.join(__dirname, "Du_lieu_Media/Media")),
	);
	app.listen(3000);
	console.log("Server is running on http://localhost:3000");

	return app;
};
const app = initApp();

app.get("/", getListEmployee);
app.post("/search", searchEmployee);
