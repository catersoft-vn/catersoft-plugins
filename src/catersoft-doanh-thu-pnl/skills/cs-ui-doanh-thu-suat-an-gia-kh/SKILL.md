---
name: cs-ui-doanh-thu-suat-an-gia-kh
description: >-
  Quản lý Khách hàng (CS-DLC-06, CS-DTP-07), Nơi phục vụ (CS-DTP-04), Bảng giá Khách hàng & Giá KH theo tháng (CS-DLC-06B, CS-DTP-08, CS-DTP-09), Thiết lập & Nhập phần ăn thực tế tính Doanh thu (CS-DTP-03, CS-DTP-01B, CS-DTP-01, CS-DTP-02) và Đối soát phần ăn vs dự trù (CS-TDT-15) 100% qua Web UI CaterSoft.
  Dùng khi thiết lập bảng giá bán suất ăn, nhập phần ăn thực tế chốt doanh thu ngày hoặc kiểm tra doanh thu suất ăn công nghiệp.
---

# Kỹ năng UI: Giá Khách hàng, Phần ăn thực tế & Doanh thu suất ăn

> Đọc `cs-ui-ban-do-doanh-thu-pnl` trước. Khách hàng, Nơi phục vụ và Bảng giá KH tháng phải sẵn sàng trước khi nhập phần ăn chốt doanh thu.

## 1. Bản đồ màn hình

| STT | Tên ngắn | Tên trên menu | Đường dẫn | Mã trang | Dùng để |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | Khách hàng | Danh sách khách hàng | `/customer/customers` | `CS-DLC-06` | Tạo/sửa hồ sơ khách hàng, thông tin liên hệ, hóa đơn |
| 2 | KH phần ăn | Khách hàng phần ăn | `/customer/meal-customers` | `CS-DTP-07` | Quản lý danh sách khách hàng thuộc mảng suất ăn công nghiệp |
| 3 | Nơi phục vụ | Nơi phục vụ | `/meal/meal-customer-types` | `CS-DTP-04` | Tạo/sửa các đối tượng/ca phục vụ tính giá & số suất (Công nhân, Chuyên gia…) |
| 4 | Bảng giá KH | Bảng giá khách hàng | `/customer/customer-pricings` | `CS-DLC-06B` | Cấu hình bảng giá chung gắn khách hàng |
| 5 | Giá KH tháng | Giá KH theo tháng | `/customer/customer-monthly-pricings` | `CS-DTP-08` | Quản lý đơn giá suất ăn / mặt hàng theo tháng cho khách |
| 6 | Lưới giá KH | Giá KH theo tháng (pivot) | `/customer/customer-monthly-pricings-grid` | `CS-DTP-09` | Nhập / sửa nhanh hàng loạt đơn giá tháng cho nhiều KH / Nơi phục vụ |
| 7 | TL Số phần ăn | Thiết lập số phần ăn | `/settings/actual-meal-servings-config` | `CS-DTP-03` | Khai báo các cột ca ăn · nơi phục vụ · loại phần ăn hiển thị khi nhập |
| 8 | Nhập phần ăn | Nhập phần ăn (pivot) | `/weekly-meal-plan/actual-meal-servings-pivot` | `CS-DTP-01` | Bảng lưới tự lưu nhập nhanh số phần ăn thực tế theo ngày & nơi phục vụ |
| 9 | Phần ăn thực tế | Phần ăn thực tế | `/weekly-meal-plan/actual-meal-servings` | `CS-DTP-01B` | Xem / chỉnh sửa chi tiết phần ăn thực tế theo ngày (nút «Lưu thay đổi») |
| 10 | Doanh thu SACN | Doanh thu suất ăn | `/weekly-meal-plan/actual-meal-servings-summary` | `CS-DTP-02` | Tổng hợp sản lượng suất ăn & doanh thu theo bếp, khách hàng, ngày |
| 11 | Đối soát suất | Đối soát phần ăn dự trù | `/weekly-meal-plan/report/meal-servings-comparison` | `CS-TDT-15` | So sánh số báo dự trù vs số phần ăn thực tế phục vụ để tìm chênh lệch |

## 2. Thứ tự thiết lập Giá bán Suất ăn (`CS-DLC-06` → `CS-DTP-09`)

1. **Khai Khách hàng (`CS-DLC-06` / `CS-DTP-07`) & Nơi phục vụ (`CS-DTP-04`):** Kiểm tra tên khách hàng, bếp phục vụ trực thuộc và từng nhóm *Nơi phục vụ* (ứng với từng mức giá bán suất).
2. **Thiết lập & Nhập giá KH theo tháng (`CS-DTP-08` / `CS-DTP-09`):**
   - Chọn **Tháng (`MM/YYYY`)**, **Khách hàng / Bếp**.
   - Click vào từng ô đơn giá trên lưới (`EditableAntdNumberRenderer`), gõ đơn giá bán chưa/có thuế đúng quy ước công ty, nhấn `Enter`.
   - **Hỏi xác nhận người dùng** nếu sửa hàng loạt trên nhiều khách hàng rồi mới bấm **«Lưu thay đổi»**.

## 3. Nhập Phần ăn thực tế & Chốt Doanh thu (`CS-DTP-03` → `CS-DTP-01` → `CS-DTP-02`)

1. **Kiểm cấu hình (`CS-DTP-03`):** Nếu bảng nhập phần ăn thiếu cột ca ăn hoặc nơi phục vụ mới, mở `/settings/actual-meal-servings-config` bổ sung trước.
2. **Nhập số phần ăn (`CS-DTP-01` hoặc `CS-DTP-01B`):**
   - Chọn đúng **Bếp** và **Ngày** (`DD/MM/YYYY`).
   - Tại **`CS-DTP-01` (pivot)**: gõ số vào ô và nhấn `Enter` — hệ thống **tự lưu ngay** và nhảy xuống dòng kế tiếp (chờ nhãn «Đã lưu»). Nếu khối *Doanh thu bổ sung* hoặc *Tổng cộng* đang đóng (`CollapseV2`), bấm mở ra để kiểm tra.
   - Tại **`CS-DTP-01B`**: sau khi sửa xong các ô, nhớ bấm **«Lưu thay đổi»**; không tự ý bấm nút **Đồng bộ đơn giá** hoặc **Ghi đè từ dự trù** khi chưa hỏi người dùng.
   - Quy tắc trống vs 0: Ngày/ca nào không phục vụ thì để trống theo quy ước màn hình, không tự bịa số.
3. **Kiểm doanh thu & đối soát (`CS-DTP-02`, `CS-TDT-15`):** Mở `/weekly-meal-plan/actual-meal-servings-summary` và `/weekly-meal-plan/report/meal-servings-comparison` đọc tổng suất, đơn giá nhân ra tiền và độ lệch so với số báo dự trù.
