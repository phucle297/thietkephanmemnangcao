// @ts-check
const pipe =
	(...fns) =>
	(x) =>
		fns.reduce((v, f) => f(v), x);

const normalizeTemplate = (html) =>
	html.replace("Chuoi_HTML", "{{Search}}{{Content}}");

const replaceMany = (dict) => (html) =>
	Object.entries(dict).reduce(
		(acc, [key, value]) => acc.replace(key, value),
		html,
	);

const calcAge = (birthDate) => {
	const birth = new Date(birthDate);
	return new Date().getFullYear() - birth.getFullYear();
};

const filterEmployees =
	({ keyword, type }) =>
	(list) => {
		if (!keyword) return list;

		return list.filter(({ data }) => {
			const searchKeyword = keyword.toLowerCase().trim();
			
			// Tìm kiếm theo họ tên
			const matchName = data.Ho_ten.toLowerCase().includes(searchKeyword);
			
			// Tìm kiếm theo tuổi
			const age = calcAge(data.Ngay_sinh);
			const matchAge = age.toString() === searchKeyword;
			
			// Tìm kiếm theo đơn vị
			const matchUnit = data.Don_vi.Ten.toLowerCase().includes(searchKeyword);
			
			// Tìm kiếm theo mã số (cho dropdown Đơn vị và Chi nhánh)
			const matchMaSo = data.Don_vi.Ma_so === keyword || data.Don_vi.Chi_nhanh.Ma_so === keyword;
			
			// Trả về true nếu khớp với bất kỳ trường nào
			return matchName || matchAge || matchUnit || matchMaSo;
		});
	};

const getUniqueUnits = (employees) => {
	const units = new Map();
	employees.forEach(({ data }) => {
		const unit = data.Don_vi;
		units.set(unit.Ma_so, unit);
	});
	return Array.from(units.values()).sort((a, b) => a.Ten.localeCompare(b.Ten));
};

const getUniqueBranches = (employees) => {
	const branches = new Map();
	employees.forEach(({ data }) => {
		const branch = data.Don_vi.Chi_nhanh;
		branches.set(branch.Ma_so, branch);
	});
	return Array.from(branches.values()).sort((a, b) => a.Ten.localeCompare(b.Ten));
};

const extractUnitsAndBranches = (employees) => ({
	units: getUniqueUnits(employees),
	branches: getUniqueBranches(employees),
});

module.exports = {
	pipe,
	normalizeTemplate,
	replaceMany,
	calcAge,
	filterEmployees,
	getUniqueUnits,
	getUniqueBranches,
	extractUnitsAndBranches,
};
