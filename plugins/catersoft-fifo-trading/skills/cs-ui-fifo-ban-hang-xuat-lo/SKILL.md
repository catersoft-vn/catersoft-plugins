---
name: cs-ui-fifo-ban-hang-xuat-lo
description: >-
  Quản lý Đơn bán hàng FIFO (CS-FIFO-08), Tạo đơn bán theo bảng giá tháng/KH (CS-FIFO-09, CS-FIFO-10), Tổng hợp đơn bán & Bảng kê hàng hóa bán (CS-FIFO-11, CS-FIFO-12) và Công nợ KH FIFO theo ngày/tháng (CS-FIFO-13, CS-FIFO-14) 100% qua Web UI CaterSoft.
  Dùng khi lên SO xuất bán FIFO theo lô, xem chi tiết phân bổ trừ lô và kiểm tra công nợ khách hàng.
---

# Kỹ năng UI: Bán hàng FIFO, Bảng kê giao & Công nợ Khách hàng

> **Quy tắc bắt buộc (100% UI-Only & 7 Quy tắc Vàng DOM):** Trên Claude Code và Codex, luôn đọc thêm file `../cs-ui-ban-do-fifo-trading/QUY-TAC-BAT-BUOC.md` trước khi thao tác trình duyệt (Antigravity nạp sẵn qua `rules/AGENTS.md`).

> Đọc `cs-ui-ban-do-fifo-trading` trước. Kho FIFO phải có tồn lô khả dụng (`cs-ui-fifo-ton-lo-kiem-ke`).
> Hướng dẫn chính thức: `https://guide.catersoft.vn/mua-hang-kho/kho-fifo-mua-ban-kiem-ke`.

## 1. Bản đồ màn hình

| STT | Tên ngắn | Tên trên menu | Đường dẫn | Mã trang | Dùng để |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | Đơn bán SO FIFO | Đơn bán hàng | `/inventory-fifo/sales-orders` | `CS-FIFO-08` | Danh sách SO FIFO, xem trạng thái, xác nhận giao & theo dõi trừ lô tự động |
| 2 | Tạo SO giá tháng | Tạo đơn bán theo bảng giá tháng | `/inventory-fifo/sales-orders/create-monthly-price` | `CS-FIFO-09` | Tạo nhanh SO áp đơn giá theo bảng giá tháng của khách hàng |
| 3 | Tạo SO bảng giá | Tạo đơn bán theo bảng giá KH (FIFO) | `/inventory-fifo/sales-orders/create-pricing-name` | `CS-FIFO-10` | Tạo SO áp theo nhóm tên bảng giá KH & xuất kho theo lô FIFO |
| 4 | Tổng hợp SO | Tổng hợp đơn bán hàng | `/inventory-fifo/sales-orders/summary` | `CS-FIFO-11` | Bảng tổng hợp số lượng, doanh số & trạng thái các SO trong kỳ |
| 5 | Bảng kê bán | Bảng kê hàng hóa bán | `/inventory-fifo/sales-orders/goods-manifest` | `CS-FIFO-12` | Bảng kê chi tiết từng mặt hàng / lô đã giao cho khách hàng |
| 6 | Công nợ KH ngày | Công nợ KH theo ngày | `/inventory-fifo/sales-orders/customer-debt-daily` | `CS-FIFO-13` | Theo dõi phát sinh phải thu theo từng ngày & đơn bán SO |
| 7 | Công nợ KH tháng | Công nợ KH theo tháng | `/inventory-fifo/sales-orders/customer-debt-monthly` | `CS-FIFO-14` | Tổng hợp công nợ phải thu khách hàng FIFO theo kỳ tháng |

## 2. Lập SO & Xuất lô FIFO (`CS-FIFO-08`, `CS-FIFO-09`, `CS-FIFO-10`)

1. **Chọn màn hình tạo SO phù hợp:**
   - Nếu công ty áp giá tháng theo khách: dùng **Tạo đơn bán theo bảng giá tháng (`CS-FIFO-09`)**.
   - Nếu áp theo tên bảng giá riêng của nhóm khách: dùng **Tạo đơn bán theo bảng giá KH (`CS-FIFO-10`)**.
   - Có thể mở trực tiếp từ **Đơn bán hàng (`CS-FIFO-08`)** bằng nút thêm mới trên thanh công cụ.
2. **Điền thông tin SO:** Chọn **Khách hàng**, **Kho FIFO xuất**, **Ngày giao** → chọn mặt hàng và nhập số lượng đặt (`EditableAntdNumberRenderer`, nhấn `Enter`). Kiểm tra đơn giá tự đổ và thành tiền dòng.
3. **Xuất kho trừ lô FIFO:**
   - Hệ thống tự ưu tiên phân bổ trừ từ lô nhập trước / HSD gần trước theo quy tắc FIFO/FEFO.
   - Mở `CollapseV2` / chi tiết SO kiểm tra danh sách các mã lô ngắn (`shortCode`) và số lượng trừ từng lô.
   - **Hỏi xác nhận người dùng** trước khi bấm nút **Xuất kho / Xác nhận đã giao / Hoàn thành** trên SO (`CS-FIFO-08`).
4. **Kiểm tra sau khi xuất:** Mở **Bảng kê hàng hóa bán (`CS-FIFO-12`)** và **Công nợ KH theo ngày (`CS-FIFO-13`)** để xác nhận đơn bán đã ghi nhận đủ doanh thu, lô xuất và công nợ.
