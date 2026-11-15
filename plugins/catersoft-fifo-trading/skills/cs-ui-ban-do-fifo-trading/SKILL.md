---
name: cs-ui-ban-do-fifo-trading
description: >-
  Bản đồ luồng Kho FIFO & Thương mại CaterSoft 100% qua giao diện Web (CS-FIFO-06, CS-QLK-19..20, CS-MH-20, CS-FIFO-01..24).
  Đọc đầu tiên trước khi thao tác Kho FIFO theo lô (NSX/HSD), nhập đơn PO người mua sang SO bán hàng, nhận hàng tạo lô hoặc kiểm kê theo lô.
---

# Bản đồ Luồng Kho FIFO & Thương mại (UI-Only)

> Mọi thao tác đều **100% qua giao diện Web CaterSoft**. Hướng dẫn gốc: `https://guide.catersoft.vn/mua-hang-kho/kho-fifo-mua-ban-kiem-ke` và `https://guide.catersoft.vn/mua-hang-kho/nhap-don-tu-doi-tac`.
> Quy tắc DOM chi tiết: đọc thêm `QUY-TAC-BAT-BUOC.md` cùng thư mục (Antigravity đã tự nạp qua `rules/AGENTS.md`).

## 1. Năm chặng chuẩn của luồng Kho FIFO & Thương mại

| Bước | Chặng | Thao tác chính trên UI | Kỹ năng đi kèm |
| :-: | :--- | :--- | :--- |
| 1 | Ánh xạ đối tác & mặt hàng | Ánh xạ **Đối tác** (`CS-QLK-20`), **Mặt hàng thương mại** (`CS-QLK-19`) và **Nhập đơn từ đối tác (PO→SO)** (`CS-MH-20`) | `cs-ui-anh-xa-doi-tac-po-so` |
| 2 | Danh mục & Mua tạo lô | Khai **Nhà sản xuất** (`CS-FIFO-07`), **Đề nghị mua FIFO** (`CS-FIFO-02`), **Tạo / QL Đơn mua FIFO** (`CS-FIFO-15`, `CS-FIFO-01`), **Nhận lô (NSX/HSD)** trên **Bảng kê thu mua** (`CS-FIFO-16`) & theo dõi nợ NCC (`CS-FIFO-22..24`) | `cs-ui-fifo-mua-hang-nhan-lo` |
| 3 | Bán hàng & Xuất lô FIFO | Tạo **Đơn bán hàng SO** (`CS-FIFO-08`, `CS-FIFO-09`, `CS-FIFO-10`), theo dõi **Tổng hợp & Bảng kê bán** (`CS-FIFO-11`, `CS-FIFO-12`) & công nợ KH (`CS-FIFO-13`, `CS-FIFO-14`) | `cs-ui-fifo-ban-hang-xuat-lo` |
| 4 | Nhập / Xuất / Điều chuyển | Ghi **Phiếu nhập/xuất kho FIFO** (`CS-FIFO-04`, `CS-FIFO-19`) và **Chuyển kho nội bộ FIFO** (`CS-FIFO-20`) | `cs-ui-fifo-ton-lo-kiem-ke` |
| 5 | Tồn lô, Truy vết & Kiểm kê | Tra **Tồn kho FIFO** (`CS-FIFO-05`), mở **Chi tiết lô (`shortCode`)** (`CS-FIFO-17`), **Kiểm kê & Chốt áp tồn lô** (`CS-FIFO-03`, `CS-FIFO-21`), xử lý **Thùng rác đơn FIFO** (`CS-FIFO-18`) | `cs-ui-fifo-ton-lo-kiem-ke` |

## 2. Chẩn đoán nhanh 5 lỗi thường gặp (100% trên UI)

| STT | Tên ngắn | Triệu chứng trên giao diện | Cách kiểm tra & xử lý trên UI |
| :-: | :--- | :--- | :--- |
| 1 | Nhập PO→SO báo chưa khớp | Dòng mặt hàng hoặc đối tác trên `CS-MH-20` báo thiếu ánh xạ | Mở **Ánh xạ đối tác (`CS-QLK-20`)** và **Ánh xạ hàng hóa (`CS-QLK-19`)** ghép đủ trước khi tạo SO |
| 2 | Không đủ tồn xuất SO FIFO | Tạo SO nhưng tồn khả dụng theo lô không đủ xuất | Kiểm tra **Tồn kho FIFO (`CS-FIFO-05`)**: có thể PO mua vào chưa chuyển trạng thái **Nhận hàng / Nhập lô** (`CS-FIFO-01` / `CS-FIFO-16`) hoặc chọn nhầm Kho xuất |
| 3 | Lô sai Hạn sử dụng | Lô mới nhập hiển thị sai HSD khi xuất FEFO/FIFO | Mở **Chi tiết lô (`CS-FIFO-17`)** bằng click vào mã lô ngắn (`shortCode`) trên `CS-FIFO-05` hoặc quay lại phiếu nhận kiểm tra ngày NSX/HSD |
| 4 | Thiếu giá bán khi lên SO | Chọn mặt hàng trên `CS-FIFO-09` / `CS-FIFO-10` nhưng đơn giá bằng 0 | Kiểm tra bộ **Bảng giá khách hàng theo tháng / theo tên bảng giá** đã cấu hình hiệu lực trong tháng cho đúng KH chưa |
| 5 | Chứng từ xóa nhầm | Cần khôi phục PO hoặc SO FIFO vừa hủy | Vào **Chứng từ FIFO đã xóa (`/inventory-fifo/orders/trash`, `CS-FIFO-18`)** để xem và khôi phục bằng nút chuẩn |
