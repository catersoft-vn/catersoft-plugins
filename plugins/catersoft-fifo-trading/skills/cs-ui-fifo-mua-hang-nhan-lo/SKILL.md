---
name: cs-ui-fifo-mua-hang-nhan-lo
description: >-
  Quản lý Nhà sản xuất (CS-FIFO-07), Phiếu đề nghị mua FIFO (CS-FIFO-02), Đơn đặt hàng & Tạo đơn mua FIFO (CS-FIFO-01, CS-FIFO-15), Bảng kê thu mua hàng & nhận lô NSX/HSD (CS-FIFO-16) và Công nợ/Chi phí mua NCC (CS-FIFO-22, CS-FIFO-23, CS-FIFO-24) qua Web UI CaterSoft.
  Dùng khi mua hàng nhập kho theo lô FIFO, ghi nhận lô có hạn sử dụng và theo dõi công nợ NCC FIFO.
---

# Kỹ năng UI: Mua hàng FIFO, Nhận lô NSX/HSD & Công nợ NCC

> **Quy tắc bắt buộc (100% UI-Only & 7 Quy tắc Vàng DOM):** Trên Claude Code và Codex, luôn đọc thêm file `../cs-ui-ban-do-fifo-trading/QUY-TAC-BAT-BUOC.md` trước khi thao tác trình duyệt (Antigravity nạp sẵn qua `rules/AGENTS.md`).

> Đọc `cs-ui-ban-do-fifo-trading` trước. Hướng dẫn chính thức: `https://guide.catersoft.vn/mua-hang-kho/kho-fifo-mua-ban-kiem-ke`.

## 1. Bản đồ màn hình

| STT | Tên ngắn | Tên trên menu | Đường dẫn | Mã trang | Dùng để |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | Nhà sản xuất | Nhà sản xuất | `/inventory-fifo/manufacturers` | `CS-FIFO-07` | Thêm/sửa danh mục hãng/nhà sản xuất gắn trên từng lô hàng |
| 2 | Đề nghị mua FIFO | Phiếu đề nghị mua hàng | `/inventory-fifo/purchase-requests` | `CS-FIFO-02` | Lập, duyệt và theo dõi PR FIFO trước khi tạo PO |
| 3 | DS Đơn mua FIFO | Đơn đặt hàng | `/inventory-fifo/purchase-orders` | `CS-FIFO-01` | Danh sách, lọc, xem chi tiết và xử lý vòng đời PO FIFO |
| 4 | Tạo đơn mua FIFO | Tạo đơn đặt hàng | `/inventory-fifo/purchase-orders/create` | `CS-FIFO-15` | Tạo mới một đơn mua hàng FIFO theo NCC, Kho nhận & ngày giao |
| 5 | Bảng kê thu mua | Bảng kê thu mua hàng | `/inventory-fifo/purchase-orders/goods-manifest` | `CS-FIFO-16` | Kiểm kê số thực giao, đối soát đơn giá và nhận hàng theo đợt |
| 6 | Công nợ NCC ngày | Công nợ NCC theo ngày | `/inventory-fifo/purchase-orders/supplier-debt-daily` | `CS-FIFO-22` | Theo dõi phát sinh phải trả NCC FIFO chi tiết theo từng ngày |
| 7 | Công nợ NCC tháng | Công nợ NCC theo tháng | `/inventory-fifo/purchase-orders/supplier-debt-monthly` | `CS-FIFO-23` | Tổng hợp công nợ phải trả NCC FIFO theo kỳ tháng |
| 8 | Tổng chi phí mua | Tổng hợp chi phí mua | `/inventory-fifo/purchase-orders/supplier-purchase-summary` | `CS-FIFO-24` | Tổng hợp giá trị mua hàng FIFO theo NCC và nhóm hàng |

## 2. Quy trình Mua & Nhập lô FIFO chuẩn UI

1. **Khai Nhà sản xuất (`CS-FIFO-07`):** Nếu lô nhập yêu cầu chọn Nhà sản xuất mà chưa có trong danh mục, thêm trước tại `/inventory-fifo/manufacturers`.
2. **Tạo PR / Tạo PO FIFO (`CS-FIFO-02` → `CS-FIFO-15`):** Chọn **Nhà cung cấp**, **Kho FIFO nhận**, **Ngày đặt / Ngày dự kiến giao** → thêm mặt hàng, số lượng, đơn giá → bấm **Tạo đơn**.
3. **Nhận hàng & Cấp lô (NSX / HSD) (`CS-FIFO-01` hoặc `CS-FIFO-16`):**
   - Mở chi tiết PO FIFO cần nhận hàng và chọn thao tác **Nhận hàng / Nhập kho**.
   - Với mỗi dòng mặt hàng nhận vào kho: nhập **Số lượng thực nhận**, chọn **Ngày sản xuất (NSX)**, **Hạn sử dụng (HSD)** (`DD/MM/YYYY`), **Nhà sản xuất** (nếu bật) và số lô NCC (nếu có).
   - **Hỏi xác nhận người dùng** trước khi bấm nút **Xác nhận nhập kho / Hoàn thành** vì thao tác này sinh lô FIFO chính thức trong kho và tăng công nợ NCC.
4. **Kiểm tra sau nhận hàng:** Mở **Tồn kho FIFO (`CS-FIFO-05`)** kiểm tra xem mã lô ngắn (`shortCode`) mới sinh đã hiện đúng số lượng, NSX, HSD chưa, và đối chiếu số liệu trên **Công nợ NCC theo ngày (`CS-FIFO-22`)**.
