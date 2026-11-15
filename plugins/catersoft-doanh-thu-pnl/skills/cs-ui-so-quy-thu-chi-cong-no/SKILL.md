---
name: cs-ui-so-quy-thu-chi-cong-no
description: >-
  Quản lý Sổ quỹ & Phiếu thu/chi (CS-TC-08), Nhật ký Thu Chi (CS-TC-01), Đối chiếu công nợ (CS-TC-07), Phiếu công nợ NCC/KH (CS-MH-22, CS-TC-24), Đề nghị thu (CS-TC-25), Sổ công nợ, Tuổi nợ, Lịch thu chi & Biên bản đối chiếu (CS-TC-26..30) 100% qua Web UI CaterSoft.
  Dùng khi lập phiếu thu/chi, xử lý thu chưa xác định, theo dõi tuổi nợ quá hạn hoặc đối chiếu công nợ khách hàng / NCC.
---

# Kỹ năng UI: Sổ quỹ Thu Chi, Công nợ & Đối chiếu

> **Quy tắc bắt buộc (100% UI-Only & 7 Quy tắc Vàng DOM):** Trên Claude Code và Codex, luôn đọc thêm file `../cs-ui-ban-do-doanh-thu-pnl/QUY-TAC-BAT-BUOC.md` trước khi thao tác trình duyệt (Antigravity nạp sẵn qua `rules/AGENTS.md`).

> Đọc `cs-ui-ban-do-doanh-thu-pnl` trước. Danh mục TK ngân hàng, phương thức và hạng mục kế toán phải có sẵn (`cs-ui-danh-muc-va-dntt`).

## 1. Bản đồ màn hình

| STT | Tên ngắn | Tên trên menu | Đường dẫn | Mã trang | Dùng để |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | Sổ quỹ & Thu chi | Phiếu thu / Phiếu chi | `/thu-chi/phieu-thu`, `/thu-chi/phieu-chi`, `/thu-chi/nhat-ky`, `/thu-chi/nhat-ky-tien-mat`, `/thu-chi/nhat-ky-chuyen-khoan`, `/thu-chi/thu-chua-xac-dinh` | `CS-TC-08` | Lập phiếu thu/chi, tách quỹ tiền mặt & chuyển khoản, xử lý khoản thu chưa xác định |
| 2 | Nhật ký Thu Chi | Nhật ký Thu Chi | `/accounting/transactions` | `CS-TC-01` | Tra cứu, lọc toàn bộ giao dịch tài chính và kiểm tra số dư lũy kế |
| 3 | Đối chiếu công nợ | Đối chiếu công nợ | `/accounting/debt-reconciliation` | `CS-TC-07` | Ghép thanh toán với chứng từ công nợ khách hàng / NCC |
| 4 | Công nợ NCC | Phiếu công nợ NCC | `/inventory/purchase-orders-simple/supplier-debt-notes` | `CS-MH-22` | Theo dõi phiếu công nợ phải trả từ PO nhập hàng & chứng từ trả tiền |
| 5 | Công nợ khách | Phiếu công nợ khách | `/thu-chi-cong-no/phieu-cong-no-khach` | `CS-TC-24` | Theo dõi phiếu công nợ phải thu khách hàng theo kỳ/đơn hàng |
| 6 | Đề nghị thu | Đề nghị thu | `/thu-chi-cong-no/de-nghi-thu` | `CS-TC-25` | Tạo & theo dõi đề nghị thu tiền gửi khách hàng |
| 7 | Sổ nợ phải trả | Sổ công nợ phải trả | `/thu-chi-cong-no/so-cong-no-phai-tra` | `CS-TC-26` | Sổ chi tiết công nợ phải trả theo từng NCC & kỳ |
| 8 | Sổ nợ phải thu | Sổ công nợ phải thu | `/thu-chi-cong-no/so-cong-no-phai-thu` | `CS-TC-27` | Sổ chi tiết công nợ phải thu theo từng Khách hàng & kỳ |
| 9 | Tuổi nợ quá hạn | Tuổi nợ và quá hạn | `/thu-chi-cong-no/tuoi-no` | `CS-TC-28` | Phân loại khoản nợ sắp đến hạn & quá hạn theo nhóm ngày |
| 10 | Lịch thu chi | Lịch thu chi sắp tới | `/thu-chi-cong-no/lich-thu-chi` | `CS-TC-29` | Dự kiến dòng tiền thu / chi sắp tới theo lịch thanh toán |
| 11 | Biên bản đối chiếu | Biên bản đối chiếu công nợ | `/thu-chi-cong-no/bien-ban-doi-chieu` | `CS-TC-30` | Tổng hợp, xuất/in biên bản đối chiếu công nợ định kỳ với đối tác |

## 2. Lập Phiếu thu / Phiếu chi & Sổ quỹ (`CS-TC-08`, `CS-TC-01`)

1. Chọn đúng tab đường dẫn trong `/thu-chi/`: **Tạo phiếu thu (`/phieu-thu`)** hoặc **Tạo phiếu chi (`/phieu-chi`)**, hoặc xem **Nhật ký tiền mặt / Chuyển khoản**.
2. Điền đủ các trường bắt buộc: **Ngày giao dịch**, **Quỹ / Tài khoản NH**, **Phương thức thanh toán**, **Hạng mục thu/chi**, **Đối tượng (KH / NCC / Nội bộ)** và **Số tiền**.
3. Nếu ghi nhận khoản chuyển về ngân hàng mà **chưa rõ khách hàng / chứng từ**, đưa vào **Thu chưa xác định (`/thu-chi/thu-chua-xac-dinh`)** để tránh bỏ sót dòng tiền; khi tra ra đối tượng, **hỏi xác nhận người dùng** rồi cập nhật phân bổ lại.
4. Kiểm tra bằng mắt trên **Nhật ký (`/thu-chi/nhat-ky`)** và **`CS-TC-01`** để bảo đảm số dư quỹ khớp sao kê / tồn két thực tế.

## 3. Quy trình Đối chiếu Công nợ & Đề nghị thu (`CS-TC-24..30`, `CS-TC-07`, `CS-MH-22`)

1. **Tạo Đề nghị thu (`CS-TC-25`):** Lọc kỳ & Khách hàng cần thu, lập phiếu đề nghị thu đối chiếu số liệu từ **Phiếu công nợ khách (`CS-TC-24`)**.
2. **Đối chiếu thanh toán (`CS-TC-07`):** Ghép các khoản thu/chi thực tế với chứng từ công nợ trên `CS-TC-26` (NCC) hoặc `CS-TC-27` (KH).
3. **Theo dõi tuổi nợ & Lịch dòng tiền (`CS-TC-28`, `CS-TC-29`):** Dùng bộ lọc hạn nợ để báo cáo khoản quá hạn cho người phụ trách.
4. **Lập Biên bản đối chiếu (`CS-TC-30`):** Chọn đối tác và kỳ chốt, kiểm tra số dư đầu kỳ – phát sinh – đã thanh toán – cuối kỳ khớp 100% với Sổ nợ trước khi xuất/in gửi đối tác.
