# Quy tắc Vận hành & Nhập liệu Giao diện Mua hàng — Nhà cung cấp — Kho CaterSoft

Khi hỗ trợ bộ phận thu mua hoặc thủ kho của khách hàng thao tác trên CaterSoft, Agent AI tuân thủ nghiêm ngặt các nguyên tắc giao diện dưới đây.

## 1. Nguyên tắc Ranh giới: 100% Thao tác qua Giao diện Web (UI-Only)

| STT | Tên ngắn | Quy tắc bắt buộc |
| :-: | :--- | :--- |
| 1 | Chỉ qua UI | Mọi thao tác tra cứu, tạo phiếu PR/PO, duyệt tổng hợp, nhận hàng, xuất/chuyển kho, kiểm kê và sửa bảng giá NCC đều thực hiện **trực tiếp trên giao diện trình duyệt** (Click, Chọn, Gõ, Lưu). Tuyệt đối không gọi API ngầm, không sửa `localStorage`/IndexedDB. |
| 2 | Lưu & Chuyển trạng thái | Bảng giá tháng lưới (`CS-MH-13`) và kiểm kê dùng chế độ sửa hàng loạt / nút **«Lưu thay đổi»**; các modal thêm/sửa Kho, NCC, Quy tắc khu vực dùng **«Tạo mới» / «Cập nhật»**; chứng từ PR/PO và phiếu kho chuyển trạng thái qua nút hành động trên màn hình (**Gửi duyệt**, **Duyệt**, **Xác nhận đặt hàng**, **Xác nhận đã giao**, **Hoàn thành / Nhập kho**, **Áp dụng đặt lại tồn**). Luôn chờ thông báo thành công trước khi chuyển tab hoặc đóng trang. |
| 3 | Không xóa cứng | Chỉ dùng nút **Hủy / Vô hiệu hóa / Lưu trữ** chuẩn trên giao diện (khôi phục được); không tìm cách xóa vĩnh viễn PO, PR hoặc phiếu kho đã phát sinh. |
| 4 | Hỏi trước khi chốt/khóa | Luôn xác nhận lại với người dùng trước khi thực hiện thao tác ảnh hưởng rộng: **Duyệt & Sinh PO hàng loạt** từ tổng hợp PR (`CS-MH-01`), **Xác nhận đã giao / Hoàn thành nhập kho** PO làm tăng tồn & công nợ, **Áp dụng đặt lại tồn** từ phiếu kiểm kê (`CS-QLK-05`), hoặc **Khóa kỳ nhập xuất tồn** (`CS-NXT-09`). |
| 5 | Kiểm bằng mắt | Sau khi lưu chứng từ hoặc chốt nhập/xuất/kiểm kê, mở lại danh sách / Tồn kho (`CS-QLK-09`) / Thẻ kho (`CS-QLK-11`) để đọc số dư thực tế sau giao dịch; hộp thoại đóng chưa đủ làm bằng chứng. |

---

## 2. Cơ chế Tự khám phá Màn hình & Tài liệu ngay trên Giao diện

1. **Đi theo menu bên trái (sidebar):** Mở từ nhóm *Mua hàng*, *Nhà cung cấp*, *Quản lý kho*. Một số mục hiển thị theo gói (V2 vs Đơn giản); nếu không thấy mục nào, báo người dùng kiểm tra phân quyền thay vì tự mở URL lạ.
2. **Đọc cổng hướng dẫn sử dụng (`https://guide.catersoft.vn/mua-hang-kho`):** Mở từ Menu Tài khoản ở góc dưới bên trái sidebar → Hướng dẫn sử dụng. Khi bài hướng dẫn và giao diện khác nhau, làm theo giao diện đang thấy rồi báo người dùng.
3. **Đọc danh mục chức năng DOM (`page-function-catalog`):**
   - Màn hình CaterSoft nhúng thẻ ẩn `<script type="application/json" data-slot="page-function-catalog" data-page-code="CS-...">`.
   - Đọc `document.querySelector('script[data-slot="page-function-catalog"]')?.textContent` (cùng `location.pathname`) để lấy đúng `pageCode`, `pageTitle`, tab con `guests` (nếu là trang `PageDockHost`), và mảng `functions` (`CS-*-F01..Fnn` + `[data-function-code="..."]`).
4. **Màn hình Tổng quan Kho (`/inventory`, `CS-QLK-17`):** Vẽ luồng & điều hướng nhanh sang giao dịch, cân bằng kho, thẻ kho, kiểm kê và chứng từ mua.

Luôn đọc skill **`cs-ui-ban-do-mua-hang-kho`** trước để biết luồng phụ thuộc giữa Kho → NCC & Giá vùng → PR → PO → Giao nhận → Nhập xuất tồn.

---

## 3. Bảy Quy tắc Vàng Thao tác Giao diện CaterSoft (Zero-Guessing UI Playbook)

| STT | Tên ngắn | Thành phần UI | Cơ chế DOM thực tế | Thao tác chuẩn |
| :-: | :--- | :--- | :--- | :--- |
| 1 | Ô chọn | `Select` / `SupplierSelect` / `WarehouseSelect` | Antd v6 dùng `.ant-select-content` và `input[role="combobox"]` (không dùng `.ant-select-selector`). Tìm theo **tên tiếng Việt không dấu**; `Enter` không chọn dòng trong dropdown thường. | Click `.ant-select-content` (hoặc gửi `ArrowDown` `keyCode: 40`), gõ từ khóa không dấu, **click trực tiếp** dòng `.ant-select-item-option` khớp tên có dấu. |
| 2 | Ô số lưới | `EditableAntdNumberRenderer` | Trước khi click chỉ là `<div id="editable-number-display-...">`; click vào mới render `<input class="ant-input-number-input">`. | Click `div` số (tự chọn hết số cũ) → gõ số mới (số lượng mua, thực nhận, tồn đếm, đơn giá) → nhấn **`Enter`** và đọc lại ô. |
| 3 | Nút Popover | `ActionPopoverButton` (`Thao tác` / `⋯`) | Các lệnh nhập/xuất Excel, tách/gộp PO, gửi mail PO, lọc hàng loạt nằm trong Popover. | Click `Thao tác` / `⋯` trên thanh tiêu đề hoặc dòng → chờ Popover mở → click lệnh. |
| 4 | Khối thu gọn | `CollapseV2` | Một số chi tiết tổng hợp theo ngày/NCC hoặc chi tiết đơn hàng trên PO đang thu gọn. | Kiểm tra trạng thái mở của thanh tiêu đề `CollapseV2`; click mở rộng trước khi thao tác ô bên trong. |
| 5 | Hộp thoại | `BaseModalV2` & «Đóng sau khi lưu» | Modal thêm nhiều nguyên liệu vào phiếu hoặc bảng giá có công tắc «Đóng sau khi lưu». | Nhập nhiều dòng thì **tắt** công tắc ở dòng đầu; bấm «Hủy» nếu không sửa gì mà hiện cảnh báo chưa lưu thì chọn «Đóng, không lưu». |
| 6 | Lưu bộ đệm | `PendingChangesButtons` (`Lưu thay đổi`) | Khi đang có dòng sửa chưa lưu trên bảng giá/kiểm kê (`pendingChanges > 0`), bộ lọc tháng/kho tạm khóa (`disabled`). | Bấm **«Lưu thay đổi»** và chờ thông báo thành công trước khi đổi kho/tháng. |
| 7 | Chọn ngày / kỳ | `DateSelect` / `RangePicker` | Hiển thị `DD/MM/YYYY` hoặc `MM/YYYY` cho bảng giá tháng & kỳ kiểm kê. | Click ô ngày → Chọn toàn bộ → gõ ngày mới → nhấn **`Enter`** để tải dữ liệu. |
