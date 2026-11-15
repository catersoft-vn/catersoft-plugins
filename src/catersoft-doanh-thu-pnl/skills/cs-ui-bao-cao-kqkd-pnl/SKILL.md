---
name: cs-ui-bao-cao-kqkd-pnl
description: >-
  Cấu hình báo cáo P&L 3 phần & Điểm kinh doanh (CS-QTH-01B, CS-DLC-19), xem và xuất Báo cáo KQKD / P&L (CS-BC-02, CS-BC-01, CS-BC-08), Báo cáo Cơm (CS-BC-04, CS-BC-05, CS-BC-07) và Kế toán thuế / Xuất bút toán tháng (CS-TC-15, CS-TC-14) 100% qua Web UI CaterSoft.
  Dùng khi cấu hình nhóm chỉ tiêu P&L, đọc báo cáo lãi lỗ theo tháng / điểm kinh doanh / bếp hoặc xuất dữ liệu cho kế toán thuế.
---

# Kỹ năng UI: Cấu hình P&L, Báo cáo KQKD & Kế toán thuế

> Đọc `cs-ui-ban-do-doanh-thu-pnl` trước. Số liệu P&L phụ thuộc vào Doanh thu suất ăn/bán hàng, Giá vốn xuất kho/mua hàng và các giao dịch Thu chi theo đúng hạng mục.

## 1. Bản đồ màn hình

| STT | Tên ngắn | Tên trên menu | Đường dẫn | Mã trang | Dùng để |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | Cấu hình P&L | Cấu hình báo cáo P&L | `/settings/pnl-report/configs` | `CS-QTH-01B` | Cấu hình 3 phần chỉ tiêu P&L (Doanh thu · Giá vốn · Chi phí) dùng chung |
| 2 | Điểm kinh doanh | Điểm kinh doanh P&L | `/settings/pnl-sites` | `CS-DLC-19` | Khai & gán bếp / chi nhánh / điểm kinh doanh vào báo cáo P&L |
| 3 | Báo cáo P&L | Báo cáo doanh thu / P&L | `/reports/kqhdkd-pnl` | `CS-BC-02` | Báo cáo Kết quả hoạt động kinh doanh tổng hợp 3 phần theo kỳ |
| 4 | KQKD theo điểm | KQKD theo điểm kinh doanh | `/reports/kqkd-by-site` và `/reports/kqkd-by-site-v2` | `CS-BC-01` | Xem lãi/lỗ chi tiết từng bếp hoặc từng điểm kinh doanh (bản chuẩn & V2) |
| 5 | Doanh thu - GV | Doanh thu – giá vốn theo đơn vị | `/reports/revenue-cogs-by-unit` | `CS-BC-08` | Đối chiếu doanh thu, giá vốn và biên lợi nhuận gộp từng đơn vị |
| 6 | Báo cáo Cơm | Báo Cáo Cơm | `/weekly-meal-plan/report/stock-movement-reports` | `CS-BC-04` | Báo cáo sử dụng nguyên liệu – xuất kho – tiền ăn theo bếp/ngày |
| 7 | So sánh BC Cơm | So sánh Báo Cáo Cơm | `/weekly-meal-plan/report/summary-stock-movement-reports` | `CS-BC-05` | So sánh chênh lệch Báo Cáo Cơm giữa các kỳ hoặc giữa định mức vs thực xuất |
| 8 | BC Cơm Phiếu xuất | Báo Cáo Cơm (Phiếu xuất) | `/weekly-meal-plan/report/stock-out-voucher-reports` | `CS-BC-07` | Đối chiếu chi phí suất ăn dựa trên chứng từ phiếu xuất kho |
| 9 | KQKD Thuế | KQKD kế toán thuế | `/ke-toan-thue/kqkd` | `CS-TC-15` | Báo cáo KQKD góc độ sổ kế toán thuế |
| 10 | Xuất bút toán | Xuất bút toán tháng | `/ke-toan-thue/xuat-but-toan` | `CS-TC-14` | Tổng hợp & xuất bảng bút toán tháng sang phần mềm kế toán thuế |

## 2. Cấu hình Báo cáo P&L & Điểm kinh doanh (`CS-QTH-01B`, `CS-DLC-19`)

1. **Điểm kinh doanh (`CS-DLC-19`):** Bảo đảm mỗi bếp/cơ sở hoặc đơn vị kinh doanh cần lên P&L riêng đều đã được khai và ánh xạ đúng trong danh mục điểm P&L.
2. **Cấu hình P&L (`CS-QTH-01B`):**
   - Đây là cấu hình ảnh hưởng toàn bộ báo cáo tài chính của công ty: **hỏi xác nhận người dùng trước khi thêm, sửa, bật/tắt** bất kỳ dòng cấu hình nào.
   - Kiểm tra đủ 3 nhóm: Doanh thu, Giá vốn (NL / mua hàng / tồn kho), và Chi phí vận hành gắn đúng các hạng mục dòng tiền ở `CS-TC-03`.

## 3. Đọc, Kiểm chứng & Xuất Báo cáo (`CS-BC-02`, `CS-BC-01`, `CS-BC-04`, `CS-TC-14`)

1. Chọn đúng **Kỳ báo cáo (`MM/YYYY` hoặc khoảng ngày)** và bộ lọc **Điểm kinh doanh / Bếp**.
2. Dùng thanh tiêu đề `CollapseV2` để mở chi tiết từng nhóm chỉ tiêu trên `CS-BC-02` hoặc `CS-BC-01` khi cần truy nguyên con số doanh thu / giá vốn / chi phí tăng giảm bất thường.
3. Đối chiếu 3 lớp nếu phát hiện lệch lợi nhuận bếp:
   - Doanh thu: kiểm **Doanh thu suất ăn (`CS-DTP-02`)** hoặc SO bán hàng.
   - Giá vốn nguyên liệu: đối chiếu **Doanh thu – Giá vốn (`CS-BC-08`)** và **Báo Cáo Cơm (`CS-BC-04`, `CS-BC-07`)**.
   - Chi phí khác: đối chiếu **Nhật ký thu chi (`CS-TC-01` / `CS-TC-08`)** theo đúng hạng mục dòng tiền.
4. Khi cần file gửi ban giám đốc hoặc kế toán thuế: bấm nút **Thao tác (`ActionPopoverButton`)** chọn xuất Excel tại màn hình báo cáo tương ứng hoặc dùng **Xuất bút toán tháng (`CS-TC-14`)**.
