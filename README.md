# CaterSoft — Plugin Chính thức (Kỹ năng Nhập liệu & MCP OAuth 2.1)

Plugin chính thức duy nhất của **CaterSoft** dành cho trợ lý AI trên **Claude Code**, **Google Antigravity (AGY)** và **OpenAI Codex**.

- **Cổng hướng dẫn & Hỏi đáp:** [https://guide.catersoft.vn/bat-dau/tro-ly-ai-catersoft](https://guide.catersoft.vn/bat-dau/tro-ly-ai-catersoft), tài liệu đầy đủ cho AI tại `https://guide.catersoft.vn/llms-full.txt` và hỏi đáp tại `https://hoi-dap.catersoft.vn/llms.txt` (dùng chung cho cả `https://catersoft.app` và `https://app.catersoft.vn`).
- **Tài liệu kỹ thuật máy đọc (tenant app):** `https://catersoft.app/llms.txt` cùng `/llms-full.txt`, 5 phân hệ (`/llms-meal.txt`, `/llms-inventory.txt`, `/llms-accounting.txt`, `/llms-hr.txt`, `/llms-settings.txt`) và chỉ mục `/llms-routes.json`.
- **Máy chủ MCP từ xa:** `https://catersoft.app/mcp` (chuẩn **OAuth 2.1 + PKCE**, kết nối trực tiếp từ Claude Code, AGY, OpenAI Codex, ChatGPT, Cursor hoặc mọi MCP client chuẩn; không cần tạo hay dán API key thủ công).
- **Phạm vi v1.2.0:** Gồm **10 kỹ năng nghiệp vụ trọn chuỗi** (*Thực đơn – Dự trù – Phần ăn*, *Mua hàng – Kho bình quân – Kiểm kê*, *Kho FIFO – Đối tác*, *Thu chi – Công nợ – KQKD*, *Nhân sự – Phân quyền*) kết hợp **81 công cụ MCP Giai đoạn 1** theo đúng công ty và quyền màn hình của tài khoản đang đăng nhập (hỗ trợ tạo cơ sở `cs_facility_create` cho Admin+, tạo/sửa bếp, loại bếp, kho, ca ăn, điểm dự trù, nơi phục vụ, quy đổi ĐVT trên nguyên liệu với `expectedRecipeUnitId`, phân trang `offset`/`hasMore`, cảnh báo `daySourceSummary`/`frozenDayWarning`, và chỉ đọc kế hoạch sản xuất, thực đơn tuần, dự trù nguyên liệu ngày, chi tiết PO; **không có công cụ xóa dữ liệu**).

---

## Cài đặt nhanh trên 3 nền tảng

| STT | Tên ngắn | Nền tảng | Lệnh cài từ Marketplace GitHub |
| :-: | :--- | :--- | :--- |
| 1 | Claude Code | Claude Code CLI / Desktop | `claude plugin marketplace add catersoft-vn/catersoft-plugins` rồi `claude plugin install catersoft@catersoft-plugins` |
| 2 | Antigravity AGY | Google Antigravity | `agy plugin install https://github.com/catersoft-vn/catersoft-plugins/tree/main/plugins/catersoft` |
| 3 | OpenAI Codex | Codex CLI / App | `codex plugin marketplace add catersoft-vn/catersoft-plugins` rồi bật `catersoft` trong `/plugins` |

Sau khi cài đặt, khi gọi công cụ CaterSoft MCP lần đầu, trình duyệt sẽ tự mở màn hình **Cấp quyền Trợ lý AI (MCP)** tại CaterSoft để bạn đăng nhập, chọn đúng công ty đang làm việc và xác nhận. Token ngắn hạn sẽ được cấp riêng cho chính tài khoản đó và tự động làm mới an toàn.

---

## Danh sách 10 kỹ năng nghiệp vụ (v1.2.0)

| STT | Tên ngắn | Mã kỹ năng | Phạm vi hỗ trợ (MCP Giai đoạn 1 + Giao diện Web) |
| :-: | :--- | :--- | :--- |
| 1 | Bản đồ chuỗi | `cs-ui-ban-do-thuc-don-du-tru` | Sơ đồ phụ thuộc toàn chuỗi, thứ tự khởi tạo bếp mới, nguyên tắc MCP OAuth + Web UI (kèm `QUY-TAC-BAT-BUOC.md`). |
| 2 | Nguyên liệu ĐVT | `cs-ui-nguyen-lieu-dvt` | Tra cứu/khai Đơn vị tính, Nhóm hàng, Nguyên liệu, Đơn vị quy đổi và TLHH sơ chế (%). |
| 3 | Món ăn định lượng | `cs-ui-mon-an-dinh-luong` | Tra cứu/khai Nhóm món, Cơ cấu món, Món ăn, Ngân hàng thực đơn và Định lượng sống cho từng phần ăn. |
| 4 | Thiết lập dự trù | `cs-ui-thiet-lap-thuc-don-du-tru` | Tra cứu Ca làm việc, Điểm dự trù và hướng dẫn dựng Thiết lập thực đơn dự trù cho từng bếp. |
| 5 | Thực đơn tuần | `cs-ui-thuc-don-tuan-du-tru-ngay` | Xếp/cập nhật món Thực đơn tuần, kiểm tra nguyên nhân dự trù ra 0 và đối chiếu Dự trù ngày. |
| 6 | Phần ăn thực tế | `cs-ui-phan-an-thuc-te` | Tra cứu Nơi phục vụ và cập nhật Số báo / Số thực tế / Đơn giá suất ăn theo ngày và ca. |
| 7 | Mua hàng & Kho | `cs-ui-mua-hang-kho-kiem-ke` | Lập PR, tổng hợp & tạo/gộp/tách/gửi mail PO, giao nhận nhập kho, xuất bếp, chuyển kho, kiểm kê & khóa kỳ NXT. |
| 8 | Kho FIFO & Đối tác | `cs-ui-kho-fifo-va-doi-tac` | Ánh xạ đối tác/hàng hóa PO→SO, mua nhận lô NSX/HSD, bán xuất lô FEFO, kiểm kê & khôi phục chứng từ FIFO. |
| 9 | Thu chi & KQKD | `cs-ui-thu-chi-cong-no-kqkd` | Danh mục thu chi, ĐNTT/tạm ứng/hoàn ứng, sổ quỹ, thu chưa xác định, công nợ KH/NCC, P&L 3 phần & Báo cáo Cơm. |
| 10 | Nhân sự & Quyền | `cs-ui-nhan-su-va-phan-quyen` | Hồ sơ nhân sự, hợp đồng, chấm công/khóa ngày/tính lương, sơ đồ tổ chức bếp, công ty, phân quyền chi tiết & hỗ trợ. |

---

## 4 câu yêu cầu mẫu để bắt đầu ngay

1. *"Kiểm tra tài khoản CaterSoft MCP hiện tại (`cs_tenant_whoami`) và chỉ tôi thứ tự nhập dữ liệu cho bếp mới."*
2. *"Khai đơn vị tính Kg, Gam và nguyên liệu Thịt heo có tỷ lệ hao hụt sơ chế 5%."*
3. *"Tạo món Thịt kho tàu, gán vào ngân hàng thực đơn chuẩn và nhập định lượng sống 120 Gam."*
4. *"Kiểm tra thực đơn tuần này của bếp và cập nhật số phần ăn thực tế ngày hôm nay."*

---

## Kiến trúc 1 Nguồn → 3 Đích & Kiểm thử cục bộ (`v1.2.0` · 10 kỹ năng)

- Nguồn gốc duy nhất nằm tại `src/catersoft/` (`plugin.meta.json`, `assets/logo.svg`, `rules/AGENTS.md`, `skills/*/SKILL.md`).
- Tệp `src/catersoft/skills/cs-ui-ban-do-thuc-don-du-tru/QUY-TAC-BAT-BUOC.md` và tệp `README.md` gốc này được tự đồng bộ từ `src/catersoft/` khi chạy `npm run build`.
- Lệnh kiểm tra và đóng gói:
  - `npm run build`: đồng bộ ra `plugins/catersoft/`, `.claude-plugin/marketplace.json`, `.agents/plugins/marketplace.json` và `dist/{claude,agy,codex}/` kèm file `.zip` chuẩn OpenAI Portal.
  - `npm test`: chạy bộ unit test Node (`node --test`).
  - `npm run verify`: quét vệ sinh/bảo mật, kiểm tra single-source/wildcard, kiểm tra `validateOpenAiSubmissionRules` và chạy CLI kiểm thử trên cả 3 nền tảng (`claude`, `agy`, `codex`).
