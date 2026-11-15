---
name: cs-ui-danh-muc-va-dntt
description: >-
  Thiết lập Tài khoản ngân hàng (CS-DLC-05), Phương thức thanh toán (CS-DLC-17), Danh mục kế toán & dòng tiền (CS-TC-03), và Tạo / Duyệt / Theo dõi Đề nghị thanh toán ĐNTT (CS-TC-04, CS-TC-05, CS-TC-06) 100% qua Web UI CaterSoft.
  Dùng khi khai quỹ/TK ngân hàng, thêm khoản mục chi/thu, lập ĐNTT tạm ứng/hoàn ứng/thanh toán NCC hoặc theo dõi trạng thái duyệt ĐNTT.
---

# Kỹ năng UI: Danh mục Tài chính & Đề nghị Thanh toán (ĐNTT)

> Đọc `cs-ui-ban-do-doanh-thu-pnl` trước.

## 1. Bản đồ màn hình

| STT | Tên ngắn | Tên trên menu | Đường dẫn | Mã trang | Dùng để |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | TK Ngân hàng | Tài khoản ngân hàng | `/settings/bank-accounts` | `CS-DLC-05` | Khai số tài khoản, tên ngân hàng, chủ tài khoản, trạng thái nhận/chi |
| 2 | PT Thanh toán | Phương thức thanh toán | `/settings/payment-methods` | `CS-DLC-17` | Khai Tiền mặt, Chuyển khoản, Ví/Thẻ và liên kết tài khoản tương ứng |
| 3 | Danh mục KT | Danh mục kế toán | `/accounting/categories` | `CS-TC-03` | Tab dòng tiền (`/cash-flow`), phương thức (`/methods`), giai đoạn thanh toán (`/stages`) |
| 4 | DS ĐNTT | Phiếu đề nghị thanh toán | `/accounting/payment-requests` | `CS-TC-04` | Danh sách toàn bộ ĐNTT, lọc trạng thái, duyệt / từ chối / thanh toán |
| 5 | Tạo ĐNTT | Tạo phiếu đề nghị | `/accounting/payment-requests/create` | `CS-TC-05` | Lập mới ĐNTT thanh toán NCC, chi phí vận hành, tạm ứng hoặc hoàn ứng |
| 6 | ĐNTT của tôi | Phiếu đề nghị của tôi | `/accounting/payment-requests/my` | `CS-TC-06` | Theo dõi riêng các ĐNTT do tài khoản hiện tại đề xuất |

## 2. Thiết lập Danh mục tài chính trước khi phát sinh Thu/Chi

1. **Tài khoản ngân hàng (`CS-DLC-05`):** Thêm mới đầy đủ *Tên gợi nhớ*, *Ngân hàng*, *Số tài khoản*, *Chủ tài khoản* — giữ bật hoạt động để hiện trong dropdown khi lập ĐNTT và Sổ quỹ.
2. **Phương thức thanh toán (`CS-DLC-17`):** Xác nhận có đủ nhóm Tiền mặt & Chuyển khoản ngân hàng đang dùng tại công ty.
3. **Danh mục kế toán (`CS-TC-03`):** Kiểm tra danh sách hạng mục thu/chi tại tab **Dòng tiền (`/accounting/categories/cash-flow`)**. Phân nhóm rõ ràng giúp Báo cáo P&L tổng hợp đúng khoản mục thay vì rơi vào «Khác».

## 3. Lập, Duyệt & Thanh toán ĐNTT trên UI (`CS-TC-05`, `CS-TC-04`)

1. **Tạo phiếu ĐNTT (`CS-TC-05`):**
   - Chọn **Loại đề nghị** (Thanh toán NCC / Chi phí / Tạm ứng / Hoàn ứng), **Người nhận / NCC**, **Ngày đề nghị / Hạn thanh toán**.
   - Chọn **Hạng mục chi (`CS-TC-03`)**, **Bếp / Bộ phận chịu chi phí**, nhập từng dòng nội dung & **Số tiền** chính xác, kèm chứng từ tham chiếu / mô tả nếu có.
   - Bấm **Lưu nháp** hoặc **Gửi duyệt**; đọc lại trên `CS-TC-06` hoặc `CS-TC-04`.
2. **Duyệt & Xác nhận Đã thanh toán (`CS-TC-04`):**
   - Lọc theo trạng thái *Chờ duyệt* → mở chi tiết đối chiếu số tiền, hạn thanh toán và hạng mục.
   - Khi chuyển sang **Đã thanh toán**: chọn đúng **Tài khoản chi / Quỹ tiền mặt** và **Ngày chi thực tế**.
   - **Bắt buộc hỏi xác nhận người dùng** trước khi bấm **Duyệt** hoặc **Xác nhận Đã thanh toán** (vì nút này chốt nghĩa vụ chi tiền và có thể tự sinh phiếu chi vào Sổ quỹ).
3. **Kiểm chứng lại:** Sau khi ĐNTT chuyển *Đã thanh toán*, mở **Sổ quỹ (`CS-TC-08`)** kiểm tra phiếu chi đã lên sổ đúng số tiền và tài khoản chưa.
