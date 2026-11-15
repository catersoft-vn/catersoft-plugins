# CaterSoft Official AI Plugins

Kho mã nguồn công khai phân phối các plugin hỗ trợ khách hàng CaterSoft trên cả **3 hệ sinh thái AI Marketplace**: **Claude Code**, **Google Antigravity (AGY)** và **OpenAI Codex / ChatGPT**.

Mọi plugin trong kho tuân thủ tuyệt đối nguyên tắc **100% thao tác qua giao diện Web (UI-only)** — không dùng API ngầm, không chứa thông tin hay dữ liệu của bất kỳ khách hàng nào.

---

## Cài đặt nhanh từ Marketplace GitHub (`catersoft-vn/catersoft-plugins`)

| STT | Tên ngắn | Nền tảng | Lệnh thêm nguồn & cài đặt |
| :-: | :--- | :--- | :--- |
| 1 | Claude Code | Anthropic Claude Code | `claude plugin marketplace add catersoft-vn/catersoft-plugins`<br>`claude plugin install catersoft-nhap-lieu@catersoft-plugins` |
| 2 | Antigravity AGY | Google Antigravity | `agy plugin install https://github.com/catersoft-vn/catersoft-plugins/tree/main/plugins/catersoft-nhap-lieu` *(hoặc trỏ vào thư mục `plugins/catersoft-nhap-lieu` sau khi clone)* |
| 3 | OpenAI Codex | OpenAI Codex CLI / App | `codex plugin marketplace add catersoft-vn/catersoft-plugins`<br>`codex plugin add catersoft-nhap-lieu@catersoft-plugins` |

---

## Danh mục Plugin hiện có

| STT | Tên ngắn | Mã gói | Phiên bản | Mô tả |
| :-: | :--- | :--- | :---: | :--- |
| 1 | Thực đơn & Dự trù | `catersoft-nhap-lieu` | `2.3.3` | Hướng dẫn Agent AI thao tác trọn chuỗi Nguyên liệu, ĐVT, Món ăn, Định lượng, Thiết lập thực đơn dự trù, Thực đơn tuần, Dự trù ngày và Phần ăn thực tế qua Web UI CaterSoft. |

---

## Kiến trúc đóng gói 1 nguồn → 3 đích

```text
catersoft-plugins/
├── src/<plugin>/                 # Nguồn soạn duy nhất (plugin.meta.json, skills/, rules/, assets/)
├── scripts/
│   ├── build-plugins.mjs         # Sinh đồng bộ cây Marketplace + dist/{claude,agy,codex} + file .zip sạch
│   ├── verify-plugins.mjs        # Quét rác/bảo mật + chạy kiểm tra qua 3 CLI (claude, agy, codex)
│   └── build-plugins.test.mjs    # Kiểm thử đơn vị bằng node --test
├── .claude-plugin/               # Danh mục Marketplace chuẩn Claude Code
├── .agents/plugins/              # Danh mục Marketplace chuẩn OpenAI Codex
├── plugins/<plugin>/             # Gói tích hợp sạch sẵn sàng cài trực tiếp từ GitHub
└── dist/                         # Các gói tách riêng phục vụ nộp lên 3 cổng Marketplace chính thức (bị gitignore)
```

### Lệnh phát triển & kiểm chứng cục bộ

```bash
npm run build   # Sinh cây Marketplace (plugins/, .claude-plugin/, .agents/) và gói nộp chợ (dist/)
npm test        # Chạy bộ kiểm thử đơn vị (node --test)
npm run verify  # Quét bảo mật + chạy validate --strict qua claude, agy và cài thử cô lập trên codex
```
