# CaterSoft Plugin — Trợ lý AI & MCP Chính thức (OAuth 2.1)

Kho phân phối chính thức **plugin CaterSoft duy nhất** (`catersoft`) dành cho trợ lý AI trên cả 3 nền tảng: **Claude Code**, **Google Antigravity (AGY)** và **OpenAI Codex**.

> **Nguyên tắc đăng nhập & an toàn (OAuth 2.1 theo từng tài khoản):** Khi bật máy chủ MCP `https://catersoft.app/mcp`, công cụ AI sẽ mở trình duyệt để bạn đăng nhập trực tiếp bằng tài khoản CaterSoft hiện có. Phiên MCP kế thừa đúng vai trò, công ty và phân quyền từng màn hình của tài khoản đó (không cần cấu hình API key tĩnh; không cung cấp công cụ xóa hay hủy dữ liệu).

## Thành phần của Plugin `catersoft` (`v1.0.0`)

### 1. Bộ 6 kỹ năng nhập liệu cơ bản (Giai đoạn 1 — Thực đơn, Dự trù & Phần ăn)

| STT | Tên ngắn | Mã kỹ năng | Phạm vi |
| :-: | :--- | :--- | :--- |
| 1 | Bản đồ thứ tự nhập liệu | `cs-ui-ban-do-thuc-don-du-tru` | Chẩn đoán, hướng dẫn thứ tự phụ thuộc và điều phối |
| 2 | Nguyên liệu & Đơn vị tính | `cs-ui-nguyen-lieu-dvt` | Đơn vị tính, nhóm nguyên liệu và mã hàng nền |
| 3 | Món ăn & Định lượng | `cs-ui-mon-an-dinh-luong` | Món ăn và định lượng nguyên liệu sống theo Gam |
| 4 | Thiết lập thực đơn | `cs-ui-thiet-lap-thuc-don-du-tru` | Đối tượng phục vụ, bữa/ca và công thức khung |
| 5 | Thực đơn tuần & Dự trù | `cs-ui-thuc-don-tuan-du-tru-ngay` | Xếp món trên lưới tuần và bảng dự trù ngày |
| 6 | Phần ăn thực tế | `cs-ui-phan-an-thuc-te` | Cập nhật phần ăn thực tế và quy tắc tính phần thanh toán |

### 2. Máy chủ CaterSoft MCP (`https://catersoft.app/mcp`)

- Xác thực **OAuth 2.1 + PKCE (`S256`)** qua `/auth/mcp-authorize` theo từng tài khoản CaterSoft đăng nhập.
- Giai đoạn 1 chỉ cấp **công cụ tra cứu, tạo mới và cập nhật cơ bản** (danh mục đơn vị tính, nguyên liệu, món ăn, định lượng, thực đơn tuần/dự trù, phần ăn thực tế, khách hàng/nhà cung cấp/bếp cơ sở đúng quyền tài khoản). Tuyệt đối **không có công cụ xóa/xóa vĩnh viễn** qua MCP.

---

## Cài đặt nhanh theo từng công cụ AI

### 1. Claude Code
```bash
/plugin marketplace add catersoft-vn/catersoft-plugins
/plugin install catersoft@catersoft-plugins
```

### 2. Google Antigravity (AGY)
```bash
agy plugin install https://github.com/catersoft-vn/catersoft-plugins/tree/main/plugins/catersoft
```

### 3. OpenAI Codex (CLI / Desktop App)
```bash
codex plugin marketplace add catersoft-vn/catersoft-plugins
```
Sau đó mở `/plugins` trong Codex CLI hoặc giao diện Codex Desktop và bật plugin `catersoft`, rồi nhấn kết nối MCP để đăng nhập tài khoản CaterSoft.

---

## Kiến trúc 1 Nguồn → 3 Đích & Kiểm thử cục bộ

- Nguồn gốc duy nhất nằm tại `src/catersoft/` (`plugin.meta.json`, `assets/logo.svg`, `rules/AGENTS.md`, `skills/*/SKILL.md`).
- Các lệnh kiểm tra và xuất bản:
  - `npm run build`: đồng bộ ra `plugins/catersoft/`, `.claude-plugin/marketplace.json`, `.agents/plugins/marketplace.json` và `dist/{claude,agy,codex}/` kèm file `.zip` sạch chuẩn OpenAI Portal.
  - `npm test`: chạy bộ unit test Node (`node --test`).
  - `npm run verify`: quét vệ sinh/bảo mật, kiểm tra `validateOpenAiSubmissionRules` và chạy kiểm thử xác thực chặt chẽ trên cả 3 CLI (`claude --strict`, `agy --strict --json`, `codex plugin marketplace/add`).

## Tài liệu hướng dẫn khách hàng

- Cổng hướng dẫn cài đặt & sử dụng: <https://guide.catersoft.vn/bat-dau/tro-ly-ai-catersoft>
- Bộ hướng dẫn nghiệp vụ CaterSoft: <https://guide.catersoft.vn>
