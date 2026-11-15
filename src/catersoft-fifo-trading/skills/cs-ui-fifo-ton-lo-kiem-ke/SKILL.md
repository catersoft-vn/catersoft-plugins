---
name: cs-ui-fifo-ton-lo-kiem-ke
description: >-
  Tra cứu Tồn kho FIFO theo lô (CS-FIFO-05), Chi tiết lô theo mã ngắn (CS-FIFO-17), Giao dịch nhập/xuất & Chuyển kho nội bộ FIFO (CS-FIFO-04, CS-FIFO-19, CS-FIFO-20), Kiểm kê & Áp đặt lại tồn lô (CS-FIFO-03, CS-FIFO-21) và Chứng từ FIFO đã xóa (CS-FIFO-18) 100% qua Web UI CaterSoft.
  Dùng khi kiểm tồn lô, xem lịch sử tiêu thụ 1 lô, điều chuyển kho FIFO, kiểm kê chốt tồn theo lô hoặc khôi phục đơn đã xóa.
---

# Kỹ năng UI: Tồn theo lô, Truy vết mã lô, Điều chuyển & Kiểm kê FIFO

> Đọc `cs-ui-ban-do-fifo-trading` trước. Hướng dẫn chính thức: `https://guide.catersoft.vn/mua-hang-kho/kho-fifo-mua-ban-kiem-ke`.

## 1. Bản đồ màn hình

| STT | Tên ngắn | Tên trên menu | Đường dẫn | Mã trang | Dùng để |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | Tồn kho FIFO | Tồn kho FIFO | `/inventory-fifo/stock-balance` | `CS-FIFO-05` | Xem danh sách tất cả lô hàng đang còn tồn (tồn đầu, nhập, xuất, còn lại, NSX/HSD) |
| 2 | Chi tiết mã lô | Chi tiết lô hàng | `/inventory-fifo/batches/$shortCode` | `CS-FIFO-17` | Truy vết nguồn PO nhập lô & toàn bộ các chứng từ SO/xuất kho đã tiêu thụ lô đó |
| 3 | Nhập/xuất FIFO | Phiếu nhập/xuất kho | `/inventory-fifo/stock-transactions` | `CS-FIFO-04` | Danh sách phiếu nhập/xuất/điều chỉnh FIFO |
| 4 | Tạo phiếu kho | Chi tiết phiếu xuất/nhập kho | `/inventory-fifo/stock-transactions/create/$stockTransactionId` | `CS-FIFO-19` | Tạo hoặc xem/sửa chi tiết từng dòng lô của phiếu kho FIFO |
| 5 | Chuyển kho FIFO | Chuyển kho nội bộ | `/inventory-fifo/stock-transactions/stock-transfer` | `CS-FIFO-20` | Điều chuyển hàng hóa giữa các kho FIFO mà giữ nguyên truy vết lô |
| 6 | Phiếu kiểm FIFO | Phiếu kiểm kho | `/inventory-fifo/stocktaking-records` | `CS-FIFO-03` | Danh sách & tạo phiếu kiểm kê kho theo lô |
| 7 | Chi tiết kiểm lô | Chi tiết kiểm kê kho | `/inventory-fifo/stocktaking-records/$stocktakingRecordId` | `CS-FIFO-21` | Nhập số đếm thực tế cho từng lô hàng và áp dụng đặt lại tồn FIFO |
| 8 | Thùng rác FIFO | Chứng từ FIFO đã xóa | `/inventory-fifo/orders/trash` | `CS-FIFO-18` | Xem và khôi phục PO/SO FIFO đã đưa vào thùng rác (xóa mềm) |

## 2. Truy vết lô & Kiểm kê theo lô (`CS-FIFO-05`, `CS-FIFO-17`, `CS-FIFO-21`)

1. **Truy vết một lô (`CS-FIFO-05` → `CS-FIFO-17`):**
   - Tại **Tồn kho FIFO (`CS-FIFO-05`)**, lọc theo Kho hoặc Mặt hàng (hoặc bật chế độ xem lô sắp hết hạn).
   - Bấm trực tiếp vào **mã lô ngắn (`shortCode`)** (hoặc quét QR chuyển hướng tới `/inventory-fifo/batches/$shortCode`) để mở `CS-FIFO-17` và xem lịch sử tiêu thụ từng chứng từ.
2. **Điều chuyển kho FIFO (`CS-FIFO-20`):**
   - Chọn **Kho xuất** và **Kho nhận** khác nhau → chọn mặt hàng & lô cần chuyển → nhập số lượng → bấm **Tạo phiếu chuyển**. Kiểm tra lại ở `CS-FIFO-05` trên cả hai kho.
3. **Kiểm kê & Đặt lại tồn theo lô (`CS-FIFO-03` → `CS-FIFO-21`):**
   - Tạo phiếu kiểm kho chọn **Kho** và **Ngày chốt kiểm**.
   - Mở chi tiết (`CS-FIFO-21`): nhập **Tồn thực tế** trên từng dòng lô bằng click-gõ-`Enter`, bấm **«Lưu thay đổi»**.
   - **Hỏi xác nhận người dùng** trước khi bấm **Áp dụng đặt lại tồn**, sau đó kiểm tra lại `CS-FIFO-05` khớp với số đếm thực tế.
4. **Khôi phục đơn xóa nhầm (`CS-FIFO-18`):** Vào `/inventory-fifo/orders/trash`, tìm đúng mã chứng từ và dùng nút **Khôi phục** trên giao diện.
