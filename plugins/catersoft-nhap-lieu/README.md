# CaterSoft — Thực đơn & Dự trù cho Khách hàng

Bộ kỹ năng chính thức giúp Agent AI hỗ trợ nhân sự bếp, dinh dưỡng và kế toán thao tác **100% trực tiếp trên giao diện Web CaterSoft** cho trọn chuỗi nghiệp vụ **Thực đơn, Định lượng, Dự trù và Phần ăn thực tế**.

- **Tài liệu hướng dẫn chính thức:** [https://guide.catersoft.vn](https://guide.catersoft.vn)
- **Nguyên tắc an toàn:** Không dùng API ngầm, không tự sửa bộ nhớ trình duyệt, chỉ thao tác trên giao diện giống một nhân viên nghiệp vụ thật, luôn kiểm tra bằng mắt sau khi lưu và chỉ xóa mềm bằng nút chuẩn trên màn hình.

---

## Cài đặt nhanh trên 3 nền tảng

| STT | Tên ngắn | Nền tảng | Lệnh cài từ Marketplace GitHub |
| :-: | :--- | :--- | :--- |
| 1 | Claude Code | Claude Code CLI / Desktop | `claude plugin marketplace add catersoft-vn/catersoft-plugins` rồi `claude plugin install catersoft-nhap-lieu@catersoft-plugins` |
| 2 | Antigravity AGY | Google Antigravity | `agy plugin install https://github.com/catersoft-vn/catersoft-plugins` (hoặc trỏ vào thư mục `plugins/agy/catersoft-nhap-lieu`) |
| 3 | OpenAI Codex | Codex CLI / App | `codex plugin marketplace add catersoft-vn/catersoft-plugins` rồi mở `/plugins` để bật `catersoft-nhap-lieu` |

---

## Danh sách 6 kỹ năng bên trong

| STT | Tên ngắn | Mã kỹ năng | Phạm vi hỗ trợ trên giao diện CaterSoft |
| :-: | :--- | :--- | :--- |
| 1 | Bản đồ chuỗi | `cs-ui-ban-do-thuc-don-du-tru` | Sơ đồ phụ thuộc toàn chuỗi, thứ tự khởi tạo bếp mới và bảng truy ngược nguyên nhân khi dự trù trống hoặc sai (kèm `QUY-TAC-BAT-BUOC.md`). |
| 2 | Nguyên liệu ĐVT | `cs-ui-nguyen-lieu-dvt` | Khai Đơn vị tính, Nhóm lớn / Nhóm / Nhóm nhỏ, Nguyên liệu, Đơn vị quy đổi, TLHH sơ chế (%) và nạp Excel. |
| 3 | Món ăn định lượng | `cs-ui-mon-an-dinh-luong` | Khai Món ăn, Nhóm món, Cơ cấu món, Tên ngân hàng thực đơn, Định lượng sống, Hao hụt chế biến và cửa sổ So sánh nguyên liệu. |
| 4 | Thiết lập dự trù | `cs-ui-thiet-lap-thuc-don-du-tru` | Cấu hình Ca ăn, Điểm dự trù, Giá phần ăn, Quy tắc chọn món, Thiết lập thực đơn dự trù, copy/dán và đưa vào tuần. |
| 5 | Thực đơn tuần | `cs-ui-thuc-don-tuan-du-tru-ngay` | Xếp Thực đơn tuần, lưu tên món theo khách, nhập Dự trù ngày, lấy file Số lượng đặt hàng và xem Bảng giá dự trù bếp. |
| 6 | Phần ăn thực tế | `cs-ui-phan-an-thuc-te` | Khai Nơi phục vụ, Nhập phần ăn (pivot) từ số dự trù, kiểm Phần ăn thực tế, Doanh thu suất ăn và So sánh dự trù - thực tế. |

---

## 4 câu hỏi mẫu để bắt đầu ngay

1. *"Tôi mở bếp mới, cần nhập gì theo thứ tự nào để lên được thực đơn và dự trù?"*
2. *"Khai nguyên liệu Thịt heo tính kho theo Kg, định lượng theo Gam và định lượng món Thịt kho."*
3. *"Vì sao dự trù ngày mai ra 0 nguyên liệu cho món Cá kho?"*
4. *"Lấy số phần dự trù điền sang số báo phần ăn cho 20 nơi phục vụ."*
