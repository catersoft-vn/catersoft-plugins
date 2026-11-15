---
name: cs-ui-anh-xa-doi-tac-po-so
description: >-
  Ánh xạ đối tác thương mại (CS-QLK-20), Ánh xạ hàng hóa (CS-QLK-19) và Nhập đơn PO từ đối tác thành SO bán hàng (CS-MH-20) trên cả hai nhánh /inventory-fifo/* và /inventory/* qua Web UI CaterSoft.
  Dùng khi kết nối đơn mua từ công ty khách sang đơn bán thương mại hoặc sửa dòng chưa khớp mã hàng/ĐVT.
---

# Kỹ năng UI: Ánh xạ Đối tác, Hàng hóa & Nhập đơn PO → SO

> **Quy tắc bắt buộc (100% UI-Only & 7 Quy tắc Vàng DOM):** Trên Claude Code và Codex, luôn đọc thêm file `../cs-ui-ban-do-fifo-trading/QUY-TAC-BAT-BUOC.md` trước khi thao tác trình duyệt (Antigravity nạp sẵn qua `rules/AGENTS.md`).

> Đọc `cs-ui-ban-do-fifo-trading` trước. Hướng dẫn chính thức: `https://guide.catersoft.vn/mua-hang-kho/nhap-don-tu-doi-tac`.

## 1. Bản đồ màn hình (hỗ trợ cả 2 nhánh menu)

| STT | Tên ngắn | Tên trên menu | Đường dẫn (FIFO / Thường) | Mã trang | Dùng để |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | Ánh xạ đối tác | Ánh xạ đối tác | `/inventory-fifo/trading-partner-mappings` hoặc `/inventory/trading-partner-mappings` | `CS-QLK-20` | Ghép đối tác nguồn (khách mua) với hồ sơ Khách hàng trên công ty |
| 2 | Ánh xạ hàng hóa | Ánh xạ hàng hóa | `/inventory-fifo/trading-item-mappings` hoặc `/inventory/trading-item-mappings` | `CS-QLK-19` | Ghép mã/tên mặt hàng & ĐVT phía đối tác với mặt hàng nội bộ |
| 3 | Nhập đơn PO→SO | Nhập đơn từ đối tác | `/inventory-fifo/buyer-po-import` hoặc `/inventory/buyer-po-import` | `CS-MH-20` | Xem danh sách PO người mua gửi sang, đối soát ánh xạ và xác nhận sinh Đơn bán SO |

> Dùng đúng đường dẫn có trên sidebar của công ty đang thao tác (nhánh `/inventory-fifo/*` khi đi từ Kho FIFO, hoặc `/inventory/*` trên công ty dùng luồng Kho thường).

## 2. Quy trình Ánh xạ & Nhập đơn PO → SO (4 bước)

1. **Kiểm tra Ánh xạ đối tác (`CS-QLK-20`):**
   - Tìm tên đối tác nguồn → nếu chưa có bản ghi ghép, bấm thêm/chỉnh sửa để nối **Đối tác mua** sang **Khách hàng** tương ứng trong danh mục rồi lưu.
2. **Kiểm tra Ánh xạ hàng hóa (`CS-QLK-19`):**
   - Tìm dòng mặt hàng còn trạng thái *Chưa ánh xạ* → chọn **Mặt hàng nội bộ** khớp chính xác tên & đơn vị quy đổi → bấm **Lưu / Cập nhật**. Chú ý hệ số quy đổi nếu ĐVT đặt hàng của người mua khác ĐVT bán chuẩn.
3. **Đối soát trên Nhập đơn từ đối tác (`CS-MH-20`):**
   - Lọc theo **Ngày giao** và **Đối tác mua** để tải danh sách PO gửi sang.
   - Rà từng dòng sản phẩm: chắc chắn toàn bộ dòng đã xanh/khớp đủ đối tác, mặt hàng và đơn vị. Nếu còn dòng cảnh báo đỏ/chưa ghép, quay lại `CS-QLK-19` hoàn tất ghép trước.
4. **Xác nhận chuyển thành SO bán hàng:**
   - **Hỏi xác nhận người dùng** trước khi bấm nút **Nhập đơn / Tạo SO**. Chờ thông báo thành công, mở **Đơn bán hàng (`CS-FIFO-08`)** kiểm tra lại mã SO mới sinh và tổng tiền.
