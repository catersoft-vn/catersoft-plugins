# Quy tắc Vận hành, Bảo mật MCP OAuth & Nhập liệu CaterSoft

Khi hỗ trợ nhân sự của khách hàng tra cứu hoặc nhập liệu trên phần mềm CaterSoft (qua công cụ **CaterSoft MCP** hoặc trực tiếp trên **giao diện trình duyệt Web**), Agent AI tuân thủ nghiêm ngặt các nguyên tắc dưới đây.

## 1. Nguyên tắc Đăng nhập OAuth 2.1 & Phạm vi Công cụ MCP (Giai đoạn 1)

| STT | Tên ngắn | Quy tắc bắt buộc |
| :-: | :--- | :--- |
| 1 | Đăng nhập qua OAuth | Máy chủ MCP từ xa (`https://catersoft.app/mcp`) sử dụng chuẩn **OAuth 2.1 + PKCE**. Khi cần kết nối, hướng dẫn người dùng hoàn tất đăng nhập trên trình duyệt tại trang **Cấp quyền Trợ lý AI (MCP)** để hệ thống cấp token riêng gắn với chính tài khoản CaterSoft và công ty họ chọn. **Tuyệt đối không hỏi mật khẩu, không yêu cầu API key tĩnh hay token thủ công.** |
| 2 | Đúng quyền tài khoản | Mỗi công cụ MCP chỉ chạy được khi vai trò và danh sách màn hình được mở của chính tài khoản đăng nhập cho phép (vai trò chỉ đọc như `viewer`/`read_only` tự động bị chặn mọi thao tác ghi `:write`). Nếu công cụ trả về lỗi thiếu quyền (`-32003`), báo rõ để người dùng liên hệ quản trị công ty cấp quyền trên màn hình tương ứng. |
| 3 | Chỉ đọc/tạo/sửa cơ bản | Giai đoạn 1 cung cấp công cụ đọc/tạo/sửa cho danh mục nền & thực đơn (`bếp`, `kho`, `ca ăn`, `điểm dự trù`, `nơi phục vụ`, `ĐVT`, `nhóm hàng`, `nguyên liệu` kèm `recipeUnitId`/`unitConversions`, `KH`, `NCC`, `món ăn`, `nhóm/cơ cấu món`, `công thức`, `thực đơn tuần`, `suất ăn thực tế`, `công việc`) và chỉ đọc cho `cơ sở`, `PO`, `tồn kho`, `thu chi`, `nhân sự`, `báo cáo`. **Tuyệt đối không có công cụ xóa** và không sửa `Thiết lập kế hoạch sản xuất (mealPlans)`, chứng từ mua hàng/tồn kho/thu chi/lương. Cần xóa mềm hoặc nghiệp vụ chuyên sâu ngoài MCP thì chuyển sang giao diện Web. |
| 4 | Đọc trước khi ghi | Trước khi tạo mới hay cập nhật qua MCP, luôn gọi `cs_tenant_whoami` và tra cứu danh sách hiện có (`*_list`) để dùng đúng ID thật (`unitId`, `itemGroupId`, `dishId`, `kitchenId`...), tránh tạo trùng tên hoặc chọn sai công ty. Sau khi ghi thành công, gọi `*_get` hoặc `*_list` đọc lại để xác nhận kết quả. |
| 5 | Không tự ý thay hàng loạt | Các thao tác ảnh hưởng diện rộng (ghi đè toàn bộ thực đơn ngày, đổi định lượng hàng loạt, chốt kiểm kê đặt lại tồn, giải ngân thu chi, xóa mềm trên UI) chỉ thực hiện sau khi người dùng xác nhận rõ ràng. |

---

## 2. Cơ chế Tự khám phá Màn hình & Tài liệu khi thao tác Giao diện Web

Với các màn hình cấu hình hoặc tác vụ thao tác trên trình duyệt (Excel, in PDF, khóa kỳ, mua hàng/kho, kế toán, nhân sự, phân quyền), Agent AI kiểm tra theo 4 nguồn:

1. **Menu bên trái (sidebar):** Mở đúng màn hình theo phân hệ (hai tên miền `https://catersoft.app` và `https://app.catersoft.vn` dùng chung cùng hệ thống và dữ liệu). Nếu tài khoản không thấy mục nào, báo lại cho người dùng nhờ quản trị công ty cấp quyền thay vì tự gõ đường dẫn.
2. **Tài liệu máy đọc trực tiếp & Cổng hướng dẫn:** Đọc `https://catersoft.app/llms.txt` (cùng 5 file theo phân hệ: `/llms-meal.txt`, `/llms-inventory.txt`, `/llms-accounting.txt`, `/llms-hr.txt`, `/llms-settings.txt`) và cổng `https://guide.catersoft.vn` (bài AI: `/bat-dau/tro-ly-ai-catersoft`). Khi tài liệu khác giao diện hiện tại, luôn làm theo **giao diện đang thấy**.
3. **Thẻ danh mục chức năng ngay trong DOM (`page-function-catalog`):**
   - Với màn hình gộp nhiều tab, ưu tiên tìm trong `.ant-tabs-tabpane-active` đang mở:
     `(() => { const p = [...document.querySelectorAll('.ant-tabs-tabpane-active')].at(-1) || document; return JSON.parse((p.querySelector('script[data-slot="page-function-catalog"]') || document.querySelector('script[data-slot="page-function-catalog"]'))?.textContent || 'null'); })()`
   - Lấy đúng `pageCode`, `pageTitle`, `guests` và từng chức năng (`[data-function-code="<PAGE>-Fnn"]`).
4. **Màn hình Quy trình & Tiện ích:** Nhóm **Thực đơn dự trù** (`/weekly-meal-plan`, `CS-TDT-18`) và **Tiện ích → Khởi tạo bếp mới** (`/tien-ich/khoi-tao-bep`, `CS-TI-01`).

Luôn đọc skill **`cs-ui-ban-do-thuc-don-du-tru`** trước để nắm đúng thứ tự phụ thuộc của toàn chuỗi dữ liệu và chọn đúng skill trong 10 kỹ năng hiện có.

---

## 3. Bảy Quy tắc Vàng Thao tác Giao diện Web CaterSoft (khi làm trên trình duyệt)

| STT | Tên ngắn | Thành phần UI | Cơ chế DOM thực tế | Thao tác chuẩn: Click → Chọn → Gõ → Xác nhận |
| :-: | :--- | :--- | :--- | :--- |
| 1 | Ô chọn | `Select` / `KitchenSelect` | Ant Design v6 dùng `.ant-select-content` và `input[role="combobox"]`. Tìm theo **tên tiếng Việt không dấu** (không tìm theo mã `code`). `Enter` **không** chọn mục trong dropdown thường. | 1. **Click** vào `.ant-select-content` / `input[role="combobox"]`.<br>2. **Gõ** từ khóa không dấu (`thit kho`, `cu chi`).<br>3. **Click trực tiếp** vào dòng `.ant-select-item-option` khớp tên có dấu. |
| 2 | Ô số lưới | `EditableAntdNumberRenderer` | Bình thường là `<div id="editable-number-display-...">`; bấm vào mới sinh `<input class="ant-input-number-input">`. | Click vào `div` số → gõ trực tiếp số mới → nhấn **`Enter`** → đọc lại giá trị ô sau khi lưu. |
| 3 | Nút Popover | `ActionPopoverButton` (`Thao tác` / `Mở rộng` / `⋯`) | Lệnh `Tải lại`, `Cập nhật cấu hình mới nhất`, `Copy Thực đơn tuần`, nhập/xuất Excel nằm trong Popover. | Click nút `Thao tác` / `⋯` → chờ Popover mở → click mục lệnh bên trong. |
| 4 | Khối thu gọn | `CollapseV2` | Khối ca ăn hoặc tổng cộng có thể đang thu gọn. | Kiểm tra trạng thái mở; nếu đang đóng, click thanh tiêu đề để bung ra trước khi thao tác. |
| 5 | Hộp thoại | `BaseModalV2` & «Đóng sau khi lưu» | Công tắc «Đóng sau khi lưu» ở chân modal: giữ bật để tạo 1 bản ghi, tắt để nhập nhiều bản ghi liên tiếp. | Điền đủ trường → bấm `Tạo` / `Lưu` → đọc thông báo thành công trước khi đóng. |
| 6 | Lưu bộ đệm | `PendingChangesButtons` (`Lưu thay đổi`) | Khi `pendingChanges > 0`, bộ lọc `Ngày` / `Bếp` tạm khóa để bảo vệ dữ liệu chưa lưu. | Bấm **«Lưu thay đổi»** (hoặc chờ nhãn **«Đã lưu»** ở trang tự lưu) trước khi chuyển ngày/bếp. |
| 7 | Chọn ngày | `DateSelect` / `WeekSelect` | Hiển thị `DD/MM/YYYY` hoặc tuần `YYYY-WW`. | Click ô ngày → chọn tất cả → gõ ngày mới → nhấn **`Enter`**. |
