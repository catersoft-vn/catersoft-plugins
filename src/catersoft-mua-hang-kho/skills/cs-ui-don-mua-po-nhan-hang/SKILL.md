---
name: cs-ui-don-mua-po-nhan-hang
description: >-
  Tạo và quản lý Đơn mua PO (CS-MH-11, CS-MH-12, CS-MH-03, CS-MH-16), Tách/Gộp/Gửi mail/Điều chỉnh PO (CS-MH-05, CS-MH-04, CS-MH-10, CS-MH-25) và Xác nhận giao nhận nhập kho từ PO (CS-MH-21) 100% qua Web UI CaterSoft.
  Dùng khi lên PO trực tiếp, sửa/gộp/tách/gửi email PO cho NCC, đối soát số thực giao và hoàn thành nhập kho từ PO.
---

# Kỹ năng UI: Đơn mua PO, Xử lý PO & Giao nhận nhập kho

> Đọc `cs-ui-ban-do-mua-hang-kho` trước. NCC và Kho nhận phải hợp lệ; nếu công ty đi từ PR, kiểm tra PR đã duyệt (`cs-ui-de-xuat-mua-pr`).
> Hướng dẫn chính thức: `https://guide.catersoft.vn/mua-hang-kho/duyet-va-tao-don-dat-hang`, `https://guide.catersoft.vn/mua-hang-kho/xac-nhan-da-giao`, `https://guide.catersoft.vn/mua-hang-kho/hoan-thanh-va-nhap-kho`.

## 1. Bản đồ màn hình

| STT | Tên ngắn | Tên trên menu | Đường dẫn | Mã trang | Dùng để |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | DS PO đơn giản | Đơn đặt hàng (Simple) | `/inventory/purchase-orders-simple` | `CS-MH-12` | Danh sách, lọc trạng thái, xem chi tiết, xác nhận & theo dõi PO luồng đơn giản |
| 2 | Tạo PO đơn giản | Tạo đơn đặt hàng | `/inventory/purchase-orders-simple/create-simple` | `CS-MH-11` | Lên nhanh một đơn mua PO mới theo NCC & Kho nhận |
| 3 | Giao nhận PO | Bảng kê giao nhận PO | `/inventory/purchase-orders-simple/goods-receipt` | `CS-MH-21` | Ghi nhận thực nhận, đối chiếu sai lệch và chốt nhập kho nhiều PO |
| 4 | DS PO V2 | Quản lý đơn mua V2 | `/inventory/purchase-orders-v2` | `CS-MH-03` | Giao diện danh sách PO phiên bản V2 (theo cấu hình công ty) |
| 5 | DS PO V1 | Danh sách đơn mua | `/inventory/purchase-orders` | `CS-MH-16` | Danh sách PO luồng chuẩn cũ |
| 6 | Tách PO | Tách đơn đặt hàng | `/inventory/split-purchase-order` | `CS-MH-05` | Tách một PO ra nhiều PO con theo mặt hàng/ngày giao/NCC |
| 7 | Gộp PO | Gộp đơn đặt hàng | `/inventory/purchase-order-merge` | `CS-MH-04` | Gộp nhiều PO cùng NCC / kho thành một PO tổng hợp |
| 8 | Gửi mail PO | Gửi email đơn đặt hàng | `/inventory/purchase-order-mail` | `CS-MH-10` | Gửi đơn đặt hàng qua email chính thức cho NCC |
| 9 | Điều chỉnh PO | Chỉnh sửa đơn mua | `/inventory/purchase-order-corrections` | `CS-MH-25` | Điều chỉnh số lượng/đơn giá chênh lệch cho PO theo quy định kiểm soát |

## 2. Tạo mới & Xử lý Đơn mua PO (`CS-MH-11`, `CS-MH-12`)

1. **Tạo mới (`CS-MH-11`):** Chọn **Nhà cung cấp**, **Kho nhận hàng**, **Ngày giao** → thêm mặt hàng và nhập **Số lượng đặt**, **Đơn giá** (mặc định lấy từ bảng giá NCC tháng nếu đã cấu hình) → bấm **Tạo đơn mua**.
2. **Tách / Gộp / Gửi mail:**
   - Khi một PO có mặt hàng giao nhiều đợt hoặc nhiều bếp: mở **Tách đơn đặt hàng (`CS-MH-05`)**, chọn PO gốc, tick nhóm dòng tách rồi lưu.
   - Khi có nhiều PO nháp cùng NCC trong ngày: mở **Gộp đơn đặt hàng (`CS-MH-04`)** để hợp nhất trước khi gửi NCC.
   - Gửi PO qua email (`CS-MH-10`): kiểm tra địa chỉ email NCC, xem trước nội dung đính kèm, và **chỉ bấm Gửi khi người dùng yêu cầu gửi ngay**.

## 3. Vòng đời xác nhận & Nhập kho từ PO (`CS-MH-12`, `CS-MH-21`)

Luôn kiểm tra đúng thứ tự trạng thái trên giao diện (nút hành động hiển thị tùy trạng thái hiện tại của PO):

1. **Xác nhận đặt hàng:** Chuyển từ nháp/chờ sang *Đã đặt hàng* trước khi giao nhận.
2. **Kiểm nhận thực giao (`CS-MH-21` hoặc ngăn kéo chi tiết PO):**
   - Đối chiếu từng dòng giữa **Số lượng đặt** và **Số lượng thực nhận**.
   - Nếu hàng giao thiếu hoặc sai lệch trọng lượng cân thực tế, sửa lại số **Thực nhận** đúng như phiếu giao của NCC (`EditableAntdNumberRenderer`, nhớ `Enter`).
3. **Xác nhận đã giao & Hoàn thành / Nhập kho:**
   - **Hỏi lại người dùng trước khi chốt** các nút *Xác nhận đã giao* và *Hoàn thành / Nhập kho* vì thao tác này sinh phiếu nhập kho tăng tồn và ghi nhận công nợ phải trả NCC.
   - Sau khi thấy thông báo thành công, mở **Giao dịch kho (`CS-QLK-06`)** hoặc **Tồn kho (`CS-QLK-09`)** kiểm tra phiếu nhập kho vừa sinh từ mã PO tương ứng.
4. Nếu phát hiện nhầm số lượng hoặc đơn giá sau khi đã giao hàng, dùng đúng màn hình **Chỉnh sửa đơn mua (`CS-MH-25`)** theo phân quyền thay vì cố xóa chứng từ.
