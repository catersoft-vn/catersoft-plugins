---
name: cs-ui-thiet-lap-thuc-don-du-tru
description: >-
  Dựng khung suất ăn của bếp trên CaterSoft: Ca làm việc (CS-DLC-11), Nhóm ca (CS-TDT-11), Điểm dự trù (CS-TDT-07),
  Nhóm điểm dự trù (CS-TDT-10), Quy tắc chọn món, Giá phần ăn, và Thiết lập thực đơn dự trù (CS-TDT-06) gồm ca → thực đơn
  (điểm dự trù) → giá/phần ăn, ngân hàng thực đơn, cơ cấu phần, nhóm món (Món chính/Món phụ), cơ cấu món, món mặc định;
  chép/dán phần ăn; đưa thiết lập vào thực đơn tuần. Dùng khi khách mở bếp mới, thêm ca/thực đơn, đổi giá suất, đổi cơ cấu phần.
---

# Kỹ năng UI: Thiết lập thực đơn dự trù và dữ liệu đi kèm

> **Quy tắc bắt buộc (An toàn MCP OAuth 2.1 & UI):** Trên Claude Code và Codex, luôn đọc thêm file `../cs-ui-ban-do-thuc-don-du-tru/QUY-TAC-BAT-BUOC.md` trước khi thao tác hoặc gọi công cụ MCP (Antigravity nạp sẵn qua `rules/AGENTS.md`).

> Đọc `cs-ui-ban-do-thuc-don-du-tru` trước. Cần có sẵn món ăn, cơ cấu món và ngân hàng thực đơn (skill `cs-ui-mon-an-dinh-luong`).
> Hướng dẫn chính thức: `https://guide.catersoft.vn/thuc-don/thiet-lap-thuc-don`, `https://guide.catersoft.vn/thuc-don/them-thuc-don-cho-ca`,
> `https://guide.catersoft.vn/thuc-don/co-cau-phan-nhom-mon`, `https://guide.catersoft.vn/thuc-don/chep-phan-an`,
> `https://guide.catersoft.vn/thuc-don/ap-thiet-lap-vao-thuc-don-tuan`.

## 1. Khái niệm cần nắm

- **Thiết lập thực đơn dự trù** là **khung suất ăn của một bếp**, mỗi bếp đúng một bản. Có công ty đặt tên menu là «Thiết lập kế hoạch sản xuất».
- **Ca làm việc**: các bữa bếp phục vụ (Bữa trưa, Bữa chiều, Bữa tối…). Giờ kết thúc nhỏ hơn giờ bắt đầu = ca qua đêm.
- **Điểm dự trù** = **một thực đơn** (ví dụ «Thực đơn học sinh», «Thực đơn giáo viên»); một ca có nhiều điểm; điểm gắn được nhiều khách hàng và nhiều nhóm điểm.
- Với từng điểm trong một ca: **Giá/phần ăn** (để trống = chưa có giá, gõ 0 = suất 0 đồng), **Ngân hàng thực đơn** (bắt buộc) và **Cơ cấu phần**.
- **Cơ cấu phần** (Phần mặn, Phần chay, Phần món nước…) gồm các **nhóm món**; mỗi phần có **đúng một nhóm «Món chính»**, còn lại là «Món phụ». Mỗi nhóm món gồm các **cơ cấu món**; mỗi cơ cấu món là một dòng trên thực đơn tuần. Công tắc **«Tính DT»** tắt thì phần vẫn nấu, vẫn tính nguyên liệu nhưng không cộng tiền vào doanh thu.
- **Món mặc định**: món đặt sẵn vào ô khi khởi tạo thực đơn tuần.
- **Quy tắc chọn món** (`/meal/meal-selection-rules`): mẫu cơ cấu phần (nhóm món, loại chính/phụ, số món tối đa), dùng cho Giá phần ăn. Ngăn kéo thiết lập hiện tại không còn ô chọn mẫu; cơ cấu phần khai tay hoặc chép từ điểm khác (mục 5).
- **Giá phần ăn** (`/meal/meal-sets`): mẫu phần cơm (NHTĐ + giá + quy tắc). Bản đang hoạt động trùng NHTĐ với một thực đơn sẽ **thắng thiết lập** khi «Cập nhật cấu hình mới nhất».

## 2. Bản đồ màn hình

| STT | Tên ngắn | Tên trên menu | Đường dẫn | Mã trang | Dùng để |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | Ca | Ca làm việc (Shift) | `/settings/shifts` | `CS-DLC-11` | Tạo ca, giờ bắt đầu/kết thúc |
| 2 | Nhóm ca | Nhóm ca làm việc (Shift Group) | `/settings/shift-groups` | `CS-TDT-11` | Gom ca, phân loại ngày/đêm |
| 3 | Điểm dự trù | Điểm dự trù | `/settings/serving-locations` | `CS-TDT-07` | Tạo thực đơn (điểm), gắn khách hàng, nhóm điểm |
| 4 | Nhóm điểm | Nhóm điểm dự trù | `/settings/serving-location-groups` | `CS-TDT-10` | Gom điểm (SACN, Trường học…) để chọn nhanh |
| 5 | Quy tắc | Quy tắc chọn món | `/meal/meal-selection-rules` | `CS-MNL-22` | Mẫu cơ cấu phần |
| 6 | Giá phần ăn | Giá phần ăn | `/meal/meal-sets` | `CS-MNL-21` | Mẫu phần cơm: NHTĐ + giá + quy tắc |
| 7 | Thiết lập | Thiết lập thực đơn | `/meal/meal-plans` | `CS-TDT-06` | Khung suất ăn từng bếp |

## 3. Danh mục đi kèm

1. **Ca làm việc:** «Thêm ca mới» (Shift+1) → «Tên ca» (bắt buộc), «Nhóm ca», «Thời gian bắt đầu», «Thời gian kết thúc», «Thứ tự» → «Tạo mới» (Shift+Enter).
2. **Điểm dự trù:** «Thêm điểm dự trù mới» → «Tên điểm dự trù» (bắt buộc), «Khách hàng» (chọn nhiều), «Nhóm điểm dự trù» (chọn nhiều), «Thứ tự». Sửa nhanh trên bảng rồi lưu ở thanh dưới trang (Shift+Enter). Mặc định một khách hàng chỉ thuộc một điểm (công tắc «Cho phép trùng KH» để bỏ chặn). Điểm đang dùng trong thiết lập không vô hiệu hoá/xoá được.
3. **Quy tắc chọn món** (tuỳ chọn): «Thêm mới» → «Thêm quy tắc chọn món mới»: «Tên quy tắc», «Mô tả», «Tạo tự động» hoặc «Thêm nhóm món (Dish Group)» → Nhóm món, Loại món, Chọn tối đa, Cơ cấu món → «Tạo mới».
4. **Giá phần ăn** (tuỳ chọn): «Thêm mới» → «Thêm giá phần ăn»: «Mã giá phần ăn», «Tên giá phần ăn», «Giá», «Công thức món ăn» (NHTĐ), «Quy tắc chọn món», «Mô tả», «Trạng thái» → «Tạo mới». Chỉ tạo khi khách thực sự dùng mẫu giá: bản đang hoạt động sẽ ghi đè giá của thực đơn dùng cùng NHTĐ.
5. Trong ngăn kéo Chỉnh sửa kế hoạch sản xuất, nút **«Danh mục TĐDT»** mở ngăn kéo các tab: Quy tắc chọn món · Điểm dự trù · Ca làm việc · Cơ cấu món · Ngân hàng thực đơn · Khách hàng · Nơi phục vụ, để thêm danh mục còn thiếu mà không rời thiết lập. Đóng ngăn kéo danh mục bằng dấu × của nó.
6. **Nơi phục vụ** (dòng nhập số báo phần ăn của một bếp): **Khách hàng → Danh sách KH → «Nơi phục vụ» → «Thêm mới»** → «Tên nơi phục vụ», «Đơn giá phần ăn (VND)», «Thứ tự hiển thị», «Khách hàng», «Bếp nấu» → «Tạo mới» → xác nhận. Nơi phục vụ đang hoạt động của bếp nào thì tự hiện thành một dòng trên **Nhập phần ăn (pivot)** của bếp đó, kể cả ngày tạo cấu hình sau này.
7. **Thêm một căn tin mới cho bếp đã chạy**, làm theo thứ tự: Khách hàng (Danh sách KH → «Thêm mới») → Tên ngân hàng thực đơn → Nơi phục vụ (mục 6) → Điểm dự trù: chọn khách hàng rồi chọn **«Nơi phục vụ nhận số dự trù»** → Cơ cấu món riêng (đặt tên theo căn tin, ví dụ «Món canh <tên căn tin>», để chọn món ở căn tin này không đổi các căn tin khác) → thêm điểm vào ca (mục 4) → áp vào tuần (mục 6 bên dưới).

## 4. Tạo và sửa Thiết lập thực đơn của một bếp

1. **Thực đơn dự trù → Thiết lập thực đơn** → **«Tạo kế hoạch sản xuất»** (Shift+1) → chọn **«Bếp nấu»** → **«Tạo»** (lưu rồi mở ngăn kéo chỉnh sửa). Ô Bếp nấu chỉ liệt kê bếp đang hoạt động chưa có thiết lập; bếp đã có dòng thì bấm **bút chì** để sửa, **con mắt** để chỉ xem. Cột «Ghi chú» sửa ngay trên bảng (rời ô là lưu).
   - Bấm Tạo là hệ thống lưu ngay một khung tối thiểu (ca, điểm, NHTĐ đầu tiên; chưa có giá, chưa có cơ cấu phần) → phải sửa tiếp.
   - Báo «Thiếu dữ liệu ca / điểm dự trù / công thức» → danh mục chưa có ca, điểm dự trù hoặc NHTĐ đang hoạt động.
2. Ngăn kéo **«Chỉnh sửa kế hoạch sản xuất»**: cột trái **«Cấu trúc kế hoạch»** gồm «Tổng quan kế hoạch», các ca và điểm dự trù của từng ca; bấm một dòng để sửa bên phải.
   - Thêm ca: **«Thêm ca phục vụ»** → chọn ca làm việc (không trùng ca khác).
   - Thêm thực đơn cho ca: **«Thêm điểm dự trù»** (dấu + cạnh tên ca) → «Điểm dự trù» (không trùng trong cùng ca) → **«Giá/phần ăn»** → **«Ngân hàng thực đơn»** (bắt buộc).
   - Thêm cơ cấu phần: **«Thêm cơ cấu phần»** cạnh tiêu đề «Cơ cấu phần» → «Tên phần», công tắc «Tính DT». (Ô «Template có sẵn» đã bỏ khỏi bản này.)
   - Trong mỗi phần: **«Thêm nhóm món (Dish Group)»** → sửa ngay trên dòng: «Nhóm món», «Loại món» (Món chính/Món phụ), «Chọn tối đa»; bấm ô **«Cơ cấu món (Dish Slot)»** để tick/bỏ tick cơ cấu món (đóng bảng chọn là lưu), hoặc mở dòng: «+ Thêm cơ cấu món», thùng rác «Xóa cơ cấu món» (hỏi xác nhận), đặt «Tên riêng dự trù này» và «Món mặc định». Thay cơ cấu = bỏ cái cũ, thêm cái mới. Thùng rác (hiện khi rê chuột) xoá nhóm/phần, có hỏi lại.
   - Khối **«Tổng hợp món từ cơ cấu phần»**: cột **«Món mặc định»** bấm ô để chọn món (Mã · Tên · Nhóm món), chọn là lưu.
   - **Lưu: ngăn kéo tự lưu khi nhập xong**, không có nút Cập nhật. Tiêu đề hiện «Đang lưu… / Đã lưu hh:mm / Chưa lưu / Lưu lỗi · Lưu lại» («Lưu lỗi» thì bấm **«Lưu lại»**; vẫn lỗi thì đừng đóng ngăn kéo, chụp màn hình báo người dùng); chờ **«Đã lưu»** rồi mới đóng bằng dấu ×. «Bỏ thay đổi» tải lại bản đã lưu (hỏi trước). «Lịch sử» xem các lần lưu.
   - Phím **Esc** chỉ nên dùng để đóng một bảng chọn đang mở. Bấm Esc khi không còn bảng chọn nào mở sẽ đóng luôn ngăn kéo; trang tự lưu phần đã hợp lệ rồi hỏi áp dụng vào tuần. Nếu chưa làm xong thì bấm **«Để sau»**, mở lại bút chì và làm tiếp. Muốn đóng bảng chọn thì bấm ra chỗ trống của ngăn kéo.
3. «Chưa lưu» nghĩa là còn thiếu dữ liệu: rê chuột xem lý do. Thường gặp: thiếu ca, điểm dự trù, Ngân hàng thực đơn, cơ cấu phần, hoặc phần chưa có nhóm «Món chính».
4. Trong thiết lập chỉ đổi được **«Tên riêng dự trù này»** (riêng thực đơn này). Tên dùng chung trên bản in là «Tên hiển thị (bản in)» ở trang **Cơ cấu món ăn**: sửa ở đó đổi cho **mọi thiết lập**, hỏi người dùng trước.

### Hai thực đơn dùng hai NHTĐ khác nhau

Khi hai điểm dự trù cùng bếp dùng hai NHTĐ khác nhau (ví dụ suất Việt Nam và suất nước ngoài), tạo **bộ cơ cấu món riêng cho mỗi NHTĐ**. Dùng chung cơ cấu món thì chi phí món có thể hiện 0đ và chọn món ở điểm này ghi đè điểm kia (xem lưu ý ở skill `cs-ui-thuc-don-tuan-du-tru-ngay`).

## 5. Chép phần ăn giữa các thực đơn

Trong ngăn kéo Chỉnh sửa kế hoạch sản xuất, trên **cây «Cấu trúc kế hoạch»**:
- Rê chuột vào dòng điểm dự trù nguồn → biểu tượng **copy** → chọn **«Toàn bộ điểm dự trù»** (NHTĐ, giá, cơ cấu phần, món mặc định), **«Tất cả cơ cấu phần (N)»** hoặc **«Một cơ cấu phần»** → tên phần.
- Bấm **«Dán»** trên dòng điểm đích: dán toàn bộ điểm thay cấu hình đích (hỏi lại khi đích đã có dữ liệu); dán tất cả cơ cấu phần thay cơ cấu phần nhưng giữ giá và NHTĐ của đích; dán một cơ cấu phần thì thêm thành phần mới.
- «×» trên dòng nguồn để huỷ chế độ copy; **đóng ngăn kéo cũng huỷ bản đã copy**, nên không mang sang bếp khác được bằng cách này.
- Chép thiết lập sang bếp khác: cột **«Copy»** của bảng Thiết lập thực đơn (chỉ Super Admin; ô «kế hoạch đích» chỉ liệt kê bếp **đã có** thiết lập — bếp mới thì «Tạo kế hoạch sản xuất» cho bếp đó trước, rồi mới copy đè lên) → chọn nội dung (Cấu hình ca, Ghi chú, Trạng thái) → chọn kế hoạch đích → «Ghi đè…» → xác nhận. Ghi đè cả thiết lập đích: hỏi người dùng trước.
- Ngăn kéo tự lưu sau khi dán: đọc lại «Tính DT», giá và tên riêng của điểm đích.

## 6. Đưa thiết lập vào thực đơn tuần

- Thực đơn tuần chép khung thiết lập **lúc khởi tạo tuần** và giữ bản chép đó.
- Lưu thiết lập xong, trang có thể hỏi **chọn các tuần** còn cấu hình cũ → **«Áp dụng cho N tuần»** (chép cơ cấu, giá, số suất mới vào các tuần đã chọn). Chỉ chọn tuần người dùng muốn đổi: mặc định mọi tuần đều được tick, bỏ tick tuần không đổi thì nút đổi thành «Áp dụng cho 1 tuần». Thêm một điểm mới chỉ thêm điểm vào ca; món đã xếp của các điểm khác giữ nguyên.
- Tuần chưa có thực đơn: **«Khởi tạo thực đơn tuần»** (trên trang Dự trù ngày nút cùng việc tên **«Khởi tạo kế hoạch sản xuất tuần»**).
- Tuần đã có thực đơn: **Thao tác → «Cập nhật cấu hình mới nhất»** → ca, thực đơn, giá/phần ăn, cơ cấu phần đổi theo thiết lập; **món đã xếp trong ô không bị xoá**; cơ cấu món đã bỏ khỏi thiết lập thì biến khỏi lưới (món đã xếp ở đó không bị xoá hẳn nhưng không còn hiện và không vào file xuất). Trước khi bỏ một cơ cấu đang có món, ghi lại món của các ngày để xếp lại sang cơ cấu mới.
- «Cập nhật cấu hình mới nhất» có thể **bỏ cơ cấu phần** đang có trong tuần: đọc cảnh báo và hỏi người dùng trước khi xác nhận.
- Nhân viên cần quyền «Sửa ô Thực đơn dự trù (tuần + ngày)» và «Cập nhật cấu hình mới nhất (tuần)»; thiếu thì mục này bị khoá.

## 7. Phạm vi MCP Giai đoạn 1 vs Giao diện Web

| STT | Tác vụ | Có thể dùng MCP Giai đoạn 1 | Cần thao tác trên Giao diện Web |
| :-: | :--- | :--- | :--- |
| 1 | Cơ sở, Bếp, Kho, Ca, Điểm | `cs_facilities_list`, `cs_kitchen_types_list`, `cs_kitchens_list`, `cs_kitchen_create`, `cs_kitchen_update` (Admin+), `cs_warehouses_list`, `cs_warehouse_create`, `cs_warehouse_update` (Admin+), `cs_shifts_list`, `cs_shift_create`, `cs_shift_update`, `cs_serving_locations_list`, `cs_serving_location_create`, `cs_serving_location_update`, `cs_meal_customer_types_list`, `cs_meal_customer_type_create`, `cs_meal_customer_type_update` | Nhóm ca, Nhóm điểm dự trù, Quy tắc chọn món, Giá phần ăn, Xóa mềm / Khôi phục |
| 2 | Khách hàng | `cs_customers_list`, `cs_customer_get`, `cs_customer_create`, `cs_customer_update` | Xóa mềm / Khôi phục khách hàng |
| 3 | Thiết lập kế hoạch sản xuất | Chỉ đọc `cs_meal_plans_list` và NHTĐ (`cs_recipes_list`) để đối chiếu | Dựng khung **Thiết lập thực đơn dự trù** (`mealPlans`, `CS-TDT-06`), Copy/Dán giữa các thực đơn/bếp, Áp thiết lập vào tuần, Wizard `CS-TI-01` |
