---
name: cs-ui-thu-chi-cong-no-kqkd
description: >-
  Nghiệp vụ Tài chính – Kế toán nội bộ CaterSoft qua Web UI & tra cứu MCP Giai đoạn 1: Danh mục kế toán (CS-TC-03), Đề nghị thanh toán (CS-TC-04..06), Phiếu thu/chi & Thu chưa xác định (CS-TC-08, CS-TC-01), Công nợ phải thu/phải trả & Biên bản đối chiếu (CS-TC-07, CS-TC-24..30), Cấu hình P&L (CS-QTH-01B), Báo cáo KQKD / P&L & Báo cáo Cơm (CS-BC-02, CS-BC-01, CS-BC-04..08, CS-TC-15).
---

# Kỹ năng UI: Thu chi, Công nợ, ĐNTT & Báo cáo KQKD (P&L)

> Đọc `cs-ui-ban-do-thuc-don-du-tru` trước. Con số KQKD phụ thuộc vào Doanh thu suất ăn, Giá vốn xuất kho/mua hàng và các giao dịch Thu chi gắn đúng hạng mục dòng tiền.
> Tài liệu tham khảo đầy đủ màn hình: `https://catersoft.app/llms-accounting.txt`.

## 1. Phạm vi MCP Giai đoạn 1 vs Giao diện Web

| STT | Tác vụ | Được phép qua MCP Giai đoạn 1 | Bắt buộc thao tác trên Giao diện Web |
| :-: | :--- | :--- | :--- |
| 1 | Danh mục kế toán & Tài khoản NH | Chỉ đọc `cs_bank_accounts_list` | Thêm/sửa **Danh mục kế toán** (`CS-TC-03`: dòng tiền, phương thức, giai đoạn), chọn TK dùng cho Thu/Chi |
| 2 | Đề nghị thanh toán & Phiếu thu/chi | Chỉ đọc `cs_financial_transactions_list`, `cs_financial_transaction_get` | Tạo/duyệt **ĐNTT** (`CS-TC-04`/`05`), lập **Phiếu thu/chi** (`CS-TC-08`), xử lý **Thu chưa xác định** |
| 3 | Công nợ, Đối chiếu & Báo cáo KQKD | Đọc báo cáo tổng hợp qua `cs_aggregated_report_get`, `cs_aggregated_reports_batch` | Đối chiếu công nợ (`CS-TC-07`), Sổ nợ/Tuổi nợ/Biên bản đối chiếu (`CS-TC-26..30`), Cấu hình & xem **P&L / KQKD** |
| 4 | Sổ thu chi cá nhân | Đọc sổ thu chi cá nhân của chính tài khoản qua `cs_personal_finance_list` | Tạo/sửa/xóa khoản thu chi cá nhân trên `/personal-finance` |

## 2. Bản đồ màn hình Thu chi – Công nợ – KQKD

| STT | Tên ngắn | Tên trên menu | Đường dẫn | Mã trang | Dùng để |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | Quy trình Kế toán | Quy trình Kế toán / Thu chi & Công nợ | `/accounting`, `/thu-chi-cong-no` | `CS-TC-17`, `CS-TC-18` | Tổng quan luồng Đề nghị → Sổ quỹ → Công nợ → Báo cáo |
| 2 | Danh mục kế toán | Danh mục kế toán & TK Ngân hàng | `/accounting/categories`, `/settings/bank-accounts` | `CS-TC-03`, `CS-DLC-05` | Khai khoản mục dòng tiền (Thu/Chi), Phương thức TT, TK Ngân hàng |
| 3 | Đề nghị thanh toán | Phiếu / Tạo đề nghị thanh toán | `/accounting/payment-requests`, `/accounting/payment-requests/create` | `CS-TC-04`, `CS-TC-05` | Lập đề nghị thanh toán, tạm ứng, hoàn ứng gửi duyệt |
| 4 | Sổ quỹ & Thu chi | Phiếu thu/chi, Nhật ký tiền mặt/CK, Thu chưa XĐ | `/thu-chi` (tự chuyển về `/thu-chi/phieu-thu`), `/thu-chi/nhat-ky`, `/thu-chi/phieu-thu`, `/thu-chi/phieu-chi`, `/thu-chi/thu-chua-xac-dinh` | `CS-TC-08` | Ghi nhận thu/chi thực tế và phân bổ khoản tiền chưa rõ khách |
| 5 | Nhật ký Thu Chi | Nhật ký Thu Chi | `/accounting/transactions` | `CS-TC-01` | Tra cứu toàn bộ giao dịch tài chính và kiểm số dư lũy kế |
| 6 | Đối chiếu công nợ | Đối chiếu công nợ / Sổ nợ / Biên bản | `/accounting/debt-reconciliation`, `/thu-chi-cong-no/so-cong-no-phai-tra`, `/thu-chi-cong-no/so-cong-no-phai-thu`, `/thu-chi-cong-no/tuoi-no`, `/thu-chi-cong-no/bien-ban-doi-chieu` | `CS-TC-07`, `CS-TC-26`, `CS-TC-27`, `CS-TC-28`, `CS-TC-30` | Theo dõi công nợ KH/NCC, tuổi nợ quá hạn, ghép thanh toán và in biên bản |
| 7 | Cấu hình & Điểm P&L | Cấu hình báo cáo P&L / Điểm kinh doanh | `/settings/pnl-report/configs`, `/settings/pnl-sites` | `CS-QTH-01B`, `CS-DLC-19` | Cấu hình 3 phần P&L và ánh xạ bếp/cơ sở lên điểm kinh doanh |
| 8 | Báo cáo P&L & KQKD | Báo cáo doanh thu P&L / KQKD theo điểm | `/reports/kqhdkd-pnl`, `/reports/kqkd-by-site-v2`, `/reports/revenue-cogs-by-unit` | `CS-BC-02`, `CS-BC-01`, `CS-BC-08` | Xem lãi lỗ 3 phần toàn công ty hoặc từng bếp/điểm kinh doanh |
| 9 | Báo cáo Cơm & Thuế | Báo Cáo Cơm / KQKD Thuế / Xuất bút toán | `/weekly-meal-plan/report/stock-movement-reports`, `/ke-toan-thue/kqkd`, `/ke-toan-thue/xuat-but-toan` | `CS-BC-04`, `CS-TC-15`, `CS-TC-14` | Đối chiếu chi phí suất ăn theo xuất kho và xuất dữ liệu kế toán |

## 3. Quy trình & Nguyên tắc an toàn bắt buộc

1. **Gắn đúng Danh mục & Điểm kinh doanh trước khi lưu phiếu:**
   - Khi lập ĐNTT hoặc Phiếu thu/chi (`CS-TC-08`), luôn chọn đúng **Quỹ / TK Ngân hàng**, **Hạng mục dòng tiền (`CS-TC-03`)**, **Đối tượng (KH/NCC)** và **Bếp/Điểm kinh doanh**. Phiếu thiếu hạng mục sẽ rơi vào dòng tổng hợp/khác trên báo cáo KQKD.
2. **Xử lý Thu chưa xác định & Số dư quỹ lệch:**
   - Tiền về tài khoản chưa rõ chứng từ ghi vào `/thu-chi/thu-chua-xac-dinh`; khi xác định được khách hàng/kỳ hóa đơn, **hỏi xác nhận người dùng** trước khi phân bổ lại.
   - Khi kiểm tra số dư lệch, đối chiếu từng kỳ trên **Nhật ký Thu Chi (`CS-TC-01`)** và kiểm **Tài khoản dùng cho Thu/Chi** tại `CS-TC-03`.
3. **Thao tác bắt buộc dừng lại hỏi xác nhận người dùng:**
   - Duyệt chi / Giải ngân / Xác nhận chi tiền thực trên phiếu chi hoặc ĐNTT.
   - Thêm, sửa, bật/tắt chỉ tiêu trong **Cấu hình báo cáo P&L (`CS-QTH-01B`)** (ảnh hưởng toàn công ty).
   - Chỉnh sửa hoặc xóa mềm giao dịch tài chính đã ghi sổ.
4. **Kiểm tra 3 lớp khi số liệu KQKD (`CS-BC-02` / `CS-BC-01`) lệch:**
   - Lớp Doanh thu: kiểm **Doanh thu SACN (`CS-DTP-02`)** / đơn bán SO.
   - Lớp Giá vốn: đối chiếu **Doanh thu – Giá vốn (`CS-BC-08`)** và **Báo Cáo Cơm (`CS-BC-04`)**.
   - Lớp Chi phí khác: kiểm định khoản ở **Nhật ký Thu Chi (`CS-TC-01`)**.
