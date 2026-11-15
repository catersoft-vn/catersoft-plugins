---
name: cs-ui-ban-do-mua-hang-kho
description: >-
  Bản đồ luồng và thứ tự thiết lập Mua hàng — Nhà cung cấp — Kho CaterSoft 100% qua giao diện Web (CS-QLK-17, CS-DLC-04, CS-DLC-07, CS-PDX-01..04, CS-MH-01..25, CS-QLK-05..11, CS-NXT-01..10).
  Đọc đầu tiên khi bắt đầu chuỗi Mua hàng & Kho, khi đơn giá dự trù bằng 0, khi không thấy mặt hàng/NCC hoặc cần truy ngược chênh lệch tồn kho.
---

# Bản đồ Luồng Mua hàng, Nhà cung cấp & Kho (UI-Only)

> Mọi thao tác đều **100% qua giao diện Web CaterSoft**. Hướng dẫn gốc: `https://guide.catersoft.vn/mua-hang-kho`.
> Quy tắc DOM chi tiết: đọc thêm `QUY-TAC-BAT-BUOC.md` cùng thư mục (Antigravity đã tự nạp qua `rules/AGENTS.md`).

## 1. Năm bước chuẩn từ nền tảng tới chốt tồn kho

Dữ liệu phía sau phụ thuộc trực tiếp vào bước trước — thiếu bước trước sẽ gây thiếu đơn giá, không hiện nhà cung cấp hoặc lệch tồn:

| Bước | Chặng | Thao tác chính trên UI | Kỹ năng đi kèm |
| :-: | :--- | :--- | :--- |
| 1 | Kho & Nhà cung cấp & Giá | Tạo **Kho** (`CS-DLC-04`), **Nhà cung cấp** (`CS-DLC-07`), **Quy tắc khu vực** (`CS-MH-09`), và **Bảng giá NCC theo tháng** (`CS-MH-07`, `CS-MH-13`, `CS-MH-13B`) + **Giá dự trù bếp** (`CS-TDT-05`) | `cs-ui-ncc-bang-gia-khu-vuc` |
| 2 | Đề xuất mua (PR) | Lập **Đề xuất mua** từ dự trù bếp hoặc nhập tay (`CS-PDX-01`, `CS-PDX-03`), gửi duyệt (`CS-PDX-02`, `CS-PDX-04`) và **Tổng hợp đề xuất** (`CS-MH-01`) | `cs-ui-de-xuat-mua-pr` |
| 3 | Đơn mua PO & Giao nhận | Tạo / chuyển **Đơn mua PO** (`CS-MH-11`, `CS-MH-12`, `CS-MH-03`, `CS-MH-16`), tách/gộp/gửi mail (`CS-MH-05`, `CS-MH-04`, `CS-MH-10`), **Xác nhận đặt hàng → Xác nhận đã giao → Hoàn thành & Nhập kho** (`CS-MH-21`) | `cs-ui-don-mua-po-nhan-hang` |
| 4 | Nhập / Xuất / Chuyển kho | Ghi nhận & kiểm tra **Giao dịch kho** (`CS-QLK-06`), **Phiếu xuất kho** (`CS-NXT-04`), **Xuất dùng hằng ngày** (`CS-NXT-10`), **Phiếu chuyển kho** (`CS-NXT-02`) | `cs-ui-kho-nxt-kiem-ke` |
| 5 | Kiểm kê & Khóa kỳ | Tạo **Phiếu kiểm kê** (`CS-NXT-03`), đối chiếu chênh lệch và **Áp dụng đặt lại tồn** (`CS-QLK-05`), kiểm tra **Tồn kho / Thẻ kho** (`CS-QLK-09`, `CS-QLK-11`) và **Khóa kỳ NXT** (`CS-NXT-09`) | `cs-ui-kho-nxt-kiem-ke` |

## 2. Chẩn đoán nhanh 5 lỗi thường gặp (100% trên UI)

| STT | Tên ngắn | Triệu chứng trên giao diện | Cách truy ngược & khắc phục trên UI |
| :-: | :--- | :--- | :--- |
| 1 | Giá dự trù = 0 | Mặt hàng hiện đơn giá 0 hoặc thiếu NCC khi lập PR/dự trù | Vào **Giá dự trù theo vùng** / **Bảng giá NCC theo tháng** (`CS-MH-13`, `CS-TDT-05`) kiểm tra: (a) tháng hiệu lực đang chọn, (b) NCC thuộc **Quy tắc khu vực** của bếp/kho (`CS-MH-09`), (c) **Nhóm tên giá NCC** đang gắn cho mặt hàng & NCC |
| 2 | Không chọn được NCC | Dropdown NCC trống trên màn hình tạo PR/PO | Kiểm tra trạng thái hoạt động NCC ở `CS-DLC-07` và quy tắc phục vụ khu vực / loại kho ở `CS-MH-09` |
| 3 | Tồn kho không tăng sau PO | Đã tạo PO nhưng `CS-QLK-09` chưa cộng số lượng | Mở chi tiết PO / `CS-MH-21` kiểm tra trạng thái: chỉ khi qua bước **Xác nhận đã giao** và **Hoàn thành / Nhập kho** (đúng Kho đích) phiếu nhập kho mới được sinh |
| 4 | Khác đơn vị nhập vs kho | PO mua theo Thùng/Bao nhưng Tồn kho hiển thị Kg/Gói | Kiểm tra cấu hình **Đơn vị quy đổi** của mặt hàng (kỹ năng nguyên liệu) và đối chiếu số quy đổi hiển thị ngay trên **Thẻ kho** (`CS-QLK-11`) |
| 5 | Không sửa được chứng từ | Nút sửa/lưu bị mờ ở ngày cũ | Kiểm tra màn hình **Khóa kỳ nhập xuất tồn** (`CS-NXT-09`) hoặc trạng thái PO đã **Hoàn thành** — nếu cần điều chỉnh số/giá PO đã duyệt, dùng **Điều chỉnh đơn mua** (`CS-MH-25`) |
