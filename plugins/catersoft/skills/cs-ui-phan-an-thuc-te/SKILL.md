---
name: cs-ui-phan-an-thuc-te
description: >-
  Nhập Số phần ăn thực tế trên CaterSoft và đối soát với dự trù: Nơi Phục Vụ (CS-DTP-04), Thiết lập số phần ăn (CS-DTP-03),
  Nhập phần ăn (pivot) (CS-DTP-01) với «Lấy số từ dự trù», Phần ăn thực tế (CS-DTP-01B) với Số báo / Số thực tế,
  Doanh thu SACN (CS-DTP-02) và So sánh dự trù - thực tế (CS-TDT-15). Dùng khi khách cần nhập số suất đã phục vụ,
  chép số dự trù sang, hoặc kiểm chênh lệch dự trù và thực tế.
---

# Kỹ năng UI: Số phần ăn thực tế & Đối soát với dự trù

> **Quy tắc bắt buộc (An toàn MCP OAuth 2.1 & UI):** Trên Claude Code và Codex, luôn đọc thêm file `../cs-ui-ban-do-thuc-don-du-tru/QUY-TAC-BAT-BUOC.md` trước khi thao tác hoặc gọi công cụ MCP (Antigravity nạp sẵn qua `rules/AGENTS.md`).

> Đọc `cs-ui-ban-do-thuc-don-du-tru` trước. Số dự trù đến từ Dự trù ngày (skill `cs-ui-thuc-don-tuan-du-tru-ngay`).

## 1. Khái niệm cần nắm

- **Nơi Phục Vụ** = một khách hàng tại một bếp, có **«Đơn giá phần ăn (VND)»**. Phần ăn thực tế nhập theo Nơi phục vụ; dự trù nhập theo Điểm dự trù. Hai bên chỉ nối với nhau qua **liên kết Điểm dự trù ↔ Nơi phục vụ** (không khớp theo tên).
- **Thiết lập số phần ăn**: mỗi bếp một cấu hình (ca hiển thị, nơi phục vụ, kiểu nhập «Thường» hoặc «Bảng ngang» (Pivot), cột hiển thị, giá theo nhóm món cho bảng ngang, ánh xạ nhóm món dự trù). Mỗi ngày giữ **bản chép** cấu hình; sửa cấu hình sau không đổi ngày đã tạo → dùng «Cập nhật thiết lập» / «Cập nhật cấu hình mới» trên trang nhập.
- **Số báo** = số khách báo đặt; **Số thực tế** = số đã phục vụ; **Số thanh toán** = lớn hơn trong hai số; **Chênh lệch** = báo − thực tế; **Giá trị TT** = Số thanh toán × Đơn giá.
- Trang **pivot chỉ nhập Số báo**. Số thực tế theo Nơi phục vụ chỉ nhập được trên trang **Phần ăn thực tế**. (Bảng «Doanh thu cơm thực tế» trong ngăn «Tổng hợp số phần» của Dự trù ngày là số theo tên phần cho doanh thu cơm của dự trù, không phải số này.)

## 2. Bản đồ màn hình

| STT | Tên ngắn | Tên trên menu | Đường dẫn | Mã trang | Dùng để |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | Nơi phục vụ | Nơi Phục Vụ | `/meal/meal-customer-types` | `CS-DTP-04` | Khách hàng × bếp × đơn giá phần ăn |
| 2 | Thiết lập | Thiết lập số phần ăn | `/settings/actual-meal-servings-config` | `CS-DTP-03` | Cấu hình nhập của từng bếp (bắt buộc trước khi nhập) |
| 3 | Nhập pivot | Nhập phần ăn (pivot) | `/weekly-meal-plan/actual-meal-servings-pivot` | `CS-DTP-01` | Nhập Số báo theo lưới Nơi phục vụ × nhóm món, lấy số từ dự trù |
| 4 | Phần ăn thực tế | Phần ăn thực tế | `/weekly-meal-plan/actual-meal-servings` | `CS-DTP-01B` | Nhập Số báo và Số thực tế |
| 5 | Tổng hợp | Doanh thu SACN | `/weekly-meal-plan/actual-meal-servings-summary` | `CS-DTP-02` | Tổng hợp theo kỳ, xuất bảng kê (chỉ đọc) |
| 6 | Đối soát | So sánh dự trù - thực tế | `/weekly-meal-plan/report/meal-servings-comparison` | `CS-TDT-15` | Chênh lệch dự trù với số báo / số thực tế |

## 3. Chuẩn bị

1. **Nơi Phục Vụ:** thêm → tên (không trùng trong cùng khách hàng), «Tên khác», «Đơn giá phần ăn (VND)», «Khách hàng» (bắt buộc), «Bếp nấu» (bắt buộc). Sửa nhanh trên bảng → «Lưu thay đổi».
2. **Thiết lập số phần ăn:** bấm nút sửa ở dòng bếp → cửa sổ «Cấu hình số báo phần ăn – <bếp>», ba tab:
   - **«Cấu hình chung»**: «Ca phục vụ» (bắt buộc), «Ghi chú», kiểu nhập **«Thường / Standard»** hoặc **«Bảng ngang / Pivot»**, cột hiển thị (Số báo, Số thực tế, Số thanh toán, Chênh lệch, Đơn giá, Giá trị TT), và **«Nhóm món bên dự trù»** cho nút «Lấy số từ dự trù»: mặc định cột Mặn/Chay/Nước/Combo khớp nhóm món có mã MAN/CHAY/NUOC/COMBO; bếp đặt mã khác thì chọn nhóm món dự trù cho từng cột.
   - **«Xuất Excel»**: tiêu đề, người lập biểu, người ký trên bảng kê.
   - **«Giá & tên ca theo khách hàng»**: giá theo nhóm món và tên ca riêng của từng khách.
   → **«Lưu»** → xác nhận trong hộp «Xác nhận lưu cấu hình».
3. **Liên kết Điểm dự trù ↔ Nơi phục vụ** để đối soát và lấy số từ dự trù (sửa được ngay trong cửa sổ «Lấy số phần từ dự trù»).

## 4. Nhập phần ăn (pivot) — `/weekly-meal-plan/actual-meal-servings-pivot`

1. Chọn **Ngày** và **Bếp** (bị khoá khi còn thay đổi chưa lưu). Ngày chưa có cấu hình → **«Tạo cấu hình»**.
2. Mỗi ca một khối; dòng = Nơi phục vụ, cột = nhóm món (Mặn/Chay/Nước/Combo). Click ô → gõ số nguyên ≥ 0 → **Enter** (ghi và xuống dòng dưới cùng cột); Esc huỷ.
3. **«Lấy số từ dự trù»** → cửa sổ «Lấy số phần từ dự trù»: chọn **«Chỉ ô đang trống»** hoặc **«Ghi đè tất cả»** (hỏi người dùng trước khi ghi đè) → xem cột «Số báo hiện tại» / «Sẽ điền» → **«Điền N ô»**. Số lấy là số phần **món chính + SP. thêm** của từng phần trong dự trù (số đã ghi tay ở bảng «Doanh thu cơm thực tế» của Dự trù ngày thì ưu tiên), đổ vào cột theo «Nhóm món bên dự trù». Số được điền vào **Số báo** và **tự lưu ngay** (chân hộp vẫn ghi «vẫn phải bấm Lưu thay đổi» — câu này đã cũ).
4. **Lưu:** trang **tự lưu** sau mỗi ô; nhãn trạng thái cạnh ô Bếp hiện «Chờ lưu» → «Đang lưu» → «Đã lưu». «Lưu lỗi» thì bấm **«Thử lại»**; chờ «Đã lưu» trước khi đổi ngày/bếp.
5. Khối **«Doanh thu bổ sung»** (bung ra nếu đang thu gọn): «Thêm doanh thu mặt hàng», «Thêm doanh thu khác» — lưu ngay trong cửa sổ, không qua bộ đệm. Cuối trang **«Tổng doanh thu trang»** cộng doanh thu phần ăn + mặt hàng + khác.
6. **Thao tác:** «Tải lại», «Cập nhật cấu hình ngày mới nhất» (chép cấu hình mới nhất của bếp đè lên bản của ngày).
7. Đơn giá: lấy giá theo nhóm món trong Thiết lập số phần ăn; chưa có thì lấy giá của Nơi phục vụ.

## 5. Phần ăn thực tế — `/weekly-meal-plan/actual-meal-servings`

1. Mỗi ca một bảng, dòng = Nơi phục vụ. Nhập **«Số báo»** và **«Số thực tế»**; Enter xuống dòng. Các cột Số thanh toán, Chênh lệch, Đơn giá, Giá trị TT tự tính.
2. Lưu bằng **«Lưu thay đổi»** ở tiêu đề từng ca (rời trang khi chưa lưu sẽ được cảnh báo).
3. **Thao tác:** «Tải lại», «Cập nhật cấu hình ngày mới nhất», **«Đồng bộ đơn giá»** (áp lại giá hiện tại của Nơi phục vụ; xem trước rồi ghi, **không hoàn tác** → hỏi người dùng).
4. Trang này không có «Lấy số từ dự trù».
5. Khối **«Doanh thu bổ sung»** (doanh thu mặt hàng, doanh thu khác) cũng có ở cuối trang này, dùng như trên trang pivot.

## Lưu ý khi nhập phần ăn (đã kiểm chứng)

- Trước khi nhập ngày mới, xem 1–2 ngày khách đã nhập để theo đúng cách ghi của khách.
- Trang **Phần ăn thực tế**: gõ Số báo vào dòng trống sẽ **tự điền Số thực tế bằng cùng số** (cả 0) → kiểm cả hai cột. Enter mở ô dòng dưới, nên đọc tên dòng trước khi gõ.
- Cột nguồn không có số thì để trống, không nhập 0.
- Nút «Lưu thay đổi» ở tiêu đề một ca lưu **mọi ô đang chờ của trang**, không riêng ca đó.
- Sau khi sửa ô, thoát bằng Esc; đừng bấm vào chỗ trống gần đầu trang (thanh «Hủy thay đổi / Lưu thay đổi» hiện ở đó).
- Tổng cuối ca/trang có thể chưa tính ô đang chờ; ngay sau khi lưu trang có thể hiện 0 kèm vòng xoay. Chờ số cuối cùng rồi mới đối chiếu.
- «Doanh thu khác»: ô Nhóm liệt kê nhóm hàng hóa (để trống = doanh thu cơm, chọn Combo để tách riêng); ô Nhóm tự xoá sau mỗi lần lưu; cột số lượng hiện 3 số lẻ (582.000 = 582) → đối chiếu theo cột Thành tiền.
- Cửa sổ **Thiết lập số phần ăn** hiện «0 ca đã chọn»: với bếp chưa từng cấu hình (bảng chưa ghi tên ca) là bình thường; với bếp mà bảng đã ghi tên ca thì cửa sổ mở trống bất thường → **đừng Lưu** (sẽ đè cấu hình thật), tải lại trang.
- **Doanh thu SACN:** bấm «Tải lại» trước khi xuất file; đổi khoảng ngày mà bảng còn kỳ cũ thì xem ngày dòng cuối và chọn lại bếp.

## 6. Tổng hợp và đối soát

- **Doanh thu SACN:** lọc khoảng ngày, Bếp nấu, Khách hàng; xem Số báo / Số thực tế / Số thanh toán / Chênh lệch theo ca. Nút «Mẫu 1» (bảng đối chiếu công nợ suất ăn); menu **Thao tác** (biểu tượng tia sét khi màn hẹp): «Tải lại», «Tải bảng kê doanh thu», «Tải bảng kê Việt–Trung» (hai bảng kê cần chọn Khách hàng), «Tải tổng hợp phần ăn» (ma trận ngày × khách × ca, không cần chọn khách).
- **So sánh dự trù - thực tế:** chọn «Thời gian» (tối đa 31 ngày), «Bếp nấu» (bắt buộc), «Ca», «Trạng thái» (Khớp / Có chênh lệch / Chưa nhập thực tế / Chưa đủ dữ liệu / Lỗi dữ liệu-mapping). Bản đồ nhiệt ngày × ca (ngưỡng 4%), công tắc «Số báo − dự trù» hoặc «Thực tế − dự trù»; bấm ô để soi chi tiết; các chế độ xem «Cần rà soát» / «Tổng theo ca» / «Chi tiết nơi phục vụ».
- Trạng thái «Lỗi dữ liệu/mapping» (ô «!») có hai nguyên nhân chính: **ngày chưa có cấu hình** (trang Phần ăn thực tế báo «Ngày … chưa có cấu hình» — rê chuột lên ô thấy «thiếu snapshot cấu hình cho ngày này») hoặc Điểm dự trù chưa liên kết Nơi phục vụ. Nút «Cần rà soát» liệt kê từng loại lỗi.
- **«Tạo cấu hình»** chụp Thiết lập số phần ăn của bếp cho ngày đó; bếp chưa có Nơi phục vụ và Thiết lập số phần ăn thì khai hai trang đó trước. Đây là thao tác ghi: chỉ bấm khi người dùng muốn bắt đầu nhập ngày đó.
- Công ty không có trang «Nhập phần ăn (pivot)» (không thấy cả trên menu lẫn ô ⌘K) thì nhập Số báo và Số thực tế trên **Phần ăn thực tế**; trang này không có «Lấy số từ dự trù». Ở vài công ty, Phần ăn thực tế, Doanh thu SACN, Thiết lập số phần ăn và Nơi Phục Vụ nằm trong nhóm menu «Khách hàng».

## 7. Phạm vi MCP Giai đoạn 1 vs Giao diện Web

| STT | Tác vụ | Có thể dùng MCP Giai đoạn 1 | Cần thao tác trên Giao diện Web |
| :-: | :--- | :--- | :--- |
| 1 | Nơi phục vụ & Thiết lập | Đọc/tạo/sửa qua `cs_serving_locations_list`, `cs_serving_location_create`, `cs_serving_location_update`, `cs_meal_customer_types_list`, `cs_meal_customer_type_create`, `cs_meal_customer_type_update`, `cs_customers_list` | Thiết lập số phần ăn theo bếp (`CS-DTP-03`), tạo snapshot cấu hình ngày, xóa mềm / khôi phục Nơi phục vụ |
| 2 | Nhập Số báo / Thực tế | `cs_actual_meal_servings_list`, `cs_actual_meal_serving_set` | Bấm «Lấy số từ dự trù» (`CS-DTP-01`), «Đồng bộ đơn giá» (`CS-DTP-01B`), nhập Doanh thu bổ sung |
| 3 | Tổng hợp & Đối soát | Xem bảng kê nhanh qua `cs_actual_meal_servings_list` | Xuất Excel **Doanh thu SACN** (`CS-DTP-02`) và xử lý đối chiếu **So sánh dự trù - thực tế** (`CS-TDT-15`) |
