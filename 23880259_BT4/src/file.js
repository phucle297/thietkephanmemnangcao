// @ts-check
const path = require("node:path");
const fs = require("node:fs");

const htmlFilePath = path.join(
	__dirname,
	"Du_lieu_Media/Du_lieu/HTML/Khung.html",
);
const readHtml = () => fs.readFileSync(htmlFilePath, "utf8");
const dataDir = path.join(__dirname, "Du_lieu_Media/Du_lieu/Nhan_vien");
const mediaDir = path.join(__dirname, "Du_lieu_Media/Media");

let employeeDataCache = null;

const readEmployeeData = () => {
	// Return cached data if available
	if (employeeDataCache) {
		return employeeDataCache;
	}

	// Load and cache data
	employeeDataCache = fs
		.readdirSync(dataDir)
		.filter((file) => file.endsWith(".json"))
		.map((file) => {
			const id = path.parse(file).name;
			const jsonPath = path.join(dataDir, file);
			const pngPath = path.join(mediaDir, `${id}.png`);
			return {
				id,
				data: JSON.parse(fs.readFileSync(jsonPath, "utf8")),
				image: fs.existsSync(pngPath) ? pngPath : null,
			};
		});

	return employeeDataCache;
};
module.exports = { readHtml, readEmployeeData };
