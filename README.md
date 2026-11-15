# CaterSoft Plugins — Bộ Kỹ năng Trợ lý AI Chính thức (100% UI-Only)

Kho phân phối chính thức các bộ kỹ năng (**Plugins**) của **CaterSoft** dành cho trợ lý AI của khách hàng trên cả 3 nền tảng: **Claude Code**, **Google Antigravity (AGY)** và **OpenAI Codex**.

> **Nguyên tắc bắt buộc (100% UI-Only):** Toàn bộ kỹ năng hướng dẫn AI thao tác **100% trực tiếp trên giao diện trình duyệt CaterSoft** như một nhân sự nghiệp vụ thật (Click, Chọn, Gõ, Lưu). Không gọi API ngầm, không can thiệp `localStorage`/IndexedDB, không tự chốt xóa cứng hoặc duyệt chi/chốt tồn khi chưa hỏi người dùng.

## Danh mục 4 Plugin chính thức (21 kỹ năng)

| STT | Tên ngắn | Mã Plugin | Phiên bản | Số kỹ năng | Bộ phận sử dụng |
| :-: | :--- | :--- | :-: | :-: | :--- |
| 1 | Thực đơn & Dự trù | `catersoft-nhap-lieu` | `2.3.4` | 6 | Dinh dưỡng, Quản lý bếp, Soạn thực đơn tuần & Dự trù ngày |
| 2 | Mua hàng & Kho | `catersoft-mua-hang-kho` | `1.0.0` | 5 | Thu mua, Thủ kho bếp/kho tổng, Kiểm kê & Giá NCC theo vùng |
| 3 | Kho FIFO & Thương mại | `catersoft-fifo-trading` | `1.0.0` | 5 | Kho lô FIFO/HSD, Đơn vị thương mại nhập PO → SO, Kiểm kê lô |
| 4 | Thu chi & P&L | `catersoft-doanh-thu-pnl` | `1.0.0` | 5 | Kế toán thanh toán (ĐNTT), Sổ quỹ, Công nợ, Giá KH & Báo cáo P&L |

---

## Cài đặt nhanh theo từng công cụ AI

### 1. Claude Code
```bash
/plugin marketplace add catersoft-vn/catersoft-plugins
/plugin install catersoft-nhap-lieu@catersoft-plugins
/plugin install catersoft-mua-hang-kho@catersoft-plugins
/plugin install catersoft-fifo-trading@catersoft-plugins
/plugin install catersoft-doanh-thu-pnl@catersoft-plugins
```

### 2. Google Antigravity (AGY)
Cài từng plugin cần dùng trực tiếp theo đường dẫn nhánh thư mục trên GitHub:
```bash
agy plugin install https://github.com/catersoft-vn/catersoft-plugins/tree/main/plugins/catersoft-nhap-lieu
agy plugin install https://github.com/catersoft-vn/catersoft-plugins/tree/main/plugins/catersoft-mua-hang-kho
agy plugin install https://github.com/catersoft-vn/catersoft-plugins/tree/main/plugins/catersoft-fifo-trading
agy plugin install https://github.com/catersoft-vn/catersoft-plugins/tree/main/plugins/catersoft-doanh-thu-pnl
```

### 3. OpenAI Codex (CLI / Desktop App)
```bash
codex plugin marketplace add catersoft-vn/catersoft-plugins
```
Sau đó mở lệnh `/plugins` trong Codex CLI hoặc giao diện Codex Desktop và bật plugin cần dùng (`catersoft-nhap-lieu`, `catersoft-mua-hang-kho`, `catersoft-fifo-trading`, `catersoft-doanh-thu-pnl`).

---

## Kiến trúc 1 Nguồn → 3 Đích & Kiểm thử cục bộ

- Nguồn gốc duy nhất nằm tại `src/<ten-plugin>/` (`plugin.meta.json`, `assets/logo.svg`, `rules/AGENTS.md`, `skills/*/SKILL.md`).
- Các lệnh kiểm tra và xuất bản:
  - `npm run build`: đồng bộ ra `plugins/`, `.claude-plugin/marketplace.json`, `.agents/plugins/marketplace.json` và `dist/{claude,agy,codex}/` kèm file `.zip` sạch chuẩn OpenAI Portal.
  - `npm test`: chạy bộ unit test Node (`node --test`).
  - `npm run verify`: quét vệ sinh/bảo mật, kiểm tra `validateOpenAiSubmissionRules` và chạy kiểm thử cài đặt thực tế trên cả 3 CLI (`claude --strict`, `agy --strict --json`, `codex plugin marketplace/add`).

## Tài liệu hướng dẫn khách hàng

- Cổng hướng dẫn cài đặt & sử dụng: <https://guide.catersoft.vn/bat-dau/tro-ly-ai-catersoft>
- Bộ hướng dẫn nghiệp vụ CaterSoft: <https://guide.catersoft.vn>
