---
name: cs-ui-mua-hang-kho-kiem-ke
description: >-
  Quản lý Mua hàng (Đề xuất mua PR V2/V1, Tổng hợp PR, Đơn mua PO, Gộp/Tách/Gửi mail/Điều chỉnh PO, Giao nhận nhập kho từ PO) và Quản lý Kho bình quân (Giao dịch nhập xuất, Tồn kho, Thẻ kho, Phiếu xuất kho, Xuất dùng ngày, Chuyển kho, Kiểm kê & Đặt lại tồn, Khóa kỳ NXT) qua Giao diện Web và tra cứu MCP Giai đoạn 1.
---

# Kỹ năng UI: Mua hàng (PR/PO), Nhập – Xuất – Chuyển kho & Kiểm kê

> **Quy tắc bắt buộc (An toàn MCP OAuth 2.1 & UI):** Trên Claude Code và Codex, luôn đọc thêm file `../cs-ui-ban-do-thuc-don-du-tru/QUY-TAC-BAT-BUOC.md` trước khi thao tác hoặc gọi công cụ MCP (Antigravity nạp sẵn qua `rules/AGENTS.md`).

> Đọc `cs-ui-ban-do-thuc-don-du-tru` trước. Cần có sẵn Kho (`CS-DLC-04`), Nhà cung cấp (`CS-DLC-07`) và Bảng giá NCC (`CS-MH-13`) trước khi lên chứng từ.
> Tài liệu hướng dẫn: `https://guide.catersoft.vn/mua-hang-kho` và `https://catersoft.app/llms-inventory.txt`.

## 1. Phạm vi MCP Giai đoạn 1 vs Giao diện Web

| STT | Tác vụ | Được phép qua MCP Giai đoạn 1 | Bắt buộc thao tác trên Giao diện Web |
| :-: | :--- | :--- | :--- |
| 1 | Kho & Nhà cung cấp | Đọc `cs_warehouses_list`, tạo/sửa NCC `cs_suppliers_list/get/create/update` | Khai Bảng giá NCC theo tháng (`CS-MH-13`), Tên bảng giá NCC |
| 2 | Đề xuất mua (PR) & Đơn mua (PO) | Chỉ đọc PO qua `cs_purchase_orders_list`, `cs_purchase_order_get` | Tạo/duyệt PR (`CS-PDX-01`, `02`), Tổng hợp PR→PO (`CS-MH-01`), Tạo/Sửa/Tách/Gộp/Gửi mail PO |
| 3 | Nhập – Xuất – Chuyển – Kiểm kê kho | Chỉ đọc tồn hiện tại qua `cs_inventory_balances_list` | Giao nhận PO nhập kho, Phiếu xuất, Chuyển kho, Kiểm kê & Đặt lại tồn, Khóa kỳ NXT |

## 2. Bản đồ màn hình Mua hàng & Kho bình quân

| STT | Tên ngắn | Tên trên menu | Đường dẫn | Mã trang | Dùng để |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | Quy trình Mua Hàng | Quy trình Mua Hàng | `/inventory/purchase-order` | `CS-MH-19` | Toàn cảnh luồng Đề xuất mua → Đơn mua → Giao nhận |
| 2 | Tạo PR V2 | Tạo phiếu đề xuất (V2) | `/inventory/create-purchase-request-v2` | `CS-PDX-01` | Lập phiếu đề xuất mua hàng mới (nhập tay hoặc lấy từ dự trù) |
| 3 | DS PR | Danh sách đề xuất mua | `/inventory/purchase-requests` | `CS-PDX-04` | Theo dõi, lọc và duyệt đề xuất mua |
| 4 | Tạo PO (Đơn giản) | Tạo đơn đặt hàng (PO) | `/inventory/purchase-orders-simple/create-simple` | `CS-MH-11` | Tạo nhanh đơn đặt hàng một NCC hoặc nhiều NCC (`CS-MH-23`) |
| 5 | DS PO (Đơn giản / V2) | Đơn đặt hàng (PO) / Quản lý đơn mua V2 | `/inventory/purchase-orders-simple`, `/inventory/purchase-orders-v2` | `CS-MH-12`, `CS-MH-03` | Quản lý trạng thái PO, mở chi tiết, xác nhận đặt hàng |
| 6 | Giao nhận & Nhập kho | Bảng kê giao nhận / Nhập kho từ PO | `/inventory/purchase-orders-simple/goods-receipt`, `/inventory/goods-receipt-v2` | `CS-MH-21`, `CS-QLK-01` | Ghi nhận số thực nhận đối chiếu NCC và chốt nhập kho từ PO |
| 7 | Tách / Gộp / Gửi mail PO | Xử lý đơn đặt hàng | `/inventory/split-purchase-order`, `/inventory/purchase-order-merge`, `/inventory/purchase-order-mail` | `CS-MH-05`, `CS-MH-04`, `CS-MH-10` | Tách PO nhiều đợt, gộp nhiều PO nháp, gửi mail PO cho NCC |
| 8 | Quản lý Kho | Giao dịch nhập xuất / Tồn kho / Xuất dùng | `/inventory`, `/inventory/stock-transactions`, `/inventory/stock-balance`, `/inventory/daily-issues` | `CS-QLK-17`, `CS-QLK-06`, `CS-QLK-09`, `CS-NXT-10` | Xem mọi phiếu nhập/xuất, tra số dư tồn và ghi nhận xuất bếp ngày |
| 9 | Xuất kho & Chuyển kho | Phiếu xuất kho / Phiếu chuyển kho | `/inventory/stock-out-vouchers`, `/inventory/stock-transfer-vouchers` | `CS-NXT-04`, `CS-NXT-02` | Lập phiếu xuất theo bộ phận hoặc điều chuyển hàng giữa hai kho |
| 10 | Kiểm kê & Khóa kỳ | Phiếu kiểm kê / Chi tiết NXT | `/inventory/stocktaking-records`, `/inventory/stock-movements/detail` | `CS-NXT-03`, `CS-NXT-01` | Ghi nhận số đếm thực tế, đối chiếu chênh lệch và xem báo cáo NXT |

> Lưu ý: Kiểm tra menu sidebar của công ty đang bật bộ **V2**, **Simple** hay **Chuẩn** để đi đúng bộ màn hình công ty đang dùng.

## 3. Quy trình thực hiện trên Giao diện Web

1. **Từ Dự trù sang Đề xuất / Đơn mua:**
   - Kiểm tra giá mua trước ở Bảng giá NCC theo tháng để tránh đơn giá bằng 0.
   - Khi tổng hợp PR sang PO hoặc tạo PO mới, chọn đúng **Kho nhận hàng**, **Ngày giao** và đối chiếu **Số lượng theo ĐVT mua**.
2. **Giao nhận hàng hóa từ PO (`CS-MH-21`, `CS-QLK-01`):**
   - Nhập đúng **Số lượng thực nhận** theo phiếu cân/giao hàng (click ô số `EditableAntdNumberRenderer` → gõ → `Enter`).
   - Trước khi bấm **Xác nhận đã giao** / **Hoàn thành & Nhập kho** hoặc **Gửi email PO (`CS-MH-10`)**, phải đọc rõ mã PO, NCC, tổng tiền và **dừng lại hỏi xác nhận người dùng**.
3. **Kiểm kê, Đặt lại tồn & Khóa kỳ:**
   - Lập phiếu kiểm kê (`CS-NXT-03`), gõ số đếm thực tế, bấm **«Lưu thay đổi»** và kiểm cột *Chênh lệch*.
   - Tuyệt đối **dừng lại hỏi xác nhận người dùng** trước khi bấm chốt đặt lại tồn hoặc khóa/mở khóa kỳ NXT vì thao tác ảnh hưởng trực tiếp giá vốn và số dư kho.
4. **Đọc lại bằng mắt sau khi ghi:** Mở **Giao dịch nhập xuất (`CS-QLK-06`)** hoặc **Tồn kho (`CS-QLK-09`)** kiểm chứng phiếu vừa sinh và số tồn cập nhật.
