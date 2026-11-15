# CaterSoft — Kho FIFO & Thương mại (100% UI-Only)

Plugin chính thức của **CaterSoft** hướng dẫn trợ lý AI của khách hàng thao tác toàn bộ nghiệp vụ **Kho FIFO theo lô · Hạn sử dụng · Thương mại PO → SO** hoàn toàn trên giao diện Web CaterSoft.

> **Ranh giới bắt buộc:** Mọi thao tác đều thực hiện **100% trên giao diện trình duyệt** (Click, Chọn, Gõ, Lưu). Không gọi API ngầm, không sửa `localStorage`/IndexedDB.

## Bộ 5 kỹ năng đi kèm

| STT | Tên ngắn | Tên kỹ năng | Phạm vi nghiệp vụ chính |
| :-: | :--- | :--- | :--- |
| 1 | Bản đồ FIFO | `cs-ui-ban-do-fifo-trading` | Quy trình Kho FIFO (`CS-FIFO-06`), trình tự chuẩn từ Ánh xạ / Nhà SX → Nhập lô → Xuất SO → Tồn & Kiểm kê lô |
| 2 | Ánh xạ & PO→SO | `cs-ui-anh-xa-doi-tac-po-so` | Ánh xạ đối tác (`CS-QLK-20`), Ánh xạ mặt hàng (`CS-QLK-19`), Nhập PO người mua → SO (`CS-MH-20`) trên cả nhánh `/inventory-fifo/*` & `/inventory/*` |
| 3 | Mua & nhận lô | `cs-ui-fifo-mua-hang-nhan-lo` | Nhà sản xuất (`CS-FIFO-07`), PR FIFO (`CS-FIFO-02`), PO FIFO (`CS-FIFO-01`, `CS-FIFO-15`), Bảng kê giao nhận (`CS-FIFO-16`), Công nợ & Tổng hợp mua NCC (`CS-FIFO-22..24`) |
| 4 | Bán & xuất lô | `cs-ui-fifo-ban-hang-xuat-lo` | Đơn bán SO FIFO (`CS-FIFO-08`), Giá bán tháng & Tên giá KH (`CS-FIFO-09`, `CS-FIFO-10`), Tổng hợp bán (`CS-FIFO-11`), Bảng kê giao (`CS-FIFO-12`), Công nợ KH ngày/tháng (`CS-FIFO-13`, `CS-FIFO-14`) |
| 5 | Tồn lô & kiểm | `cs-ui-fifo-ton-lo-kiem-ke` | Tồn kho theo lô (`CS-FIFO-05`), Tra cứu mã lô ngắn (`CS-FIFO-17`), Giao dịch kho & Điều chuyển FIFO (`CS-FIFO-04`, `CS-FIFO-19`, `CS-FIFO-20`), Kiểm kê & Áp tồn lô (`CS-FIFO-03`, `CS-FIFO-21`), Thùng rác đơn (`CS-FIFO-18`) |

## Hướng dẫn chính thức liên quan

- Cổng hướng dẫn Kho FIFO: `https://guide.catersoft.vn/mua-hang-kho/kho-fifo-mua-ban-kiem-ke`
- Cổng hướng dẫn Nhập đơn PO→SO: `https://guide.catersoft.vn/mua-hang-kho/nhap-don-tu-doi-tac`
