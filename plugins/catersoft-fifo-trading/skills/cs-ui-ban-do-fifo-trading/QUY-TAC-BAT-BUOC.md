# Quy tắc Vận hành & Nhập liệu Giao diện Kho FIFO & Thương mại CaterSoft

Khi hỗ trợ đơn vị thương mại hoặc kho quản lý theo lô (FIFO / FEFO) thao tác trên CaterSoft, Agent AI tuân thủ nghiêm ngặt các nguyên tắc giao diện dưới đây.

## 1. Nguyên tắc Ranh giới: 100% Thao tác qua Giao diện Web (UI-Only)

| STT | Tên ngắn | Quy tắc bắt buộc |
| :-: | :--- | :--- |
| 1 | Chỉ qua UI | Mọi thao tác ánh xạ đối tác/mặt hàng, chuyển PO→SO, nhập lô NSX/HSD, tạo đơn bán SO xuất theo lô, điều chuyển kho FIFO và kiểm kê đều thực hiện **trực tiếp trên giao diện trình duyệt**. Tuyệt đối không gọi API ngầm, không sửa `localStorage`/IndexedDB. |
| 2 | Chứng từ & Số lô | Khi nhận hàng PO FIFO hoặc nhập kho tạo lô mới, điền đủ **Ngày sản xuất (NSX)**, **Hạn sử dụng (HSD)**, **Nhà sản xuất** (nếu bật) và đúng **ĐVT chuẩn**; nút lưu / xác nhận trạng thái chỉ hợp lệ sau khi thấy thông báo lưu thành công và mã lô ngắn được cấp. |
| 3 | Không xóa cứng | Chỉ dùng nút chuyển vào **Thùng rác đơn hàng (`CS-FIFO-18`)** / **Hủy / Khôi phục** chuẩn trên UI; không xóa vĩnh viễn chứng từ PO, SO hay lô đã có tiêu thụ. |
| 4 | Hỏi trước khi xuất/áp tồn | Luôn hỏi xác nhận người dùng trước khi thực hiện thao tác tác động tồn & công nợ: **Xác nhận nhập PO→SO** (`CS-MH-20`), **Nhận lô vào kho** (`CS-FIFO-16` / `CS-FIFO-01`), **Xuất kho theo SO FIFO** (`CS-FIFO-08`), **Điều chuyển kho FIFO** (`CS-FIFO-20`), hoặc **Áp dụng đặt lại tồn kiểm kê** (`CS-FIFO-21`). |
| 5 | Truy vết sau thao tác | Sau mỗi lần nhận lô hoặc xuất bán SO, kiểm tra lại số dư từng lô trên **Tồn kho FIFO (`CS-FIFO-05`)** hoặc mở chi tiết **Lô theo mã ngắn (`CS-FIFO-17`)** để xác nhận lượng tiêu thụ khớp chứng từ. |

---

## 2. Cơ chế Tự khám phá Màn hình & Tài liệu ngay trên Giao diện

1. **Đi theo menu bên trái (sidebar):** Mở từ nhóm *Kho FIFO* (`/inventory-fifo`). Nếu công ty sử dụng chức năng Ánh xạ & Nhập đơn PO→SO ở nhánh `/inventory/*` thay cho `/inventory-fifo/*`, dùng đúng menu đang hiện trên giao diện.
2. **Đọc cổng hướng dẫn sử dụng (`https://guide.catersoft.vn/mua-hang-kho/kho-fifo-mua-ban-kiem-ke` & `/mua-hang-kho/nhap-don-tu-doi-tac`):** Khi hướng dẫn và giao diện khác nhau, ưu tiên làm theo giao diện thực tế rồi báo cho người dùng.
3. **Đọc danh mục chức năng DOM (`page-function-catalog`):**
   - Đọc `document.querySelector('script[data-slot="page-function-catalog"]')?.textContent` cùng `location.pathname` để xác định `pageCode` (`CS-FIFO-01..24`, `CS-QLK-19..20`, `CS-MH-20`) và các nút gắn `[data-function-code="..."]`.
4. **Màn hình Quy trình Kho FIFO (`/inventory-fifo`, `CS-FIFO-06`):** Sơ đồ điều hướng trực quan chuỗi Mua → Nhập lô → Xuất bán SO → Điều chuyển → Kiểm kê.

Luôn đọc skill **`cs-ui-ban-do-fifo-trading`** trước để nắm đúng thứ tự từ Ánh xạ / Danh mục → Nhận lô → Xuất SO FIFO → Tồn lô & Kiểm kê.

---

## 3. Bảy Quy tắc Vàng Thao tác Giao diện CaterSoft (Zero-Guessing UI Playbook)

| STT | Tên ngắn | Thành phần UI | Cơ chế DOM thực tế | Thao tác chuẩn |
| :-: | :--- | :--- | :--- | :--- |
| 1 | Ô chọn | `Select` (NCC, Khách, Kho, Mặt hàng, NSX, Mã lô) | Antd v6 dùng `.ant-select-content` và `input[role="combobox"]`. Tìm theo **tên tiếng Việt không dấu** hoặc **mã lô ngắn** hiển thị; `Enter` không tự chọn dòng ở dropdown thường. | Click `.ant-select-content` (hoặc `ArrowDown` `keyCode: 40`), gõ từ khóa không dấu / mã lô, **click trực tiếp** vào dòng `.ant-select-item-option` đúng. |
| 2 | Ô số lưới | `EditableAntdNumberRenderer` | Trước khi click chỉ là `<div id="editable-number-display-...">`; click mới render `<input class="ant-input-number-input">`. | Click `div` số (nhận lô, xuất lô, tồn đếm kiểm kê) → gõ số mới → nhấn **`Enter`** và đọc lại ô. |
| 3 | Nút Popover | `ActionPopoverButton` (`Thao tác` / `⋯`) | Lệnh xuất/nhập Excel, xem lịch sử tiêu thụ lô, áp giá, xóa vào thùng rác nằm gọn trong Popover. | Click `Thao tác` / `⋯` → chờ Popover mở → click đúng lệnh. |
| 4 | Khối thu gọn | `CollapseV2` | Chi tiết phân bổ trừ lô FIFO trên SO hoặc danh sách lô con trong phiếu nhận có thể đang thu gọn. | Click thanh tiêu đề `CollapseV2` để mở rộng trước khi kiểm tra số từng lô. |
| 5 | Hộp thoại | `BaseModalV2` & «Đóng sau khi lưu» | Modal khai Nhà sản xuất, Ánh xạ hoặc chọn lô thủ công dùng `BaseModalV2`. | Nhập nhiều bản ghi thì tắt công tắc «Đóng sau khi lưu»; đọc toast thành công trước khi đóng. |
| 6 | Lưu bộ đệm | `PendingChangesButtons` (`Lưu thay đổi`) | Sửa bảng giá bán KH tháng (`CS-FIFO-09`) hoặc số đếm kiểm kê theo lô (`CS-FIFO-21`) khóa bộ lọc khi `pendingChanges > 0`. | Bấm **«Lưu thay đổi»** và chờ xác nhận trước khi đổi tháng, kho hoặc khách hàng. |
| 7 | Chọn ngày / HSD | `DateSelect` / `DatePicker` | Dùng chuẩn `DD/MM/YYYY` cho ngày chứng từ, NSX và HSD của lô. | Click ô ngày → Chọn toàn bộ → gõ `DD/MM/YYYY` → nhấn **`Enter`** và đọc lại đúng định dạng ngày/tháng. |
