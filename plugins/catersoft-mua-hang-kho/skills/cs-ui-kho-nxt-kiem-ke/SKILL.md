---
name: cs-ui-kho-nxt-kiem-ke
description: >-
  Quản lý Tổng quan kho (CS-QLK-17), Giao dịch nhập xuất (CS-QLK-06), Tồn kho & Thẻ kho (CS-QLK-09, CS-QLK-11), Phiếu xuất kho (CS-NXT-04), Xuất dùng hàng ngày (CS-NXT-10), Chuyển kho (CS-NXT-02, CS-NXT-02B), Kiểm kê & Đặt lại tồn (CS-NXT-03, CS-QLK-05) và Khóa kỳ NXT (CS-NXT-09) 100% qua Web UI CaterSoft.
  Dùng khi nhập/xuất/chuyển kho, chốt kiểm kê cuối ngày hoặc kiểm tra số dư thẻ kho.
---

# Kỹ năng UI: Giao dịch Kho, Nhập Xuất Tồn, Chuyển kho & Kiểm kê

> **Quy tắc bắt buộc (100% UI-Only & 7 Quy tắc Vàng DOM):** Trên Claude Code và Codex, luôn đọc thêm file `../cs-ui-ban-do-mua-hang-kho/QUY-TAC-BAT-BUOC.md` trước khi thao tác trình duyệt (Antigravity nạp sẵn qua `rules/AGENTS.md`).

> Đọc `cs-ui-ban-do-mua-hang-kho` trước. Kiểm tra xem kho đang dùng **Chế độ kỳ mở** hay đã **Khóa kỳ** (`CS-NXT-09`).
> Hướng dẫn chính thức: `https://guide.catersoft.vn/mua-hang-kho/nhap-xuat-ton`, `https://guide.catersoft.vn/mua-hang-kho/phieu-chuyen-kho`.

## 1. Bản đồ màn hình

| STT | Tên ngắn | Tên trên menu | Đường dẫn | Mã trang | Dùng để |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | Tổng quan kho | Quản lý kho | `/inventory` | `CS-QLK-17` | Xem luồng tổng quan & mở nhanh chứng từ kho |
| 2 | Giao dịch kho | Giao dịch nhập xuất | `/inventory/stock-transactions` | `CS-QLK-06` | Danh sách tập trung mọi phiếu nhập, xuất, điều chỉnh, chuyển kho |
| 3 | Tồn kho hiện tại | Tồn kho | `/inventory/stock-balance` | `CS-QLK-09` | Tra cứu số lượng & giá trị tồn theo kho, mặt hàng, ĐVT |
| 4 | Thẻ kho | Thẻ kho chi tiết | `/inventory/stock-card` | `CS-QLK-11` | Xem lịch sử nhập – xuất – tồn lũy kế từng chứng từ của một mặt hàng |
| 5 | Xuất kho | Phiếu xuất kho | `/inventory/stock-out-vouchers` | `CS-NXT-04` | Lập và quản lý phiếu xuất kho theo bộ phận/bếp/lý do |
| 6 | Xuất dùng ngày | Xuất dùng hằng ngày | `/inventory/daily-issues` | `CS-NXT-10` | Ghi nhận xuất nguyên liệu dùng trong ngày |
| 7 | Chuyển kho | Phiếu chuyển kho | `/inventory/stock-transfer-vouchers` | `CS-NXT-02` | Danh sách & xử lý duyệt/nhận phiếu chuyển giữa 2 kho |
| 8 | Tạo chuyển kho | Tạo phiếu chuyển kho | `/inventory/stock-transfer-vouchers/create` | `CS-NXT-02B` | Lập phiếu chuyển hàng từ Kho xuất sang Kho nhận |
| 9 | Kiểm kê | Phiếu kiểm kê | `/inventory/stocktaking-records` | `CS-NXT-03` | Lập biên bản kiểm kê, điền số đếm thực tế và xem chênh lệch |
| 10 | Đặt lại tồn | Áp dụng đặt lại tồn | `/inventory/stocktaking-apply` | `CS-QLK-05` | Chốt áp số tồn thực tế sau kiểm kê làm mốc tồn mới |
| 11 | Báo cáo NXT CT | Chi tiết nhập xuất tồn | `/inventory/stock-movements/detail` | `CS-NXT-01` | Báo cáo chi tiết nhập xuất tồn theo kỳ |
| 12 | Khóa kỳ NXT | Khóa kỳ nhập xuất tồn | `/inventory/stock-movements/period-locks` | `CS-NXT-09` | Khóa / mở kỳ kế toán kho tránh sửa nhầm số liệu quá khứ |

## 2. Xuất kho & Điều chuyển giữa hai kho (`CS-NXT-04`, `CS-NXT-10`, `CS-NXT-02B`)

1. **Xuất kho / Xuất dùng hằng ngày (`CS-NXT-04` / `CS-NXT-10`):** Chọn **Kho xuất**, **Ngày chứng từ**, lý do xuất → chọn mặt hàng (kiểm tra tồn khả dụng) → nhập số lượng theo đúng ĐVT xuất → bấm **Lưu / Tạo phiếu**.
2. **Chuyển kho (`CS-NXT-02B` → `CS-NXT-02`):**
   - Tại `CS-NXT-02B`: chọn **Kho nguồn**, **Kho đích** (phải khác nhau), **Ngày chuyển** → chọn các mặt hàng & số lượng chuyển → **Tạo phiếu chuyển**.
   - Tại danh sách `CS-NXT-02`: kiểm tra trạng thái phiếu chuyển (Xuất đi / Hoàn thành nhận tại kho đích) để bảo đảm **cả hai kho** đều đã hạch toán đối ứng.

## 3. Kiểm kê, Áp dụng đặt lại tồn & Kiểm chứng Thẻ kho

1. **Tạo phiếu kiểm kê (`CS-NXT-03`):** Chọn **Kho** và **Thời điểm chốt kiểm kê** → lưới hiển thị *Tồn hệ thống* bên cạnh cột *Tồn thực tế*.
2. **Nhập số đếm thực tế:** Click vào từng ô *Tồn thực tế* (`EditableAntdNumberRenderer`), gõ đúng số kiểm đếm và nhấn `Enter` (chú ý đơn vị quy đổi hiển thị ngay cạnh). Bấm **«Lưu thay đổi»** và kiểm tra cột *Chênh lệch*.
3. **Áp dụng đặt lại tồn (`CS-QLK-05` hoặc nút áp dụng trong kiểm kê):**
   - **Hỏi xác nhận người dùng** trước khi bấm **Áp dụng đặt lại tồn** (thao tác điều chỉnh thẳng tồn kho về số đếm thực tế).
   - **Hỏi xác nhận người dùng** trước khi thực hiện **Khóa kỳ (`CS-NXT-09`)**.
4. **Đối soát bằng mắt sau cùng:** Mở **Tồn kho (`CS-QLK-09`)** và **Thẻ kho (`CS-QLK-11`)** lọc đúng Kho + Mặt hàng để xác nhận số dư mới khớp với biên bản kiểm kê hoặc chứng từ vừa tạo.
