# CaterSoft — Plugin Chính thức (Kỹ năng Nhập liệu & MCP OAuth 2.1)

Plugin chính thức duy nhất của **CaterSoft** dành cho trợ lý AI trên **Claude Code**, **Google Antigravity (AGY)** và **OpenAI Codex**.

- **Cổng hướng dẫn sử dụng:** [https://guide.catersoft.vn/bat-dau/tro-ly-ai-catersoft](https://guide.catersoft.vn/bat-dau/tro-ly-ai-catersoft)
- **Máy chủ MCP từ xa:** `https://catersoft.app/mcp` (đăng nhập **OAuth 2.1 + PKCE** trực tiếp bằng tài khoản CaterSoft trên trình duyệt; không cần tạo hay dán API key thủ công).
- **Phạm vi Giai đoạn 1 (An toàn dữ liệu):** Gồm **6 kỹ năng nhập liệu cơ bản** (*Thực đơn, Định lượng, Dự trù, Phần ăn*) kết hợp **bộ công cụ MCP tra cứu, tạo mới và cập nhật cơ bản** đúng theo công ty và quyền màn hình của tài khoản đang đăng nhập (**không có công cụ xóa dữ liệu**, chưa bao gồm thao tác mua hàng/kế toán chuyên sâu).

---

## Cài đặt nhanh trên 3 nền tảng

| STT | Tên ngắn | Nền tảng | Lệnh cài từ Marketplace GitHub |
| :-: | :--- | :--- | :--- |
| 1 | Claude Code | Claude Code CLI / Desktop | `claude plugin marketplace add catersoft-vn/catersoft-plugins` rồi `claude plugin install catersoft@catersoft-plugins` |
| 2 | Antigravity AGY | Google Antigravity | `agy plugin install https://github.com/catersoft-vn/catersoft-plugins/tree/main/plugins/catersoft` |
| 3 | OpenAI Codex | Codex CLI / App | `codex plugin marketplace add catersoft-vn/catersoft-plugins` rồi bật `catersoft` trong `/plugins` |

Sau khi cài đặt, khi gọi công cụ CaterSoft MCP lần đầu, trình duyệt sẽ tự mở màn hình **Cấp quyền Trợ lý AI (MCP)** tại CaterSoft để bạn đăng nhập, chọn đúng công ty đang làm việc và xác nhận. Token ngắn hạn sẽ được cấp riêng cho chính tài khoản đó và tự động làm mới an toàn.

---

## Danh sách 6 kỹ năng nhập liệu cơ bản (Giai đoạn 1)

| STT | Tên ngắn | Mã kỹ năng | Phạm vi hỗ trợ (MCP cơ bản + Giao diện Web) |
| :-: | :--- | :--- | :--- |
| 1 | Bản đồ chuỗi | `cs-ui-ban-do-thuc-don-du-tru` | Sơ đồ phụ thuộc toàn chuỗi, thứ tự khởi tạo bếp mới, nguyên tắc sử dụng MCP OAuth + Web UI (kèm `QUY-TAC-BAT-BUOC.md`). |
| 2 | Nguyên liệu ĐVT | `cs-ui-nguyen-lieu-dvt` | Tra cứu/khai Đơn vị tính, Nhóm hàng, Nguyên liệu, Đơn vị quy đổi và TLHH sơ chế (%). |
| 3 | Món ăn định lượng | `cs-ui-mon-an-dinh-luong` | Tra cứu/khai Nhóm món, Cơ cấu món, Món ăn, Ngân hàng thực đơn và Định lượng sống cho từng phần ăn. |
| 4 | Thiết lập dự trù | `cs-ui-thiet-lap-thuc-don-du-tru` | Tra cứu Ca làm việc, Điểm dự trù và hướng dẫn dựng Thiết lập thực đơn dự trù cho từng bếp. |
| 5 | Thực đơn tuần | `cs-ui-thuc-don-tuan-du-tru-ngay` | Xếp/cập nhật món Thực đơn tuần, kiểm tra nguyên nhân dự trù ra 0 và đối chiếu Dự trù ngày. |
| 6 | Phần ăn thực tế | `cs-ui-phan-an-thuc-te` | Tra cứu Nơi phục vụ và cập nhật Số báo / Số thực tế / Đơn giá suất ăn theo ngày và ca. |

---

## 4 câu yêu cầu mẫu để bắt đầu ngay

1. *"Kiểm tra tài khoản CaterSoft MCP hiện tại (`cs_tenant_whoami`) và chỉ tôi thứ tự nhập dữ liệu cho bếp mới."*
2. *"Khai đơn vị tính Kg, Gam và nguyên liệu Thịt heo có tỷ lệ hao hụt sơ chế 5%."*
3. *"Tạo món Thịt kho tàu, gán vào ngân hàng thực đơn chuẩn và nhập định lượng sống 120 Gam."*
4. *"Kiểm tra thực đơn tuần này của bếp và cập nhật số phần ăn thực tế ngày hôm nay."*
