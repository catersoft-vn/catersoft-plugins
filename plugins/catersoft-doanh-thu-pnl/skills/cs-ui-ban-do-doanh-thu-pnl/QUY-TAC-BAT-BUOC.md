# Quy tắc Vận hành & Nhập liệu Giao diện Tài chính — Thu chi — Công nợ — P&L CaterSoft

Khi hỗ trợ bộ phận kế toán hoặc quản lý của khách hàng thao tác trên CaterSoft, Agent AI tuân thủ nghiêm ngặt các nguyên tắc tài chính và giao diện dưới đây.

## 1. Nguyên tắc Ranh giới: 100% Thao tác qua Giao diện Web (UI-Only)

| STT | Tên ngắn | Quy tắc bắt buộc |
| :-: | :--- | :--- |
| 1 | Chỉ qua UI | Mọi thao tác thiết lập tài khoản/phương thức thanh toán, tạo ĐNTT, ghi phiếu thu/chi, đối soát công nợ, nhập phần ăn thực tế, sửa bảng giá KH và xem/xuất báo cáo P&L đều thực hiện **trực tiếp trên giao diện trình duyệt**. Tuyệt đối không gọi API ngầm, không sửa `localStorage`/IndexedDB. |
| 2 | Chuẩn sổ & Số dư | Khi ghi nhận phiếu thu/chi (`CS-TC-08`), luôn chọn đúng **Quỹ tiền mặt / Tài khoản ngân hàng**, **Phương thức thanh toán**, **Loại giao dịch (Kinh doanh hay Nội bộ)** và **Hạng mục dòng tiền** để không làm sai lệch số dư đầu/cuối kỳ hoặc dòng P&L. |
| 3 | Không xóa cứng | Không tìm cách xóa vĩnh viễn ĐNTT, phiếu thu/chi hoặc chứng từ công nợ đã lập; chỉ dùng chức năng **Hủy / Vô hiệu hóa / Lưu trữ** chuẩn trên giao diện khi có quyền và lý do hợp lệ. |
| 4 | Hỏi trước khi duyệt chi/sửa P&L | Tài chính liên quan trực tiếp tới tiền và số liệu báo cáo. Luôn **hỏi xác nhận người dùng** trước khi bấm: **Duyệt / Đánh dấu Đã thanh toán (Tạo phiếu chi tự động)** trên ĐNTT (`CS-TC-04`), **Chuyển phiếu Thu chưa xác định** sang thu xác định (`CS-TC-08`), **Lưu / Áp hàng loạt bảng giá KH** (`CS-DTP-09`), **Đồng bộ đơn giá phần ăn thực tế**, hoặc **Sửa cấu hình Báo cáo P&L dùng chung (`CS-QTH-01B`)**. |
| 5 | Kiểm số đọc lại | Sau khi ghi phiếu thu/chi hoặc chốt phần ăn thực tế, mở lại **Sổ quỹ / Nhật ký (`CS-TC-08` / `CS-TC-01`)**, **Sổ công nợ (`CS-TC-26`, `CS-TC-27`)** hoặc **Báo cáo P&L (`CS-BC-02`)** kiểm tra số dư & chênh lệch hiển thị thực tế. |

---

## 2. Cơ chế Tự khám phá Màn hình & Tài liệu ngay trên Giao diện

1. **Đi theo menu bên trái (sidebar):** Mở từ nhóm *Kế toán / Thu chi*, *Công nợ*, *Khách hàng*, *Báo cáo*. Các mục *Cấu hình P&L* (`CS-QTH-01B`) và *Kế toán thuế* (`CS-TC-14`, `CS-TC-15`) phụ thuộc phân quyền; nếu không thấy, báo người dùng kiểm tra quyền.
2. **Đọc cổng hướng dẫn sử dụng (`https://guide.catersoft.vn`):** Khi hướng dẫn và giao diện thực tế có điểm mới khác nhau, làm theo giao diện đang hiển thị rồi báo cho người dùng.
3. **Đọc danh mục chức năng DOM (`page-function-catalog`):**
   - Đọc `document.querySelector('script[data-slot="page-function-catalog"]')?.textContent` cùng `location.pathname` để lấy chính xác `pageCode` (`CS-TC-*`, `CS-DTP-*`, `CS-BC-*`, `CS-DLC-*`), tab con `guests` (nếu là trang `PageDockHost`), và nút `[data-function-code="..."]`.
4. **Màn hình Quy trình Kế toán (`CS-TC-17`) & Thu chi Công nợ (`CS-TC-18`):** Xem bản đồ trực quan các chặng *Đề nghị chi → Phiếu thu chi → Nhật ký quỹ → Công nợ phải trả/thu → Báo cáo công nợ*.

Luôn đọc skill **`cs-ui-ban-do-doanh-thu-pnl`** trước để biết công thức phụ thuộc giữa Danh mục tài chính, Giá KH, Thu chi và các dòng P&L.

---

## 3. Bảy Quy tắc Vàng Thao tác Giao diện CaterSoft (Zero-Guessing UI Playbook)

| STT | Tên ngắn | Thành phần UI | Cơ chế DOM thực tế | Thao tác chuẩn |
| :-: | :--- | :--- | :--- | :--- |
| 1 | Ô chọn | `Select` (TK ngân hàng, Hạng mục, Đối tượng, Bếp/Site) | Antd v6 dùng `.ant-select-content` và `input[role="combobox"]`. Tìm theo **tên tiếng Việt không dấu**; `Enter` không tự chọn ở dropdown thường. | Click `.ant-select-content` (hoặc `ArrowDown` `keyCode: 40`), gõ từ khóa không dấu, **click trực tiếp** dòng `.ant-select-item-option` khớp tên có dấu. |
| 2 | Ô số tiền / phần | `EditableAntdNumberRenderer` / `InputNumber` | Ô lưới chỉ render `<input class="ant-input-number-input">` sau khi click vào `<div id="editable-number-display-...">`. | Click `div` số → gõ trực tiếp số tiền / số phần ăn → nhấn **`Enter`** và kiểm tra lại số đã làm tròn/hiển thị đúng. |
| 3 | Nút Popover | `ActionPopoverButton` (`Thao tác` / `⋯`) | Lệnh xuất Excel báo cáo KQKD, xuất bút toán tháng, đồng bộ đơn giá, nhập Excel bảng giá KH nằm trong Popover. | Click `Thao tác` / `⋯` → chờ Popover mở → click lệnh tương ứng. |
| 4 | Khối thu gọn | `CollapseV2` | Khối chi tiết nhóm doanh thu / giá vốn / chi phí trên P&L hoặc phần *Doanh thu bổ sung* trên Nhập phần ăn có thể thu gọn. | Click thanh tiêu đề `CollapseV2` để mở rộng trước khi đọc chi tiết từng dòng con. |
| 5 | Hộp thoại | `BaseModalV2` & «Đóng sau khi lưu» | Hộp tạo Tài khoản ngân hàng, Hạng mục kế toán, Phiếu thu/chi, Điểm P&L dùng `BaseModalV2`. | Nhập nhiều dòng thì tắt «Đóng sau khi lưu»; đọc toast thông báo thành công rồi mới đóng modal. |
| 6 | Lưu bộ đệm | `PendingChangesButtons` (`Lưu thay đổi`) | Sửa hàng loạt **Bảng giá KH pivot (`CS-DTP-09`)** hoặc **Phần ăn thực tế (`CS-DTP-01B`)** giữ thay đổi trong bộ nhớ đệm (`pendingChanges > 0`) và khóa bộ lọc ngày/bếp. | Bấm **«Lưu thay đổi»** và chờ thông báo thành công trước khi chuyển kỳ hoặc đổi khách hàng/bếp. |
| 7 | Chọn ngày / tháng | `DateSelect` / `MonthPicker` / `RangePicker` | Dùng `DD/MM/YYYY` (ngày giao dịch/báo cáo) hoặc `MM/YYYY` (bảng giá tháng, P&L tháng). | Click ô ngày/tháng → Chọn toàn bộ → gõ ngày/tháng mới → nhấn **`Enter`** để tải số liệu. |
