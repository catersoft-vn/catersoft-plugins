---
name: cs-ui-ncc-bang-gia-khu-vuc
description: >-
  Thiết lập Kho hàng (CS-DLC-04), Nhà cung cấp (CS-DLC-07), Quy tắc khu vực giao nhận (CS-MH-09), Bảng giá NCC (CS-MH-07, CS-MH-13, CS-MH-13B) và Giá dự trù theo bếp (CS-TDT-05) trên Web UI CaterSoft.
  Dùng khi khai NCC mới, gán NCC theo khu vực bếp/kho, nhập bảng giá NCC theo tháng hoặc truy ngược nguồn đơn giá mua hàng.
---

# Kỹ năng UI: Kho, Nhà cung cấp, Khu vực & Bảng giá NCC

> **Quy tắc bắt buộc (100% UI-Only & 7 Quy tắc Vàng DOM):** Trên Claude Code và Codex, luôn đọc thêm file `../cs-ui-ban-do-mua-hang-kho/QUY-TAC-BAT-BUOC.md` trước khi thao tác trình duyệt (Antigravity nạp sẵn qua `rules/AGENTS.md`).

> Đọc `cs-ui-ban-do-mua-hang-kho` trước. Nguyên liệu & ĐVT phải có sẵn trước khi lập bảng giá NCC.
> Hướng dẫn chính thức: `https://guide.catersoft.vn/mua-hang-kho/gia-du-tru-theo-vung`, `https://guide.catersoft.vn/mua-hang-kho/truy-nguoc-don-gia`.

## 1. Bản đồ màn hình

| STT | Tên ngắn | Tên trên menu | Đường dẫn | Mã trang | Dùng để |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | Kho hàng | Kho hàng | `/inventory/warehouses` | `CS-DLC-04` | Tạo/sửa kho bếp, kho tổng, kho điều chuyển và gán địa điểm |
| 2 | Nhà cung cấp | Nhà cung cấp | `/supplier/suppliers` | `CS-DLC-07` | Thêm/sửa thông tin NCC, thông tin liên hệ, thanh toán, trạng thái |
| 3 | Quy tắc vùng | Quy tắc khu vực NCC | `/supplier/supplier-region-rules` | `CS-MH-09` | Gán phạm vi khu vực/địa điểm NCC được phép cung ứng |
| 4 | Thiết lập giá | Thiết lập bảng giá NCC | `/supplier/supplier-pricing-setup` | `CS-MH-07` | Cấu hình nhóm tên giá NCC & gán NCC/mặt hàng áp dụng |
| 5 | Bảng giá tháng | Bảng giá NCC theo tháng | `/supplier/supplier-monthly-pricings` | `CS-MH-13B` | Quản lý bảng giá NCC theo tháng (dạng danh sách & nạp Excel) |
| 6 | Lưới giá tháng | Lưới bảng giá NCC | `/supplier/supplier-monthly-pricings-grid` | `CS-MH-13` | Sửa nhanh đơn giá hàng loạt theo tháng x NCC x mặt hàng |
| 7 | Giá dự trù bếp | Giá dự trù theo vùng | `/supplier/kitchen-projected-pricings` | `CS-TDT-05` | Xem & truy ngược đơn giá dự trù áp cho từng bếp trong tháng |

## 2. Thứ tự khai báo Kho & Nhà cung cấp mới

1. **Khai Kho (`CS-DLC-04`):** Mở menu **Dữ liệu chung → Kho hàng** → bấm nút thêm mới → nhập tên kho, loại kho, bếp/cơ sở trực thuộc → bấm **Tạo mới**. Đọc lại danh sách để chắc kho mới đang ở trạng thái hoạt động.
2. **Khai Nhà cung cấp (`CS-DLC-07`):** Mở **Nhà cung cấp** → bấm **Thêm mới** → điền tên NCC, mã (nếu dùng), SĐT/email nhận PO, thông tin ngân hàng → bấm **Tạo mới**.
3. **Cấu hình Quy tắc khu vực (`CS-MH-09`):** Chọn NCC vừa tạo và gán các **khu vực / cơ sở / bếp** mà NCC giao hàng được. Nếu bỏ trống quy tắc vùng trên công ty có bật phân vùng, bếp sẽ không chọn được NCC đó khi tạo PO.

## 3. Nhập & Truy ngược Bảng giá NCC theo tháng

1. **Thiết lập nhóm tên giá (`CS-MH-07`):** Xác nhận tên bảng giá áp cho từng khu vực hoặc nhóm khách bếp trước khi điền giá.
2. **Nhập / Sửa giá hàng loạt (`CS-MH-13` / `CS-MH-13B`):**
   - Chọn đúng **Tháng (`MM/YYYY`)**, **Tên giá NCC** và **Nhà cung cấp** ở bộ lọc đầu trang.
   - Trên lưới `CS-MH-13`: click vào từng ô số đơn giá (`EditableAntdNumberRenderer`), gõ đơn giá theo **đơn vị mua**, nhấn `Enter`. Khi có thay đổi chưa lưu (`pendingChanges > 0`), bấm **«Lưu thay đổi»** trước khi chuyển tháng hoặc đổi NCC.
   - Khi có nhiều dòng: mở nút **Thao tác** (`ActionPopoverButton`) để tải mẫu Excel / nhập từ Excel và kiểm tra lại cột đơn vị tính sau khi nạp.
3. **Truy ngược đơn giá trên Giá dự trù bếp (`CS-TDT-05`):** Khi nghi ngờ đơn giá dự trù lệch thực tế, mở `/supplier/kitchen-projected-pricings`, lọc đúng **Bếp** và **Tháng**, kiểm tra cột nguồn **Nhóm giá / NCC đang áp** rồi điều chỉnh về đúng bảng giá nguồn ở `CS-MH-13` (không sửa nóng trên chứng từ PR).
