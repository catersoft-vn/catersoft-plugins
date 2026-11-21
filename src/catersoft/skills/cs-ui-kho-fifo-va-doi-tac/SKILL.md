---
name: cs-ui-kho-fifo-va-doi-tac
description: >-
  Vận hành luồng Kho FIFO theo lô hạn dùng (NSX/HSD) và đơn vị thương mại trên CaterSoft: Đề nghị & Đơn mua FIFO (CS-FIFO-02, CS-FIFO-01, CS-FIFO-15, CS-FIFO-16), Bán hàng SO & Xuất lô FEFO (CS-FIFO-08..12), Nhập/Xuất/Chuyển/Kiểm kho FIFO (CS-FIFO-04, CS-FIFO-20, CS-FIFO-03), Nhập đơn từ đối tác PO→SO (CS-MH-20) và Công nợ NCC/KH theo ngày tháng FIFO (CS-FIFO-13..14, CS-FIFO-22..24).
---

# Kỹ năng UI: Kho FIFO theo lô & Nhập đơn từ Đối tác

> Đọc `cs-ui-ban-do-thuc-don-du-tru` trước. Tài liệu chi tiết đường dẫn và mã chức năng: `https://catersoft.app/llms-inventory.txt` và `https://guide.catersoft.vn/mua-hang-kho/kho-fifo-mua-ban-kiem-ke`.

## 1. Phạm vi MCP Giai đoạn 1 vs Giao diện Web

| STT | Tác vụ | Được phép qua MCP Giai đoạn 1 | Bắt buộc thao tác trên Giao diện Web |
| :-: | :--- | :--- | :--- |
| 1 | Kho & Nhà sản xuất / Đối tác | Chỉ đọc `cs_warehouses_list`, quản lý cơ bản `cs_suppliers_list`, `cs_supplier_get`, `cs_supplier_create`, `cs_supplier_update`, `cs_customers_list`, `cs_customer_get`, `cs_customer_create`, `cs_customer_update` | Khai **Nhà sản xuất (FIFO)** (`CS-FIFO-07`), cấu hình ánh xạ đối tác / mặt hàng cho `CS-MH-20` |
| 2 | Mua hàng & Nhận lô NSX/HSD | Không có công cụ ghi/nhận lô FIFO | Lập Đề nghị mua (`CS-FIFO-02`), Tạo/QL Đơn mua FIFO (`CS-FIFO-15`, `CS-FIFO-01`), **Bảng kê thu mua** (`CS-FIFO-16`) |
| 3 | Bán hàng SO & Kiểm kho FIFO | Không có công cụ tạo SO/xuất lô FIFO | Tạo Đơn bán (`CS-FIFO-09`, `CS-FIFO-10`), Tồn lô (`CS-FIFO-05`), Phiếu kho/Chuyển kho/Kiểm kho FIFO |

## 2. Bản đồ màn hình Kho FIFO & Thương mại

| STT | Tên ngắn | Tên trên menu | Đường dẫn | Mã trang | Dùng để |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | Quy trình Kho FIFO | Quy trình Kho FIFO | `/inventory-fifo` | `CS-FIFO-06` | Sơ đồ luồng FIFO từ Mua nhận lô đến Bán xuất lô & Kiểm kê |
| 2 | Nhập đơn từ đối tác | Nhập đơn từ đối tác | `/inventory-fifo/buyer-po-import` | `CS-MH-20` | Đọc PO của đối tác mua và chuyển thành Đơn bán SO tương ứng |
| 3 | Nhà sản xuất | Nhà sản xuất (FIFO) | `/inventory-fifo/manufacturers` | `CS-FIFO-07` | Quản lý danh mục nhà sản xuất gắn trên từng lô nhập |
| 4 | Đề nghị & Đơn mua FIFO | Phiếu đề nghị / Đơn đặt hàng (FIFO) | `/inventory-fifo/purchase-requests`, `/inventory-fifo/purchase-orders`, `/inventory-fifo/purchase-orders/create` | `CS-FIFO-02`, `CS-FIFO-01`, `CS-FIFO-15` | Tạo PR/PO theo lô và theo dõi trạng thái nhận hàng |
| 5 | Bảng kê thu mua FIFO | Bảng kê thu mua hàng hóa (FIFO) | `/inventory-fifo/purchase-orders/goods-manifest` | `CS-FIFO-16` | Kiểm kê lô nhập kèm Ngày sản xuất (NSX) & Hạn sử dụng (HSD) |
| 6 | Đơn bán hàng FIFO | Đơn bán hàng & Tạo đơn theo bảng giá | `/inventory-fifo/sales-orders`, `/inventory-fifo/sales-orders/create-monthly-price`, `/inventory-fifo/sales-orders/create-pricing-name` | `CS-FIFO-08`, `CS-FIFO-09`, `CS-FIFO-10` | Lên đơn bán SO áp bảng giá tháng hoặc tên bảng giá KH và xuất lô |
| 7 | Tồn kho FIFO | Tồn kho FIFO | `/inventory-fifo/stock-balance` | `CS-FIFO-05` | Xem tồn theo từng mã lô, HSD và trạng thái sắp hết hạn |
| 8 | Giao dịch & Chuyển kho | Phiếu nhập/xuất & Chuyển kho nội bộ (FIFO) | `/inventory-fifo/stock-transactions`, `/inventory-fifo/stock-transactions/stock-transfer` | `CS-FIFO-04`, `CS-FIFO-20` | Lập phiếu nhập/xuất lẻ hoặc chuyển lô giữa hai kho |
| 9 | Kiểm kho FIFO | Phiếu kiểm kho (FIFO) | `/inventory-fifo/stocktaking-records` | `CS-FIFO-03` | Kiểm đếm số lượng theo từng lô hàng và đối soát chênh lệch |
| 10 | Công nợ NCC / KH FIFO | Công nợ NCC & KH (theo ngày / tháng) | `/inventory-fifo/purchase-orders/supplier-debt-daily`, `/inventory-fifo/sales-orders/customer-debt-daily` | `CS-FIFO-22`, `CS-FIFO-13` | Đối chiếu công nợ phải trả NCC và phải thu KH từ luồng FIFO |

## 3. Quy tắc vận hành bắt buộc trên Web UI

1. **Nhận hàng tạo lô đúng NSX / HSD:**
   - Kiểm tra đúng **Nhà sản xuất**, **Ngày sản xuất (NSX)** và **Hạn sử dụng (HSD)** trước khi xác nhận nhập lô trên PO FIFO (`CS-FIFO-01` / `CS-FIFO-16`). Sai HSD sẽ làm sai thứ tự xuất ưu tiên hạn ngắn (FEFO/FIFO).
2. **Xử lý khi SO FIFO báo không đủ tồn hoặc đơn giá = 0:**
   - Kiểm tra **Tồn kho FIFO (`CS-FIFO-05`)**: bảo đảm PO mua trước đó đã thực sự hoàn tất bước **Nhận hàng / Nhập lô** và chọn đúng **Kho xuất**.
   - Nếu đơn giá trên `CS-FIFO-09` / `CS-FIFO-10` bằng 0: kiểm tra bảng giá bán của khách hàng đang còn hiệu lực trong tháng hay chưa.
3. **Thao tác bắt buộc hỏi xác nhận người dùng trước khi bấm:**
   - Chốt áp **Kiểm kho FIFO (`CS-FIFO-03`)** đặt lại tồn lô.
   - Hủy/xóa mềm chứng từ PO hoặc SO FIFO (chứng từ đã hủy có thể khôi phục trong thùng rác đơn FIFO).
   - Luôn đọc lại dòng chứng từ và kiểm **Tồn kho FIFO (`CS-FIFO-05`)** sau khi lưu.
