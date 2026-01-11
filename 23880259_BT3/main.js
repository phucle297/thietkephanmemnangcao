const express = require("express");
const fs = require("fs");
const path = require("path");

// Util functions
const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => f(v), x);
// const Do = () => ({});
//
// const bind = (key, fn) => (ctx) => ({
//   ...ctx,
//   [key]: fn(ctx),
// });
//
// const map = (fn) => (ctx) => fn(ctx);
// const tap = (fn) => (ctx) => {
//   fn(ctx);
//   return ctx;
// };

// -------------------------------------------------

const htmlFilePath = path.join(
  __dirname,
  "Du_lieu_Media/Du_lieu/HTML/Khung.html",
);
const readHtml = () => fs.readFileSync(htmlFilePath, "utf8");
const normalizeTemplate = (html) =>
  html.replace("Chuoi_HTML", "{{Search}}{{Content}}");
const renderSearchForm = () => `
<form method="POST" action="/search" class="mb-4">
  <div class="form-row">
    <div class="col">
      <input
        name="keyword"
        class="form-control"
        placeholder="Từ khóa tìm kiếm"
      />
    </div>

    <div class="col">
      <select name="type" class="form-control">
        <option value="name">Họ tên</option>
        <option value="age">Tuổi</option>
        <option value="unit">Đơn vị</option>
      </select>
    </div>

    <div class="col">
      <button class="btn btn-primary">Tìm</button>
    </div>
  </div>
</form>
`;

const replaceMany = (dict) => (html) =>
  Object.entries(dict).reduce(
    (acc, [key, value]) => acc.replace(key, value),
    html,
  );

const dataDir = path.join(__dirname, "Du_lieu_Media/Du_lieu/Nhan_vien");
const mediaDir = path.join(__dirname, "Du_lieu_Media/Media");
const jsonFiles = fs.readdirSync(dataDir);

const readEmployeeData = () =>
  fs
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

const calcAge = (birthDate) => {
  const birth = new Date(birthDate);
  return new Date().getFullYear() - birth.getFullYear();
};

const filterEmployees =
  ({ keyword, type }) =>
  (list) => {
    if (!keyword) return list;

    return list.filter(({ data }) => {
      switch (type) {
        case "name":
          return data.Ho_ten.toLowerCase().includes(keyword.toLowerCase());

        case "age":
          return calcAge(data.Ngay_sinh) === Number(keyword);

        case "unit":
          return data.Don_vi.Ten.toLowerCase().includes(keyword.toLowerCase());

        default:
          return true;
      }
    });
  };

const expressGet = (html) => (app) =>
  app.get("/", (req, res) => {
    res.send(html);
  });

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

app.get("/", (req, res) => {
  const html = readHtml();
  const employees = readEmployeeData();

  res.send(
    renderPage({
      html,
      search: renderSearchForm(),
      content: renderEmployees(employees),
    }),
  );
});

app.post("/search", (req, res) => {
  const { keyword, type } = req.body;
  const html = readHtml();
  const employees = readEmployeeData();
  const filtered = filterEmployees({ keyword, type })(employees);

  res.send(
    renderPage({
      html,
      search: renderSearchForm(),
      content: renderEmployees(filtered),
    }),
  );
});
