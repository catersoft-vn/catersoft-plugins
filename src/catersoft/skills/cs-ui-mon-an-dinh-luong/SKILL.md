---
name: cs-ui-mon-an-dinh-luong
description: >-
  Khai Món ăn (CS-MNL-07), Nhóm món và Nhóm NL chính (Danh mục món ăn CS-MNL-02), Cơ cấu món ăn (CS-TDT-08),
  Tên ngân hàng thực đơn (CS-MNL-19), Định lượng nguyên liệu trong Ngân hàng thực đơn (CS-MNL-13),
  Cập nhật định lượng hàng loạt (CS-MNL-10, CS-MNL-11) và Hao hụt chế biến (CS-MNL-14) trên giao diện CaterSoft.
  Dùng khi khách cần thêm món, phân nhóm món, tạo cơ cấu món, tạo ngân hàng thực đơn, khai hoặc nạp Excel định lượng.
---

# Kỹ năng UI: Món ăn, Cơ cấu món, Ngân hàng thực đơn & Định lượng

> Đọc `cs-ui-ban-do-thuc-don-du-tru` trước. Nguyên liệu và đơn vị phải có sẵn (skill `cs-ui-nguyen-lieu-dvt`).
> Hướng dẫn chính thức: `https://guide.catersoft.vn/thuc-don/mon-an`, `https://guide.catersoft.vn/thuc-don/dinh-luong`.

## 1. Khái niệm cần nắm

- **Nhóm món** (Món mặn, Món canh, Món xào, Tráng miệng, Cơm…): phân loại món; một món có thể thuộc nhiều nhóm.
- **Nhóm NL chính** (ví dụ Gà, Heo, Cá trong nhóm Món mặn): phân loại con, phải chọn «Nhóm món ăn cha».
- **Cơ cấu món** (ví dụ «Mặn 1», «Mặn 2», «Canh»): một vị trí món trong phần ăn, thuộc **đúng một nhóm món**. Mỗi cơ cấu món thành **một dòng** trên thực đơn tuần.
- **Món ăn không có đơn vị tính**; đơn vị thuộc về nguyên liệu.
- **Ngân hàng thực đơn (NHTĐ)** = một bộ định lượng: mỗi dòng là *Món × Nguyên liệu × ĐVT × Định lượng (sống)*. Cùng một món có thể nằm ở nhiều NHTĐ với định lượng khác nhau (ví dụ NHTĐ công nhân và NHTĐ chuyên gia). Thực đơn (điểm dự trù) trong thiết lập chọn **một** NHTĐ; dự trù lấy định lượng từ NHTĐ đó.

## 2. Bản đồ màn hình

| STT | Tên ngắn | Tên trên menu | Đường dẫn | Mã trang | Dùng để |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | Món ăn | Danh sách món ăn | `/meal/dishes` | `CS-MNL-07` | Thêm/sửa món, nạp Excel món |
| 2 | Danh mục món | Danh mục món ăn | `/meal/dish-catalog` | `CS-MNL-02` | Tab Món ăn · Tên ngân hàng thực đơn · Nhóm món · Hao hụt chế biến (tab Nhóm NL chính, PP chế biến chỉ có ở công ty dùng) |
| 3 | Cơ cấu món | Cơ cấu món ăn | `/meal/dish-slots` | `CS-TDT-08` | Tạo cơ cấu món gắn nhóm món |
| 4 | Tên NHTĐ | Tên ngân hàng thực đơn | `/meal/recipes` | `CS-MNL-19` | Tạo/đặt tên NHTĐ |
| 5 | Định lượng | Ngân hàng thực đơn | `/meal/recipes/detail` | `CS-MNL-13` | Khai định lượng từng món trong một NHTĐ, Excel |
| 6 | Nhiều NHTĐ | Update ĐL nhiều NHTĐ | `/meal/recipes/many-recipes` | `CS-MNL-10` | Thêm/sửa định lượng một món trên nhiều NHTĐ cùng lúc |
| 7 | Sửa nhanh ĐL | Cập nhật định lượng | `/meal/recipes/update-quantity` | `CS-MNL-11` | Sửa định lượng một nguyên liệu, thay nguyên liệu, xử lý lệch ĐVT |
| 8 | Hao hụt | Hao hụt chế biến | `/meal/processing-loss` | `CS-MNL-14` | % hao hụt chế biến theo món × nguyên liệu (ra ĐL chín) |
| 9 | Trung tâm NHTĐ | QL Ngân hàng thực đơn | `/meal/menu-bank` | `CS-MNL-03` | Gom các tab NHTĐ: Nhiều NHTĐ · Theo món · Chi tiết NHTĐ · Tổng hợp · Cập nhật ĐL · NL trùng lặp |
| 10 | Dựng NHTĐ | Tiện ích → Dựng ngân hàng thực đơn | `/tien-ich/dung-ngan-hang-thuc-don` | `CS-TI-02` | Trình hướng dẫn chép định lượng từ NHTĐ khác hoặc Excel sang NHTĐ mới |

## 3. Món ăn, nhóm món, cơ cấu món

1. **Nhóm món / Nhóm NL chính:** menu **Dữ liệu chung → Nhóm món ăn** («Tên nhóm» bắt buộc, «Mã nhóm», «Thứ tự») và **Dữ liệu chung → Nhóm NL chính món ăn** («Nhóm món ăn cha», «Tên nhóm NL chính» bắt buộc), hoặc tab «Nhóm món» trên Danh mục món ăn. Gán nhóm cho nhiều món một lượt: Danh sách món ăn → **Thao tác → «Cập nhật Nhóm Món Ăn»**.
2. **Món ăn:** Danh sách món ăn → **«Thêm mới»** → cửa sổ «Thêm món ăn mới»: «Tên món ăn» (bắt buộc, 2–200 ký tự), «Tên món ăn (Anh)», «Nhóm» (chọn nhiều; ghi là tuỳ chọn nhưng món không nhóm sẽ không chọn được trên thực đơn tuần), «Nước chấm mặc định», «Mô tả», «Trạng thái», «Món mặn có canh», «Món cải thiện có cơm» → **«Tạo mới»** → xác nhận. «Mã món ăn», «Nhóm NL chính» và tên Trung/Nhật/Hàn chỉ hiện khi công ty bật.
   - Excel: **Thao tác → «Upload Excel»**; trùng Mã món → cập nhật, không có mã thì khớp theo Tên; cùng tên khác mã → tạo món mới.
   - Lịch sử thay đổi món ăn: **Thao tác → «Lịch sử thay đổi»** (`CS-MNL-07-F12` trên Danh sách món ăn, `CS-MNL-02-F20` trên tab Món ăn của Danh mục món ăn; hoặc nút «Lịch sử thay đổi» trong cửa sổ «Chỉnh sửa món ăn») mở ngăn kéo «Lịch sử thay đổi — Món ăn» lọc được theo từng món và loại thao tác (Tạo mới / Cập nhật / Xóa / Khôi phục). Cột «Thao tác» trên bảng món ăn chỉ còn nút «Chỉnh sửa» (không đặt nút lịch sử trên từng dòng).
   - **Nhóm của món quyết định món hiện ở dòng nào trên thực đơn tuần**: hộp chọn món chỉ liệt kê món có nhóm trùng nhóm của cơ cấu món. Món dùng được ở nhiều nhóm thì gán đủ các nhóm.
   - Tên trong file khách khác tên chính đã được xác nhận dùng lại: lưu và tra trong **Mô tả** theo [hướng dẫn tên theo khách](../cs-ui-thuc-don-tuan-du-tru-ngay/SKILL.md#lưu-và-tra-tên-theo-khách-trong-mô-tả-món-ăn); giữ mô tả cũ và giới hạn nhóm/phạm vi của tên.
3. **Cơ cấu món:** Cơ cấu món ăn → «Thêm mới» → «Mã cơ cấu» (tự viết hoa), «Tên cơ cấu» (bắt buộc), «Tên hiển thị (bản in)» (tên dùng chung trên bản in, áp cho mọi thiết lập), «Nhóm món» (bắt buộc, một nhóm), «Tên cơ cấu (Anh)», «Thứ tự», «Trạng thái», «Slot Món canh» nếu là canh. Bấm «Hủy» khi chưa gõ gì mà vẫn hiện «Nội dung chưa được lưu» thì chọn «Đóng, không lưu». Nên đặt «Thứ tự» nhóm món và cơ cấu món theo trình tự in quen thuộc (ví dụ Mặn → Chay → Canh → Xào → Tráng miệng → Cơm).

## 4. Tên ngân hàng thực đơn và định lượng

1. **Tạo NHTĐ:** trang **Tên ngân hàng thực đơn** (hoặc nút **«Tên NHTĐ»** trên thanh công cụ trang định lượng) → «Thêm mới» → cửa sổ «Thêm công thức mới»: «Tên công thức» (bắt buộc), «Mã công thức», «Mô tả», «Giá 1 phần ăn», «Trạng thái» → «Tạo mới». Cột «Liên kết cấu hình» cho biết NHTĐ đang được bao nhiêu thiết lập dùng.
   - Ô «Giá 1 phần ăn» (bản phần mềm trước ngày 11/11/2026): gõ số (ví dụ 32000) rồi bấm thẳng «Tạo mới». Nếu đã rời ô (ô hiện «32.000VND») mà bấm lại vào ô rồi rời ra, giá sẽ thành 0. Gặp vậy thì gõ lại số và bấm «Tạo mới» ngay. Sau khi tạo, xem cột «Giá 1 phần ăn» trên bảng để kiểm lại.
2. **Khai định lượng** (trang **Ngân hàng thực đơn** `/meal/recipes/detail`, mã `CS-MNL-13`):
   - Chọn NHTĐ ở ô **«Chọn tên NHTĐ»** (`F01` — `selectRecipe`): hộp chọn `RecipePickerSelect` hiển thị cả Tên và Mã NHTĐ; tự động nạp bảng ngay khi chọn, không cần ấn nút tìm.
   - Thanh công cụ gồm các nút:
     - **«Chọn tên NHTĐ»** (`F01` — `selectRecipe`): Hộp chọn ngân hàng thực đơn đang thao tác.
     - **«Thêm mới»** (`F02`, Shift+1 — `createDishRecipe`): Nút mở modal chọn món và thêm nguyên liệu định lượng.
     - **«Mới (nhiều NHTĐ)»** (`F04` — `createManyRecipes`): Nút màu cam trên toolbar mở `RecipesManyRecipesModal`.
     - **«Danh sách tên NHTĐ»** (`F05` — `openRecipeList`): Nút «Tên NHTĐ» trên toolbar mở drawer quản lý danh sách NHTĐ.
     - **«Lịch sử thay đổi»** (`F09` — `saveHistory`): Nút «Lịch sử thay đổi» trên toolbar mở modal `RecipeSaveHistoryModal` xem lịch sử lưu NHTĐ & định lượng.
     - Menu **«Thao tác»** (`ActionPopoverButton`).
     - Trên màn hình di động (≤480px), các nút phụ thu gọn vào menu dấu ba chấm (`...`).
   - Bấm **«Thêm mới»** (Shift+1) → cửa sổ **«Tạo công thức món ăn»** (`F02` — `createDishRecipe`): chọn món ăn → mỗi dòng chọn «Nguyên liệu», nhập «Định lượng» (> 0) cho **một phần ăn**; ĐVT tự điền theo ĐVT định lượng của nguyên liệu. Có nút «Copy công thức» để sao chép từ món/NHTĐ khác → **«Tạo mới»**. Nhập nhanh: chọn nguyên liệu → Enter sang ô Định lượng → Enter để thêm dòng.
   - Thao tác trên từng món trong bảng:
     - Nút **Sửa màu xanh** (`F03` — `updateDishRecipe`): Mở cửa sổ «Cập nhật công thức món ăn» (`RecipeIngredientsUpdateModal`) cho riêng món đó.
     - Nút **Sửa màu cam** (`F04` — `createManyRecipes`): Mở cửa sổ «Cập nhật Recipe (nhiều NHTĐ)» (`RecipesManyRecipesModal`) để sửa định lượng món trên nhiều NHTĐ cùng lúc.
     - Nút **«Lịch sử»** (`F09` — `saveHistory`): Cột thao tác mở `RecipeSaveHistoryModal` xem lịch sử thêm/sửa/xoá nguyên liệu của riêng món đó.
     - Nút **Xóa dòng định lượng đã chọn** (`F06` — `deleteIngredientRow` / `bulkDelete`): Nút xóa trên từng dòng món hoặc tick chọn checkbox rồi xóa qua Popover.
   - Cột «ĐL đặt hàng» = ĐL ÷ (1 − TLHH sơ chế của nguyên liệu); cột «Đơn giá», «Thành tiền» lấy giá dự trù để xem chi phí món.
3. **Thao tác mở rộng (`ActionPopoverButton`):** Menu Thao tác chia thành các nhóm lệnh theo đúng mã chức năng chuẩn:
   - **Dữ liệu & Báo cáo:**
     - «Tải lại» (`F07` — `reloadIngredients`): Xóa cache và nạp lại fresh data từ backend.
     - «Excel nguyên liệu (Xuất / Nhập)» (`F08` — `excelIngredients`): Mở ngăn kéo `RecipeExcelDrawer`.
     - «Hướng dẫn đọc bảng» (`F10` — `helpModal`): Hướng dẫn giải thích ý nghĩa các dòng nền đỏ/cảnh báo.
   - **Dọn dẹp & Tối ưu:**
     - «Khôi phục dòng định lượng đã xóa» (`F11` — `restoreDeleted`): Mở ngăn kéo danh sách các dòng đã xóa để khôi phục.
     - «Dọn dẹp định lượng 0» (`F12` — `cleanupZeroQuantity`): Xóa các dòng định lượng 0 hoặc trống (chỉ Super Admin / Dev).
   - **Quản trị nâng cao:**
     - «Xóa dòng định lượng đã chọn» (`F06` — `bulkDelete`): Xóa các dòng được tick checkbox.
     - «Xóa tất cả» (`F13` — `deleteAllIngredients`): Xóa toàn bộ dòng định lượng của NHTĐ đang chọn, phải gõ đúng tên NHTĐ để xác nhận; tên NHTĐ vẫn giữ và các dòng lấy lại được ở «Khôi phục». Nút chỉ hiện với Super Admin, hoặc Quản trị viên được cấp quyền chi tiết «Xóa tất cả định lượng 1 NHTĐ» trong Phân quyền.
     *(Lưu ý an toàn tuyệt đối: «Lịch sử lưu» mang mã F09, KHÔNG BAO GIỜ dùng mã F13 vì F13 là lệnh Xóa tất cả định lượng NHTĐ).*
4. **Excel định lượng:**
   - Trang Ngân hàng thực đơn: **Thao tác → «Excel nguyên liệu (Xuất / Nhập)»** mở ngăn kéo hai tab: «Xuất nguyên liệu ra Excel» (tải bảng hiện có) và **«Khởi tạo nguyên liệu từ Excel» — XOÁ toàn bộ định lượng hiện có của NHTĐ rồi ghi lại theo file.** Chỉ dùng khi người dùng xác nhận thay toàn bộ.
   - Cập nhật/thêm mà **không xoá**: **QL Ngân hàng thực đơn → tab «Tổng hợp (TH)»** → chọn NHTĐ → **«Upload Excel»** (nút chỉ bật sau khi chọn NHTĐ) → các tab:
     - «Xuất nguyên liệu ra Excel» → nút **«Tải lên Excel»**: thêm được dòng mới, có bảng xem trước trước khi ghi. Mỗi NHTĐ một cột; chọn một NHTĐ thì cột định lượng tên «Định lượng». Trong xem trước, **«Cảnh báo» là dòng sẽ ghi**; dòng «Lỗi» tự bỏ qua. Trùng tên nguyên liệu thì điền «Mã NL».
     - «Upload ngân hàng thực đơn»: một NHTĐ; tải template (đã có Mã món / Mã NVL / Mã đơn vị, không sửa các cột mã) → sửa cột «Định lượng sống». **Chỉ sửa dòng đã có**, không thêm được dòng mới. Ô trống = giữ nguyên; «-» = xoá số định lượng (để trống).
     - «Upload nhiều NH thực đơn» (có trang không hiện tab này): nhiều NHTĐ trong một file, sheet «Nguyên liệu» có 8 cột đầu cố định (Mã món ID, Mã món, Tên món, Nhóm món, Mã NL ID, Mã NL, Tên NL, Đơn vị), rồi mỗi NHTĐ một cột từ cột thứ 9 (tiêu đề cột = tên NHTĐ, ô = định lượng một phần); khớp món/nguyên liệu theo mã rồi theo tên; **thêm được dòng mới** khi nguyên liệu chưa có trong NHTĐ (Đơn vị phải nhận ra được). Tên trùng nhiều bản ghi thì báo lỗi, không đoán.
     - «Định lượng chín»: cập nhật định lượng chín và ghi chú.
     - Không tab nào xoá dòng vắng mặt trong file.
   - Dòng có ĐVT không quy đổi được về đơn vị kho của nguyên liệu sẽ bị chặn → khai quy đổi trên nguyên liệu trước.
5. **Sửa hàng loạt:** **Cập nhật định lượng** → chọn NHTĐ → «Lấy dữ liệu» → lọc «Mặt hàng» → sửa «Định lượng» → «Lưu thay đổi». Có «Thay nguyên liệu» và «Xử lý nguyên liệu lệch ĐVT».
6. **Ghi chú một dòng định lượng:** QL Ngân hàng thực đơn → tab «Chi tiết NHTĐ» → chọn NHTĐ, tìm món → nút Sửa → sửa cột ghi chú → «Cập nhật công thức» → xác nhận. Cột ghi chú trên bảng ngoài chỉ để đọc; nút màu tím trong hộp sửa là sửa nguyên liệu gốc, không phải dòng định lượng.
7. **Hao hụt chế biến** (tuỳ chọn): «Món ăn», «Nguyên liệu», «% HHCB» (0.4 = hao 40%, −1 = nở gấp đôi) → ĐL chín = ĐL sống × (1 − tỷ lệ). Khác với «TLHH sơ chế» trên nguyên liệu (dùng cho số lượng đặt hàng).

## 5. Kiểm tra sau khi khai

- Mỗi món sẽ xuất hiện trên thực đơn đều có định lượng trong **đúng NHTĐ** mà thực đơn (điểm dự trù) dùng.
- Định lượng nhập cho **một phần ăn**, đúng ĐVT định lượng (thường Gam/Ml), không nhập theo Kg nếu ĐVT là Gam.
- Mở Dự trù ngày của một ngày có món đó → «Xem Nguyên liệu tổng hợp (Ngày)» thấy nguyên liệu với số lượng hợp lý.

## 6. Phạm vi MCP Giai đoạn 1 vs Giao diện Web

| STT | Tác vụ | Có thể dùng MCP Giai đoạn 1 | Cần thao tác trên Giao diện Web |
| :-: | :--- | :--- | :--- |
| 1 | Nhóm món & Cơ cấu món | `cs_dish_groups_list/create/update`, `cs_dish_slots_list/get/create/update` | Khai Nhóm NL chính, gán nhóm món hàng loạt, sửa «Tên hiển thị (bản in)» có cảnh báo ảnh hưởng |
| 2 | Món ăn (`CS-MNL-07`) | `cs_dishes_list`, `cs_dish_get/create/update` | Upload Excel món ăn, xem lịch sử thay đổi món, vô hiệu hóa / khôi phục món |
| 3 | Ngân hàng thực đơn & ĐL | `cs_recipes_list/get/create/update`, `cs_recipe_ingredients_list/get/create/update` | Hao hụt chế biến (`CS-MNL-14`), sửa nhiều NHTĐ (`CS-MNL-10`), Upload Excel NHTĐ (`CS-MNL-03`/`13`), Dựng NHTĐ (`CS-TI-02`), Xóa định lượng (`F06`/`F13`) |
