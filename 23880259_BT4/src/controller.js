// @ts-check
const { readEmployeeData, readHtml } = require("./file.js");
const { renderEmployees, renderPage, renderSearchForm } = require("./ui.js");
const { filterEmployees, extractUnitsAndBranches } = require("./utils.js");

const getListEmployee = (_, res) => {
	const html = readHtml();
	const employees = readEmployeeData();
	const { units, branches } = extractUnitsAndBranches(employees);

	res.send(
		renderPage({
			html,
			search: renderSearchForm({ keyword: null, units, branches }),
			content: renderEmployees(employees),
		}),
	);
};

const searchEmployee = (req, res) => {
	const { keyword, type } = req.body;
	const html = readHtml();
	const employees = readEmployeeData();
	const { units, branches } = extractUnitsAndBranches(employees);
	const filtered = filterEmployees({ keyword, type })(employees);

	res.send(
		renderPage({
			html,
			search: renderSearchForm({ keyword, units, branches }),
			content: renderEmployees(filtered),
		}),
	);
};

module.exports = { getListEmployee, searchEmployee };
