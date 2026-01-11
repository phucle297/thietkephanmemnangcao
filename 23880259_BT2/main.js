const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

// Tuổi người lập trình
const TUOI_LAP_TRINH_VIEN = 25;

// Trang nhập liệu
app.get("/", (req, res) => {
  res.send(`
    <h3>Ứng dụng Lời chào</h3>
    <form method="post" action="/loi-chao">
      Họ tên: <input name="hoTen" required /><br/><br/>
      Giới tính:
      <select name="gioiTinh">
        <option value="nam">Nam</option>
        <option value="nu">Nữ</option>
      </select><br/><br/>
      Ngày sinh:
      <input type="date" name="ngaySinh" required /><br/><br/>
      <button type="submit">Đồng ý</button>
    </form>
  `);
});

// Xử lý lời chào
app.post("/loi-chao", (req, res) => {
  const { hoTen, gioiTinh, ngaySinh } = req.body;

  const tuoiNguoiDung = tinhTuoi(ngaySinh);
  const danhXung = xacDinhDanhXung(tuoiNguoiDung, gioiTinh);

  res.send(`
    <h3>Xin chào ${hoTen} ${danhXung} có ${tuoiNguoiDung} tuổi</h3>
    <a href="/">Quay lại</a>
  `);
});

// ===== HÀM HỖ TRỢ =====

// Tính tuổi từ ngày sinh
function tinhTuoi(ngaySinh) {
  const namSinh = new Date(ngaySinh).getFullYear();
  const namHienTai = new Date().getFullYear();
  return namHienTai - namSinh;
}

// Xác định danh xưng
function xacDinhDanhXung(tuoiNguoiDung, gioiTinh) {
  if (tuoiNguoiDung < 15) return "Con";

  if (tuoiNguoiDung < TUOI_LAP_TRINH_VIEN) {
    return "Em";
  }

  if (gioiTinh === "nam") return "Anh";
  return "Chị";
}
