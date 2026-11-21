---
name: cs-ui-nguyen-lieu-dvt
description: >-
  Khai và sửa Nguyên liệu trên giao diện CaterSoft (CS-MNL-05) cùng dữ liệu đi kèm: Đơn vị tính (CS-DLC-10),
  Nhóm lớn / Nhóm / Nhóm nhỏ hàng hóa (CS-DLC-13/14/15), Đơn vị cơ bản, ĐVT định lượng, Đơn vị quy đổi,
  TLHH sơ chế và nạp nguyên liệu bằng Excel. Dùng khi khách cần thêm nguyên liệu, sửa đơn vị, khai quy đổi
  (Kg ↔ Gam, Thùng ↔ Kg…), hoặc khi số lượng đặt hàng lệch do đơn vị.
---

# Kỹ năng UI: Nguyên liệu, Nhóm hàng, Đơn vị tính & Quy đổi

> **Quy tắc bắt buộc (An toàn MCP OAuth 2.1 & UI):** Trên Claude Code và Codex, luôn đọc thêm file `../cs-ui-ban-do-thuc-don-du-tru/QUY-TAC-BAT-BUOC.md` trước khi thao tác hoặc gọi công cụ MCP (Antigravity nạp sẵn qua `rules/AGENTS.md`).

> Đọc `cs-ui-ban-do-thuc-don-du-tru` trước để biết nguyên liệu đứng ở đâu trong chuỗi.

## 1. Khái niệm cần nắm

- **Nguyên liệu chính là Hàng hóa** loại *Thực phẩm/Nguyên liệu*. Trang **Danh sách nguyên liệu** và trang **Hàng hóa** sửa cùng một bản ghi; nguyên liệu tạo mới mặc định thuộc loại Thực phẩm. Định lượng món ăn luôn trỏ vào bản ghi này.
- **Đơn vị cơ bản** = đơn vị kho: tồn kho, đơn mua và file đặt hàng quy về đơn vị này.
- **ĐVT định lượng** = đơn vị dùng khi khai định lượng món (ví dụ kho tính Kg, định lượng tính Gam). Bỏ trống thì định lượng dùng Đơn vị cơ bản.
- **Đơn vị quy đổi** khai riêng trên từng nguyên liệu: mỗi dòng nối **Đơn vị cơ bản** với **một đơn vị khác** (cột ghi là «Đơn vị mua hàng» nhưng dùng cho mọi đơn vị khác: Gam để định lượng, Thùng/Bao để mua). Hai cách nhập, chọn cách dễ đọc: chế độ **«1 {ĐVT cơ bản} =»** nhập số đơn vị kia trong 1 đơn vị cơ bản (Kg → Gam: nhập 1000); chế độ **«1 ĐVT mua =»** nhập số đơn vị cơ bản trong 1 đơn vị kia (Thùng 24 Kg: nhập 24). Cột «Mô tả quy đổi» luôn ghi cả hai chiều (ví dụ «1 Gr = 0,001 Kg hoặc 1 Kg = 1.000 Gr»): đọc nó để chắc không nhập ngược. Ô ĐVT khi khai định lượng chỉ cho chọn Đơn vị cơ bản hoặc các đơn vị đã khai quy đổi của chính nguyên liệu đó.
- **TLHH sơ chế (%)** của nguyên liệu: tỷ lệ hao hụt khi sơ chế; dự trù dùng nó để ra **ĐL đặt hàng = ĐL sống ÷ (1 − TLHH)**. Ô này chỉ hiện khi công ty bật tính năng.
- **Mặt hàng cơ bản** (`/settings/base-inventory-items`) chỉ là tên gọi chung không quy cách, **không** dùng trong định lượng hay dự trù; không cần khai để chạy chuỗi thực đơn – dự trù.

## 2. Bản đồ màn hình

| STT | Tên ngắn | Tên trên menu | Đường dẫn | Mã trang | Dùng để |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | Nguyên liệu | Danh sách nguyên liệu | `/meal/ingredients` | `CS-MNL-05` | Thêm/sửa nguyên liệu, quy đổi, nạp Excel |
| 2 | Đơn vị tính | Đơn vị tính (Unit) | `/settings/units` | `CS-DLC-10` | Danh mục đơn vị (không có hệ số quy đổi ở đây) |
| 3 | Nhóm lớn | Nhóm lớn hàng hóa | `/settings/item-super-groups` | `CS-DLC-13` | Tầng trên cùng, tuỳ chọn |
| 4 | Nhóm | Nhóm hàng hóa | `/settings/item-groups` | `CS-DLC-14` | **Bắt buộc** trên nguyên liệu; báo cáo dự trù gom chi phí nguyên liệu theo nhóm này |
| 5 | Nhóm nhỏ | Nhóm nhỏ hàng hóa | `/settings/item-sub-groups` | `CS-DLC-15` | Tuỳ chọn, phải chọn «Nhóm cha» |
| 6 | Danh mục | Danh mục mặt hàng | `/settings/item-catalog` | `CS-MNL-01` | Một trang nhiều tab: Hàng hóa · Nguyên liệu · Đơn vị tính · Nhóm lớn · Nhóm · Nhóm nhỏ |
| 7 | Hàng hóa | Hàng hóa (Inventory Item) | `/settings/inventory-items` | `CS-DLC-09` | Cùng bản ghi với nguyên liệu, thêm Thuế suất, Không tồn kho |
| 8 | Gợi ý quy đổi | Thông tin công ty → tab «Đơn vị quy đổi» | `/admin/company` | `CS-QTH-03` | Bảng «Mapping đơn vị cơ bản → ĐVT định lượng» dùng cho nút «Đề xuất» |

## 3. Thứ tự khai

1. **Đơn vị tính:** «Thêm đơn vị mới» (Shift+1) → «Tên» (bắt buộc) → lưu. Tạo đủ đơn vị kho và đơn vị định lượng (`Kg`, `Gam`, `Lít`, `Ml`, `Cái`, `Bó`, `Thùng`…). Nhập nhiều liên tiếp: tắt «Đóng sau khi lưu».
2. **Nhóm:** Nhóm lớn («Mã nhóm lớn», «Tên nhóm lớn» bắt buộc) → Nhóm («Mã nhóm», «Tên nhóm» bắt buộc, «Nhóm lớn» tuỳ chọn) → Nhóm nhỏ («Mã», «Tên», «Nhóm cha» bắt buộc).
3. **Nguyên liệu:** trang **Danh sách nguyên liệu** → **«Thêm nguyên liệu»** → cửa sổ **«Thêm nguyên liệu mới»**:
   - «Tên nguyên liệu» (bắt buộc), «Nhóm» (bắt buộc), «Đơn vị cơ bản» (bắt buộc) = đơn vị kho.
   - «ĐVT định lượng»: chọn hoặc bấm **«Đề xuất»** (theo bảng gợi ý ở Thông tin công ty → «Đơn vị quy đổi»).
   - «Ghi chú», «Đồ khô / Bao gói», «Trạng thái».
   - Các ô **«Mã nguyên liệu»**, «Nhóm lớn», «Nhóm nhỏ», **«TLHH sơ chế» (%)** chỉ hiện khi công ty bật; không thấy thì bỏ qua, không đi tìm.
   - Mục **«Đơn vị quy đổi»** chỉ hiện **sau khi chọn Đơn vị cơ bản** → **«Thêm quy đổi»** → chọn «Đơn vị mua hàng», nhập hệ số theo dạng «1 Kg = 1000 Gam» (chế độ «1 {ĐVT cơ bản} =» hoặc «1 ĐVT mua =»), đọc cột «Mô tả quy đổi» để kiểm.
   - «Đề xuất» điền ĐVT định lượng và tự thêm dòng quy đổi tương ứng (ví dụ `1 Kg = 1000 Gr`); đọc lại tên đơn vị thật của công ty (có công ty gọi Gam là `Gr`).
   - Bấm **«Tạo mới»** (Shift+Enter) → hộp **«Xác nhận tạo sản phẩm mới»** → **«Tạo mới»**. Báo thành công là «Tạo sản phẩm thành công!».
   - Hộp này **không có công tắc «Đóng sau khi lưu»**: tạo xong hộp **vẫn mở**, xoá trắng nhưng giữ «Nhóm» và «Đơn vị cơ bản» để nhập tiếp nguyên liệu kế. Nhập xong thì bấm «Hủy» hoặc dấu X; hiện «Nội dung chưa được lưu» thì chọn «Đóng, không lưu» (bản ghi đã tạo vẫn còn). Kiểm lại bằng ô tìm kiếm trên danh sách.
   - Hộp sửa (bút chì trên dòng) có cùng các ô, nút «Cập nhật» và «Lịch sử lưu».
   - **Ngừng dùng một nguyên liệu** (không xoá): bút chì «Sửa» → «Trạng thái» chọn **«Tạm dừng»** → «Cập nhật» → xác nhận «Cập nhật». Hộp tự đóng; cột Trạng thái trên danh sách đổi thành «Vô hiệu hóa». Làm ngược lại để bật lại.

**Ví dụ chuẩn:**
- Thịt heo — Đơn vị cơ bản `Kg`, ĐVT định lượng `Gam`, quy đổi `1 Kg = 1000 Gam` (chế độ «1 Kg =», nhập 1000). Định lượng khai 120 Gam/phần; file đặt hàng ra Kg.
- Nước tương chai 500 ml, mua theo thùng 24 chai — Đơn vị cơ bản `Chai`, ĐVT định lượng `Ml`; hai dòng quy đổi: `1 Chai = 500 Ml` (chế độ «1 Chai =», nhập 500) và `1 Thùng = 24 Chai` (chế độ «1 ĐVT mua =», nhập 24). Định lượng khai theo Ml; file đặt hàng ra Chai.

## 4. Nạp Excel nguyên liệu

- **Danh sách nguyên liệu → Thao tác → «Upload Excel»** → cửa sổ «Tải dữ liệu hàng hóa lên» (3 bước: tải file → xem trước & xác nhận → kết quả). Tải «Template trống» hoặc «Template kèm dữ liệu hiện có» trước.
- Quy tắc ghi: **trùng MÃ → cập nhật; không có mã → tạo mới** (không xoá nguyên liệu khác). **Không khớp theo tên**: nạp lại một dòng không có mã sẽ tạo **nguyên liệu trùng**. Muốn sửa hàng loạt thì tải «Template kèm dữ liệu hiện có» (đã điền sẵn mã, kể cả khi công ty ẩn cột Mã) rồi sửa trên file đó, giữ nguyên cột Mã và các cột không định đổi.
- Lỡ tạo nguyên liệu trùng: dùng trang **Món ăn/Nguyên liệu → Xử lý nguyên liệu trùng lặp** (hoặc tab «NL trùng lặp» của QL Ngân hàng thực đơn) để gộp; hỏi người dùng giữ bản nào trước khi gộp.
- Cột (tuỳ ô công ty bật): Mã, Tên*, Nhóm lớn, Nhóm, Nhóm nhỏ, Đơn vị tính*, Trạng thái, Ghi chú. Đơn vị và nhóm phải **có sẵn** trong danh mục trước khi nạp; Nhóm lớn bỏ trống thì suy từ Nhóm; đổi Nhóm thì nhóm nhỏ cũ bị xoá. Cửa sổ ghi rõ danh sách cột của công ty: đọc phần «Cấu trúc cột» trước khi soạn file.
- **Ô trống khi cập nhật** (dòng có mã): Nhóm, Nhóm nhỏ, TLHH sơ chế, Loại mặt hàng, Quy đổi để trống = **giữ nguyên**. Nhưng **«Trạng thái» trống = chuyển về Hoạt động** (nguyên liệu đang tạm dừng sẽ bật lại) và «Ghi chú» trống có thể xoá ghi chú cũ: ghi rõ hai cột này như trong file kèm dữ liệu.
- Cột «Quy đổi» (nếu file có) dạng `Thùng = 24; Lốc = 6` (1 đơn vị mua = n Đơn vị tính). **Điền ô này là thay toàn bộ danh sách quy đổi** của nguyên liệu: ghi đủ mọi cặp, kể cả cặp định lượng (ví dụ `Gam = 0.001` khi kho tính Kg), hoặc để trống để giữ nguyên.
- File không có cột ĐVT định lượng → sau khi nạp nguyên liệu mới, khai ĐVT định lượng (và quy đổi nếu chưa nạp) trên từng nguyên liệu.
- Tỷ lệ hao hụt (khi công ty bật TLHH): trang **Danh mục mặt hàng → Thao tác → «Tải lên TLHH sơ chế»**, hoặc nháy đúp ô TLHH sơ chế trên bảng để sửa tại chỗ rồi lưu.

## 6. Thao tác nâng cao & Dọn dẹp hàng loạt (Menu Thao tác)

Trên thanh công cụ Danh sách nguyên liệu (`CS-MNL-05`), menu Popover **«Thao tác»** gom các chức năng xử lý hàng loạt:
- **Tải lại (`CS-MNL-05-F01`):** Làm mới danh sách và xóa sạch bộ đệm hiển thị.
- **Upload Excel (`CS-MNL-05-F09`) / Tải lên TLHH sơ chế (`CS-MNL-05-F10`):** Nhập hàng loạt từ file bảng tính.
- **Xóa ĐVT định lượng (`CS-MNL-05-F11`):** Xóa trắng trường `recipeUnitId` của các nguyên liệu đang chọn khi muốn quay về dùng hoàn toàn Đơn vị cơ bản làm định lượng.
- **Xóa dữ liệu "gam" (`CS-MNL-05-F12`):** Dọn dẹp các quy đổi đơn vị thừa hoặc không chuẩn liên quan đến đơn vị "gam" trong danh sách đã chọn.
- **Kích hoạt (`CS-MNL-05-F13`) / Vô hiệu hóa hàng loạt (`CS-MNL-05-F14`):** Bật hoặc tắt trạng thái hoạt động nhanh cho nhiều nguyên liệu mà không cần mở từng hộp thoại.
- **Khôi phục nguyên liệu đã xóa (`CS-MNL-05-F15`):** Khôi phục lại các nguyên liệu từng bị xóa mềm (`isDeleted: true`).

## 7. Kiểm tra & Cập nhật mã theo quy tắc nhóm

Khi công ty bật quy tắc mã nhóm đầy đủ (`requireFullGroupCode`), mã nguyên liệu phải tuân thủ chuẩn cấu trúc:
- **Cấu trúc mã chuẩn:** `[Mã Nhóm lớn (2)] + [Mã Nhóm (2)] + [Mã Nhóm nhỏ (2)] + [Số thứ tự (4 chữ số)]` (ví dụ `TPTHB010001`).
- **Nút «Bộ lọc» mã lỗi (`IngredientCodeFilterButton`):** Hiển thị trên thanh công cụ với huy hiệu số lượng nguyên liệu sai quy tắc mã. Bấm vào để lọc ngay danh sách các mặt hàng có mã sai quy tắc, trùng mã hoặc thiếu số 0.
- **Modal «Cập nhật mã theo quy tắc nhóm» (`CS-MNL-05-F16` - `FixIngredientCodesModal`):**
  - Mở từ thanh bộ lọc khi đang có cảnh báo sai quy tắc nhóm.
  - Hiển thị bảng đối chứng rõ ràng: *Mã hiện tại*, *Mã mới đề xuất*, *Nhóm lớn*, *Nhóm*, *Nhóm nhỏ*, *Tên nguyên liệu*.
  - Nguyên liệu thiếu mã nhóm sẽ được đánh dấu bị chặn (blocked) kèm lý do (cần khai mã nhóm trước).
  - Để đảm bảo an toàn tuyệt đối, hệ thống yêu cầu gõ chính xác cụm từ **`XAC NHAN`** trước khi nút «Xác nhận» được kích hoạt để tiến hành ghi mã mới hàng loạt.

## 8. Kiểm tra sau khi khai

- Mở lại nguyên liệu: Đơn vị cơ bản, ĐVT định lượng và bảng quy đổi đúng như ý.
- Khai thử một dòng định lượng (skill `cs-ui-mon-an-dinh-luong`): ô ĐVT phải có đơn vị định lượng mong muốn.
- Trên Dự trù ngày, tải file đặt hàng: không còn cảnh báo thiếu quy đổi, số lượng ra đúng đơn vị kho.

## 9. Phạm vi MCP Giai đoạn 1 vs Giao diện Web

| STT | Tác vụ | Có thể dùng MCP Giai đoạn 1 | Cần thao tác trên Giao diện Web |
| :-: | :--- | :--- | :--- |
| 1 | Đơn vị tính (`CS-DLC-10`) | `cs_units_list`, `cs_unit_get`, `cs_unit_create`, `cs_unit_update` | Xóa mềm / khôi phục, nhập hàng loạt nếu công ty không mở qua MCP |
| 2 | Nhóm hàng (`CS-DLC-14`) | `cs_item_groups_list`, `cs_item_group_get`, `cs_item_group_create`, `cs_item_group_update` | Khai Nhóm lớn (`CS-DLC-13`) và Nhóm nhỏ (`CS-DLC-15`) |
| 3 | Nguyên liệu (`CS-MNL-05`) | `cs_inventory_items_list`, `cs_inventory_item_get`, `cs_inventory_item_create`, `cs_inventory_item_update` (hỗ trợ `recipeUnitId` & `unitConversions`, tự chặn nếu thiếu quy đổi ĐVT) | Khai TLHH sơ chế nâng cao, nhóm lớn/nhỏ, nạp Excel nguyên liệu, gộp nguyên liệu trùng, sửa mã theo quy tắc nhóm (`CS-MNL-05-F16`) |
