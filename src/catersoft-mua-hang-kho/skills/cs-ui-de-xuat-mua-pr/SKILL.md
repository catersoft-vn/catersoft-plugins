---
name: cs-ui-de-xuat-mua-pr
description: >-
  Tạo và duyệt Đề xuất mua hàng PR V2 & V1 (CS-PDX-01, CS-PDX-02, CS-PDX-03, CS-PDX-04) và Tổng hợp đề xuất mua chuyển thành Đơn mua PO (CS-MH-01) 100% qua Web UI CaterSoft.
  Dùng khi nhân viên bếp/thu mua lập phiếu đề xuất mua mới, lấy số từ dự trù ngày, theo dõi trạng thái duyệt hoặc tổng hợp nhiều PR sang PO.
---

# Kỹ năng UI: Đề xuất mua hàng (PR) & Tổng hợp duyệt

> Đọc `cs-ui-ban-do-mua-hang-kho` trước. Phải có Kho (`CS-DLC-04`), NCC & Giá (`CS-MH-13`) và (nếu mua theo thực đơn) Dự trù ngày đã tính sẵn.
> Hướng dẫn chính thức: `https://guide.catersoft.vn/mua-hang-kho/tao-phieu-de-xuat`, `https://guide.catersoft.vn/mua-hang-kho/duyet-va-tao-don-dat-hang`.

## 1. Bản đồ màn hình

| STT | Tên ngắn | Tên trên menu | Đường dẫn | Mã trang | Dùng để |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | Tạo PR V2 | Tạo đề xuất mua (V2) | `/inventory/create-purchase-request-v2` | `CS-PDX-01` | Lập phiếu đề xuất mua mới theo chuẩn V2 (nhập tay hoặc lấy từ dự trù) |
| 2 | DS PR V2 | Đề xuất mua hàng (V2) | `/inventory/purchase-requests-v2` | `CS-PDX-02` | Theo dõi, lọc, xem chi tiết, duyệt/hủy hoặc chuyển đổi PR V2 |
| 3 | Tổng hợp PR | Tổng hợp đề xuất mua V2 | `/inventory/purchase-request-consolidation-v2` | `CS-MH-01` | Gom nhiều đề xuất mua theo ngày giao/bếp/NCC để duyệt và tạo PO hàng loạt |
| 4 | Tạo PR V1 | Tạo đề xuất mua | `/inventory/purchase-requests/create` | `CS-PDX-03` | Giao diện tạo PR bản cũ (dành cho đơn vị đang bật luồng cũ) |
| 5 | DS PR V1 | Danh sách đề xuất mua | `/inventory/purchase-requests` | `CS-PDX-04` | Danh sách & xử lý PR bản cũ |

> Lưu ý: Kiểm tra menu sidebar đang bật phiên bản V2 (`purchase-requests-v2`) hay V1 để dùng thống nhất một luồng trên công ty khách hàng.

## 2. Quy trình lập Đề xuất mua mới trên UI (`CS-PDX-01`)

1. Chọn **Kho / Bếp nhận**, **Ngày giao dự kiến** và **Nhà cung cấp** (nếu phiếu phân theo NCC) hoặc để hệ thống gợi ý theo thiết lập giá NCC của bếp.
2. Thêm mặt hàng vào lưới:
   - Nếu **lấy từ dự trù thực đơn**: chọn ngày dự trù / nút kéo dữ liệu từ dự trù hiển thị trên thanh công cụ hoặc trong **Thao tác**, kiểm tra kỹ danh sách món/nguyên liệu sau khi đổ vào lưới.
   - Nếu **nhập bổ sung tay**: chọn từng mặt hàng qua ô chọn (gõ tên không dấu, click đúng dòng), nhập số lượng đề xuất bằng click-gõ-`Enter` ở cột số lượng.
3. Kiểm tra lại **Đơn vị tính**, **Số lượng đề xuất**, **Đơn giá dự kiến** (nếu đơn giá bằng 0, kiểm tra bảng giá ở skill `cs-ui-ncc-bang-gia-khu-vuc`).
4. Bấm **Tạo đề xuất / Gửi duyệt** và chờ thông báo thành công; mở **Đề xuất mua hàng (`CS-PDX-02`)** kiểm tra lại mã phiếu vừa sinh.

## 3. Duyệt & Tổng hợp sang Đơn mua PO (`CS-PDX-02`, `CS-MH-01`)

1. **Duyệt lẻ từng phiếu (`CS-PDX-02`):** Lọc trạng thái *Chờ duyệt*, mở chi tiết hoặc dùng nút **Duyệt** trên dòng phiếu (chỉ duyệt sau khi đối chiếu số lượng và ngày giao).
2. **Tổng hợp nhiều PR (`CS-MH-01`):**
   - Chọn khoảng ngày nhận hàng / nhóm bếp cần gom.
   - Rà soát bảng tổng hợp số lượng theo từng **Mặt hàng × NCC**. Nếu cần đổi NCC cung ứng cho mặt hàng nào, chọn lại NCC ngay trên cột NCC được hỗ trợ trước khi chốt.
   - **Hỏi lại người dùng** trước khi bấm **Duyệt & Tạo Đơn mua PO** hàng loạt; chờ hoàn tất và ghi nhận danh sách mã PO mới tạo trên màn hình **Đơn đặt hàng (`CS-MH-12` / `CS-MH-03`)**.
