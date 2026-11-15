# CaterSoft — Mua hàng, Nhà cung cấp & Kho (100% UI-Only)

Plugin chính thức của **CaterSoft** hướng dẫn trợ lý AI của khách hàng thao tác chuỗi nghiệp vụ **Nhà cung cấp → Đề xuất mua (PR) → Đơn đặt hàng (PO) → Nhận hàng & Nhập/Xuất/Tồn → Kiểm kê** hoàn toàn trên giao diện Web CaterSoft.

> **Ranh giới bắt buộc:** Mọi thao tác đều thực hiện **100% trên giao diện trình duyệt** giống nhân viên mua hàng / thủ kho. Không gọi API ngầm, không sửa `localStorage`/IndexedDB.

## Bộ 5 kỹ năng đi kèm

| STT | Tên ngắn | Tên kỹ năng | Phạm vi nghiệp vụ chính |
| :-: | :--- | :--- | :--- |
| 1 | Bản đồ mua-kho | `cs-ui-ban-do-mua-hang-kho` | Thứ tự thiết lập Kho · NCC · Vùng · Giá → PR → PO → Nhập/Xuất/Kiểm kê & truy ngược đơn giá |
| 2 | NCC & bảng giá | `cs-ui-ncc-bang-gia-khu-vuc` | Kho (`CS-DLC-04`), NCC (`CS-DLC-07`), Quy tắc vùng (`CS-MH-09`), Bảng giá NCC (`CS-MH-07`, `CS-MH-13`, `CS-MH-13B`, `CS-TDT-05`) |
| 3 | Đề xuất mua PR | `cs-ui-de-xuat-mua-pr` | Tạo Đề xuất mua V2/V1 (`CS-PDX-01`, `CS-PDX-03`), danh sách PR (`CS-PDX-02`, `CS-PDX-04`), Tổng hợp duyệt PR (`CS-MH-01`) |
| 4 | Đơn mua PO | `cs-ui-don-mua-po-nhan-hang` | Tạo & QL Đơn mua đơn giản / V2 (`CS-MH-11`, `CS-MH-12`, `CS-MH-03`, `CS-MH-16`), Giao nhận PO (`CS-MH-21`), Tách/Gộp/Email/Chỉnh sửa PO (`CS-MH-05`, `CS-MH-04`, `CS-MH-10`, `CS-MH-25`) |
| 5 | Kho NXT & kiểm | `cs-ui-kho-nxt-kiem-ke` | Tổng quan kho (`CS-QLK-17`), Giao dịch nhập xuất (`CS-QLK-06`), Tồn & Thẻ kho (`CS-QLK-09`, `CS-QLK-11`), Xuất kho & Xuất dùng (`CS-NXT-04`, `CS-NXT-10`), Chuyển kho (`CS-NXT-02`, `CS-NXT-02B`), Kiểm kê (`CS-NXT-03`, `CS-QLK-05`), Khóa kỳ (`CS-NXT-09`) |

## Hướng dẫn chính thức liên quan

- Cổng hướng dẫn khách hàng: `https://guide.catersoft.vn/mua-hang-kho`
- Hướng dẫn cài đặt AI: `https://guide.catersoft.vn/bat-dau/tro-ly-ai-catersoft`
