---
name: cs-ui-ban-do-doanh-thu-pnl
description: >-
  Bản đồ luồng Tài chính, Thu chi, ĐNTT, Công nợ, Doanh thu suất ăn & Báo cáo P&L CaterSoft 100% qua giao diện Web (CS-TC-17, CS-TC-18, CS-TC-01..30, CS-DTP-01..09, CS-BC-01..08).
  Đọc đầu tiên trước khi lập ĐNTT, ghi sổ quỹ, chốt công nợ, nhập phần ăn tính doanh thu hoặc kiểm tra số dư quỹ & KQKD / P&L bị lệch.
---

# Bản đồ Luồng Thu chi, ĐNTT, Công nợ & Báo cáo P&L (UI-Only)

> Mọi thao tác đều **100% qua giao diện Web CaterSoft**. Hướng dẫn gốc: `https://guide.catersoft.vn`.
> Quy tắc DOM chi tiết: đọc thêm `QUY-TAC-BAT-BUOC.md` cùng thư mục (Antigravity đã tự nạp qua `rules/AGENTS.md`).

## 1. Bốn chặng chuẩn từ Danh mục tài chính tới Báo cáo P&L

| Bước | Chặng | Thao tác chính trên UI | Kỹ năng đi kèm |
| :-: | :--- | :--- | :--- |
| 1 | Danh mục tài chính & ĐNTT | Khai **Tài khoản ngân hàng** (`CS-DLC-05`), **Phương thức thanh toán** (`CS-DLC-17`), **Danh mục kế toán** (`CS-TC-03`), và lập / duyệt **Đề nghị thanh toán (ĐNTT)** (`CS-TC-04`, `CS-TC-05`, `CS-TC-06`) | `cs-ui-danh-muc-va-dntt` |
| 2 | Sổ quỹ & Công nợ | Ghi nhận **Phiếu thu / Phiếu chi / Nhật ký quỹ** (`CS-TC-08`, `CS-TC-01`), xử lý **Thu chưa xác định**, lập **Phiếu công nợ & Đề nghị thu** (`CS-MH-22`, `CS-TC-24`, `CS-TC-25`), theo dõi **Sổ công nợ / Tuổi nợ / Lịch thu chi / Biên bản đối chiếu** (`CS-TC-07`, `CS-TC-26..30`) | `cs-ui-so-quy-thu-chi-cong-no` |
| 3 | Giá KH & Doanh thu suất ăn | Quản lý **Khách hàng & Nơi phục vụ** (`CS-DLC-06`, `CS-DTP-07`, `CS-DTP-04`), **Bảng giá KH** (`CS-DLC-06B`, `CS-DTP-08`, `CS-DTP-09`), **Thiết lập & Nhập phần ăn thực tế** (`CS-DTP-03`, `CS-DTP-01B`, `CS-DTP-01`, `CS-DTP-02`), đối soát vs dự trù (`CS-TDT-15`) | `cs-ui-doanh-thu-suat-an-gia-kh` |
| 4 | Cấu hình & Báo cáo P&L | Thiết lập **Cấu hình P&L 3 phần** (`CS-QTH-01B`), **Điểm kinh doanh P&L** (`CS-DLC-19`), xem **KQKD / P&L** (`CS-BC-02`, `CS-BC-01`, `CS-BC-08`), **Báo cáo cơm** (`CS-BC-04`, `CS-BC-05`, `CS-BC-07`), và **Kế toán thuế / Xuất bút toán** (`CS-TC-15`, `CS-TC-14`) | `cs-ui-bao-cao-kqkd-pnl` |

> Sơ đồ điều hướng trực quan trong phần mềm: **Quy trình Kế toán** (`/accounting`, `CS-TC-17`) và **Quy trình Thu chi & Công nợ** (`/thu-chi-cong-no`, `CS-TC-18`).

## 2. Chẩn đoán nhanh 5 sai lệch tài chính thường gặp (100% trên UI)

| STT | Tên ngắn | Triệu chứng trên giao diện | Cách truy ngược & khắc phục trên UI |
| :-: | :--- | :--- | :--- |
| 1 | Số dư quỹ lệch | Tiền mặt hoặc tài khoản NH hiển thị lệch với sao kê | Mở **Nhật ký quỹ / Thu chi (`CS-TC-08`)** kiểm tra: (a) bộ lọc Quỹ / Tài khoản đúng chưa, (b) có giao dịch chuyển quỹ nội bộ ghi trùng/thiếu đối ứng không, (c) có ĐNTT chuyển trạng thái *Đã thanh toán* tự sinh phiếu chi cần đối soát không |
| 2 | Doanh thu suất ăn = 0 | Báo cáo `CS-DTP-02` hoặc P&L không hiện tiền bán suất ăn | Kiểm tra **Phần ăn thực tế (`CS-DTP-01` / `CS-DTP-01B`)** xem đã nhập số suất thực tế chưa và **Giá KH theo tháng (`CS-DTP-08` / `CS-DTP-09`)** đã có đơn giá tháng cho đúng Nơi phục vụ / Khách hàng chưa |
| 3 | P&L thiếu chi phí/doanh thu | Tổng lãi lỗ thiếu một nhóm thu hoặc chi | Mở **Cấu hình báo cáo P&L (`CS-QTH-01B`)** và **Danh mục kế toán (`CS-TC-03`)** xem hạng mục dòng tiền đã được gán vào nhóm nào trong 3 phần (Doanh thu · Giá vốn · Chi phí vận hành) |
| 4 | Công nợ không trừ | Đã lập phiếu chi/thu nhưng `CS-TC-26` / `CS-TC-27` chưa giảm nợ | Mở phiếu thu/chi (`CS-TC-08`) hoặc **Đối chiếu công nợ (`CS-TC-07`)** kiểm tra xem giao dịch đã gắn đúng **Đối tượng công nợ (NCC/KH)** và **Kỳ công nợ / Phiếu nợ** hay đang nằm ở *Thu chưa xác định* |
| 5 | Lỗi chuyển trạng thái ĐNTT | Không bấm được «Đã thanh toán» trên `CS-TC-04` | Kiểm tra quy trình duyệt: ĐNTT thường đi từ *Nháp / Chờ duyệt → Đã duyệt → Đã thanh toán*; đồng thời kiểm tra đã chọn **Phương thức thanh toán / TK chi** hợp lệ chưa |
