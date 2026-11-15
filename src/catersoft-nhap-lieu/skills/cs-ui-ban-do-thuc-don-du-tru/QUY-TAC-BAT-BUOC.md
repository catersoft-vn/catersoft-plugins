# Quy tắc Vận hành & Nhập liệu Giao diện CaterSoft cho Agent AI của Khách hàng

Khi hỗ trợ nhân sự của khách hàng tìm hiểu, thao tác hoặc nhập liệu trên phần mềm CaterSoft, Agent AI tuân thủ nghiêm ngặt các nguyên tắc giao diện dưới đây.

## 1. Nguyên tắc Ranh giới: 100% Thao tác qua Giao diện Web (UI-Only)

| STT | Tên ngắn | Quy tắc bắt buộc |
| :-: | :--- | :--- |
| 1 | Chỉ qua UI | Mọi thao tác tra cứu, tạo mới, cập nhật, nhập Excel và đối soát đều thực hiện **trực tiếp trên giao diện trình duyệt** của phần mềm CaterSoft giống hệt một nhân viên nghiệp vụ (Click, Chọn, Gõ, Lưu). Tuyệt đối không tự gọi API ngầm, không sửa `localStorage`/IndexedDB bằng tay để làm thay chức năng của trang. |
| 2 | Lưu thay đổi | Mỗi trang lưu một kiểu: **Thực đơn tuần (Tổng hợp)**, **Dự trù ngày**, **Dự trù ngày (Tổng hợp)** và **Nhập phần ăn (pivot)** lưu ngay khi đổi (nút lưu / «Thử lại» chỉ hiện khi lỗi); **Thực đơn tuần** bản cũ có công tắc **«Tự lưu»**; lưới định lượng, **Phần ăn thực tế** và các bảng sửa nhanh dùng nút **«Lưu thay đổi»**; ngăn kéo **Thiết lập thực đơn** tự lưu (chờ «Đã lưu» trước khi đóng); các cửa sổ thêm/sửa danh mục dùng **«Tạo mới» / «Cập nhật»**. Luôn chờ thông báo lưu thành công trước khi chuyển ngày, đổi bếp hoặc rời trang. |
| 3 | Không xóa cứng | Chỉ dùng nút **Vô hiệu hóa / Xóa** chuẩn trên giao diện (xóa mềm, khôi phục được); không bao giờ tìm cách xóa vĩnh viễn dữ liệu. |
| 4 | Hỏi trước khi thay toàn bộ | Thao tác ghi đè hàng loạt chỉ làm khi người dùng xác nhận rõ ràng: «Khởi tạo nguyên liệu từ Excel» (xóa toàn bộ định lượng của ngân hàng thực đơn), «Ghi đè tất cả» khi lấy số từ dự trù, «Dán» phần ăn / «Copy» thiết lập sang bếp khác, «Đồng bộ đơn giá» phần ăn thực tế, sửa «Tên hiển thị (bản in)» của cơ cấu món, sửa cấu hình báo cáo dùng chung. |
| 5 | Kiểm bằng mắt | Sau mỗi nhóm thao tác, đọc lại trên trang (và tải lại trang khi cần) để chắc dữ liệu đã lưu đúng; hộp thoại đã đóng hay nút đã bấm không phải bằng chứng. Số nguồn không có thì để trống, không tự điền 0. |

---

## 2. Cơ chế Tự khám phá Màn hình & Tài liệu ngay trên Giao diện

Khi gặp một màn hình mới trên CaterSoft, Agent AI không cần đoán mò mà tra cứu theo 4 bước chuẩn sau:

1. **Đi theo menu bên trái (sidebar):**
   - Mọi màn hình nghiệp vụ đều mở từ menu bên trái theo nhóm (*Thực đơn dự trù*, *Món ăn/Nguyên liệu*, *Dữ liệu chung*…). Tên menu trong các skill của plugin này là tên hiển thị trên menu; đường dẫn (route) chỉ dùng để đối chiếu thanh địa chỉ.
   - Mỗi khách hàng có thể bật/tắt một số mục menu theo gói và quyền; nếu không thấy mục nào, báo lại cho người dùng thay vì gõ đường dẫn để vào.
2. **Đọc cổng hướng dẫn sử dụng (`https://guide.catersoft.vn`):**
   - Mở từ **Menu Tài khoản (góc dưới bên trái sidebar) → Hướng dẫn sử dụng** hoặc truy cập thẳng `https://guide.catersoft.vn`. Mục dùng cho plugin này là **Thực đơn & Dự trù** (`https://guide.catersoft.vn/thuc-don`). Danh sách đầy đủ các bài nằm trong `https://guide.catersoft.vn/sitemap.xml`.
   - Khi bài hướng dẫn, skill và giao diện khác nhau, làm theo **giao diện đang thấy** (bài hướng dẫn có thể chậm hơn bản phần mềm mới), rồi báo lại chỗ khác cho người dùng.
3. **Đọc danh mục chức năng của màn hình hiện tại trong DOM (`page-function-catalog`):**
   - Màn hình CaterSoft (kể cả trên môi trường production) nhúng sẵn một thẻ JSON ẩn trong DOM:
     ```html
     <script type="application/json" data-slot="page-function-catalog" data-page-code="CS-...">
     ```
   - Chỉ cần đọc nội dung JSON của thẻ này (`document.querySelector('script[data-slot="page-function-catalog"]')?.textContent`; đường dẫn hiện tại đọc từ `location.pathname`), Agent AI sẽ biết ngay:
     - `pageCode`, `pageTitle` (và trên các trang gộp tab dùng `PageDockHost` như `CS-MNL-03`, `CS-DLC-12`, `CS-TC-09` còn có `ownPageCodes` cùng `guests: [{ pageCode, pageTitle }]` chỉ rõ mã và tên của tab con đang mở).
     - Danh sách toàn bộ chức năng trên màn hình trong mảng `functions` (`code`: `<PAGE>-F01..Fnn` hoặc `CS-UI-CSnn-Fnn`, `name`: tên chức năng tiếng Việt, `status`: trạng thái, `detail`: mô tả thao tác, `visibility`: điều kiện hiển thị theo `roles` / `anyRoute`) và `dockFunctions` (`CS-UI-CS01-F01..F06`).
   - Các phần tử giao diện tương ứng trên màn hình được đánh dấu bằng thuộc tính `[data-function-code="<PAGE>-Fnn"]`. Mã trang trong thẻ này (hoặc trong `guests` khi đang ở tab con của trang gộp) là nguồn đúng nhất; nếu khác mã ghi trong skill, dùng mã trong thẻ.
4. **Xem màn hình «Quy trình» trực quan ngay trong phần mềm:** nhóm menu **Thực đơn dự trù** (`/weekly-meal-plan`, `CS-TDT-18`) vẽ chuỗi màn hình thực đơn – dự trù; **Tiện ích** (`/tien-ich`, `CS-TI-03`) có trình hướng dẫn Khởi tạo bếp mới và Dựng ngân hàng thực đơn.

Luôn đọc skill **`cs-ui-ban-do-thuc-don-du-tru`** trước: nó cho biết dữ liệu nào phụ thuộc dữ liệu nào và cách truy ngược khi dự trù trống hoặc sai.

---

## 3. Bảy Quy tắc Vàng Thao tác Giao diện CaterSoft (Zero-Guessing UI Playbook)

Giao diện CaterSoft sử dụng bộ thành phần `@repo/catersoft-ui` và Ant Design v6. Để thao tác chính xác ngay từ lần đầu, Agent AI luôn áp dụng 7 cơ chế DOM sau:

| STT | Tên ngắn | Thành phần UI | Cơ chế DOM thực tế | Thao tác chuẩn: Click → Chọn → Gõ → Xác nhận |
| :-: | :--- | :--- | :--- | :--- |
| 1 | Ô chọn | `Select` / `KitchenSelect` | Ant Design v6 dùng `.ant-select-content` và `input[role="combobox"]` (không còn `.ant-select-selector` của Antd v5). Tìm kiếm theo **tên tiếng Việt không dấu** (không tìm theo mã `code`). Phím `Enter` **không** chọn mục trong dropdown thường. Ô tìm không phân biệt dấu nên so đủ tên có dấu trước khi bấm. Các bảng chọn có ô tìm riêng (chọn Ngân hàng thực đơn, khách hàng) thì bấm đúng dòng; chọn nhiều thì Esc để đóng. Hộp «Chọn Món Ăn» của thực đơn tuần: xem skill `cs-ui-thuc-don-tuan-du-tru-ngay`. | 1. **Click** vào `.ant-select-content` (hoặc `input[role="combobox"]`; nếu mở bằng JS thì gửi `ArrowDown` kèm `keyCode: 40, which: 40`) để mở danh sách.<br>2. **Gõ** từ khóa tiếng Việt không dấu (ví dụ: `cu chi`, `thit kho`).<br>3. **Click trực tiếp** vào dòng `.ant-select-item-option` khớp tên có dấu. |
| 2 | Ô số lưới | `EditableAntdNumberRenderer` | Khi chưa bấm chỉ là thẻ `<div id="editable-number-display-...">` (chưa có `<input>`). Khi click vào mới sinh `<input class="ant-input-number-input">`. | 1. **Click** vào `div` hiển thị số (ô tự bôi đen số cũ).<br>2. **Gõ** trực tiếp số mới (không dùng `fill` nối chuỗi).<br>3. Nhấn **`Enter`** để ghi số; trên một số lưới (ví dụ Nhập phần ăn `CS-DTP-01`) con trỏ tự nhảy xuống ô dòng kế tiếp cùng cột. Đọc lại ô sau khi nhập. |
| 3 | Nút Popover | `ActionPopoverButton` (`Thao tác` / `Mở rộng` / `⋯`) | Các lệnh `Tải lại`, `Cập nhật cấu hình mới nhất`, `Copy Thực đơn tuần`, `Copy Số phần ăn`, nhập/xuất Excel được gom gọn bên trong menu Popover. | 1. **Click** nút `Thao tác` / `Mở rộng` / `⋯` trên thanh tiêu đề trang hoặc bảng.<br>2. Chờ Popover mở ra.<br>3. **Click** vào mục lệnh cần dùng bên trong Popover. |
| 4 | Khối thu gọn | `CollapseV2` (Accordion) | Một số khối như các ca ăn trên Thực đơn tuần hoặc khối `Doanh thu bổ sung` / `Tổng cộng` trên trang Nhập phần ăn có thể đang ở trạng thái thu gọn. | Kiểm tra trạng thái mở của thanh tiêu đề `CollapseV2`; nếu đang đóng, **click vào thanh tiêu đề** để bung nội dung ra trước khi tìm nút bên trong. |
| 5 | Hộp thoại | `BaseModalV2` & công tắc «Đóng sau khi lưu» | Nhiều hộp thoại tạo mới có công tắc **«Đóng sau khi lưu»** ở chân modal (mặc định bật). Hộp không có công tắc này (ví dụ «Thêm nguyên liệu mới») thì vẫn mở sau khi tạo để nhập tiếp: đọc thông báo thành công, rồi tự đóng. | - **Nhập 1 bản ghi:** Điền form → giữ bật «Đóng sau khi lưu» → bấm `Tạo` / `Lưu`.<br>- **Nhập nhiều bản ghi liên tiếp:** **Tắt** «Đóng sau khi lưu» ở bản ghi đầu → bấm `Tạo` (form tự lưu và xóa trắng để nhập tiếp ngay trên cùng hộp thoại).<br>- **Bấm «Hủy» mà chưa gõ gì** vẫn có thể hiện «Nội dung chưa được lưu»: không định lưu thì chọn **«Đóng, không lưu»** (có khi phải bấm vài lần); hộp còn bám sang trang khác thì tải lại trang. |
| 6 | Lưu bộ đệm | `PendingChangesButtons` (`Lưu thay đổi`) | Khi có ô vừa sửa (`pendingChanges > 0`), các bộ lọc `Ngày` / `Bếp` sẽ tạm khóa (`disabled`) để bảo vệ dữ liệu chưa lưu. | Sau khi nhập xong một ca hoặc một bảng, bấm nút **«Lưu thay đổi»**, chờ thông báo thành công rồi mới đổi bộ lọc.<br>Ngoại lệ: trang tự lưu (Thực đơn tuần (Tổng hợp), Dự trù ngày, Dự trù ngày (Tổng hợp), Nhập phần ăn (pivot), ngăn kéo Thiết lập thực đơn) không có nút này khi lưu bình thường; chờ nhãn «Đã lưu». |
| 7 | Chọn ngày | `DateSelect` / `WeekSelect` | Hiển thị trên giao diện theo định dạng `DD/MM/YYYY` (hoặc tuần `YYYY-WW`). | Click vào ô ngày → chọn toàn bộ (`Select All`) → gõ ngày mới và nhấn **`Enter`** để tải dữ liệu. |
