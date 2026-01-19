// @ts-check
const { normalizeTemplate, pipe, replaceMany } = require("./utils.js");

const renderSearchForm = (
	{ keyword, units, branches } = {
		keyword: null,
		units: [],
		branches: [],
	},
) => {
	return `
<form method="POST" action="/search" class="mb-4" id="searchForm">
  <div class="form-row">
    <div class="col-md-4 col-4 position-relative">
      <input
        name="keyword"
        class="form-control pr-5"
        placeholder="Tìm kiếm..."
        value="${keyword || ""}"
      />
      <button 
        type="submit" 
        class="btn btn-primary position-absolute" 
        style="right: 5px; top: 50%; transform: translateY(-50%); height: 100%; padding: 0 8px; font-size: 12px;">
        Search
      </button>
    </div>

    <div class="col-md-4 col-4">
      <select class="form-control" name="don_vi" onchange="this.form.keyword.value=this.value; this.form.submit();">
        <option value="">-- Chọn Đơn vị --</option>
        ${units.map((unit) => `<option value="${unit.Ma_so}" ${keyword === unit.Ma_so ? "selected" : ""}>${unit.Ten}</option>`).join("")}
      </select>
    </div>

    <div class="col-md-4 col-4">
      <select class="form-control" name="chi_nhanh" onchange="this.form.keyword.value=this.value; this.form.submit();">
        <option value="">-- Chọn Chi nhánh --</option>
        ${branches.map((branch) => `<option value="${branch.Ma_so}" ${keyword === branch.Ma_so ? "selected" : ""}>${branch.Ten}</option>`).join("")}
      </select>
    </div>
  </div>
</form>
`;
};

const renderEmployeeFunctions = (_) => `
<form method="GET" action="/" class="m-2">
  <div class="form-row">
    <div class="col-6">
      <button class="btn btn-primary btn-block" type = "submit">Function 1</button>
    </div>
    <div class="col-6">
      <button class="btn btn-primary btn-block" type = "submit">Function 2</button>
    </div>
  </div>
</form>
`;

const renderEmployees = (list) =>
	list
		.map(
			(item) => `
        <div class="col-12 col-md-3 mb-4">
          <div class="card h-100 shadow-sm">

            <img
              src="${
								item.image
									? `/Media/${item.id}.png`
									: "https://via.placeholder.com/300x200"
							}"
              class="card-img-top"
              alt="${item.data.Ho_ten}"
            />

            <div class="card-body d-flex flex-column">

              <div class="mb-2">
                <h6 class="mb-1">${item.data.Ho_ten}</h6>
                <small class="text-muted">${item.data.Ma_so}</small>
              </div>

              <div class="small mb-2">
                <div><b>Giới tính:</b> ${item.data.Gioi_tinh}</div>
                <div><b>Ngày sinh:</b> ${item.data.Ngay_sinh}</div>
                <div><b>Lương:</b> ${item.data.Muc_luong.toLocaleString()} ₫</div>
              </div>

              <div class="small mb-2">
                <div><b>Đơn vị:</b> ${item.data.Don_vi.Ten}</div>
                <div><b>Chi nhánh:</b> ${item.data.Don_vi.Chi_nhanh.Ten}</div>
              </div>

              <div class="mt-auto">
                <div class="small mb-1"><b>Ngoại ngữ:</b></div>
                <div>
                  ${item.data.Danh_sach_Ngoai_ngu.map(
										(nn) =>
											`<span class="badge badge-secondary mr-1">${nn.Ten}</span>`,
									).join("")}
                </div>
              </div>
            </div>
            ${renderEmployeeFunctions(item)}
          </div>
        </div>
      `,
		)
		.join("");

const renderPage = ({ html, search, content }) =>
	pipe(
		normalizeTemplate,
		replaceMany({
			"{{Search}}": search,
			"{{Content}}": `
          <div class="container mt-4">
            <div class="row">
              ${content}
            </div>
          </div>
        `,
		}),
	)(html);

module.exports = { renderSearchForm, renderEmployees, renderPage };
