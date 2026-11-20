---
name: cs-ui-thuc-don-tuan-du-tru-ngay
description: >-
  Lên Thực đơn tuần (CS-TDT-01), nhập Số phần ăn dự trù ở Dự trù ngày (CS-TDT-02) và Dự trù ngày (Tổng hợp) (CS-TDT-03,
  bản Trường học), xem nguyên liệu tổng hợp ngày, tải Số lượng đặt hàng ngày, cập nhật Bảng giá dự trù bếp (CS-TDT-05)
  và cấu hình Cơ cấu báo cáo dự trù ngày (CS-QTH-01B) trên giao diện CaterSoft. Dùng khi khách cần xếp món cho tuần,
  chép thực đơn tuần, nhập số phần, lấy file đặt hàng nguyên liệu, kiểm chi phí dự trù.
---

# Kỹ năng UI: Thực đơn tuần, Dự trù ngày & Số lượng đặt hàng

> Đọc `cs-ui-ban-do-thuc-don-du-tru` trước. Bếp phải có Thiết lập thực đơn dự trù (skill `cs-ui-thiet-lap-thuc-don-du-tru`).
> Hướng dẫn chính thức: `https://guide.catersoft.vn/thuc-don/tao-thuc-don`, `https://guide.catersoft.vn/thuc-don/du-tru-ngay`.

## 1. Bản đồ màn hình

| STT | Tên ngắn | Tên trên menu | Đường dẫn | Mã trang | Dùng để |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | Thực đơn tuần | Thực đơn tuần (Tổng hợp) — có công ty đặt tên «Thực đơn tuần» | `/weekly-meal-plan/menu-plan-v2` | `CS-TDT-01` | **Trang chính** xếp món cho tuần, một hoặc nhiều điểm dự trù |
| 2 | Thực đơn tuần V1 | Thực đơn tuần | `/weekly-meal-plan/menu-plan` | `CS-TDT-14` | Bản cũ: một điểm dự trù, có công tắc «Tự lưu» |
| 3 | Dự trù ngày | Dự trù ngày | `/weekly-meal-plan/daily-menu-servings/date` | `CS-TDT-02` | Nhập số phần cho một ngày × bếp × điểm |
| 4 | Dự trù tổng hợp | Dự trù ngày (Tổng hợp) | `/weekly-meal-plan/daily-menu-servings-summary` | `CS-TDT-03` | Ma trận số phần nhiều điểm, xuất file đặt hàng, kế hoạch sản xuất |
| 5 | Dự trù trường học | Dự trù ngày Tổng hợp (Trường học) | `/weekly-meal-plan/daily-menu-servings-summary-school` | `CS-TDT-03` | Như trang 4, nhập theo cột Học sinh / Giáo viên |
| 6 | Giá dự trù | Bảng giá dự trù bếp | `/supplier/kitchen-projected-pricings` | `CS-TDT-05` | Giá nguyên liệu theo bếp để tính chi phí dự trù |
| 7 | Cơ cấu báo cáo | Cấu hình báo cáo P&L → tab «Báo cáo dự trù ngày» | `/settings/pnl-report/configs` | `CS-QTH-01B` | Các dòng chỉ tiêu của báo cáo dự trù ngày |
| 8 | Sổ ba bước | Sổ ba bước | `/weekly-meal-plan/so-ba-buoc` | `CS-TDT-04` | Sổ kiểm thực ba bước theo thực đơn |

## 2. Lập Thực đơn tuần (`/weekly-meal-plan/menu-plan-v2`)

1. Chọn **Tuần**, **Bếp nấu** và **Điểm dự trù** (chế độ «Chọn một / Chọn nhiều»; để trống = xem tổng hợp mọi điểm; có «Chọn nhanh điểm theo nhóm»).
2. Tuần chưa có: thấy «Chưa có thực đơn cho tuần này…» → **«Khởi tạo thực đơn tuần»** → hộp «Xác nhận khởi tạo» → **«Khởi tạo»**. Khung lấy từ thiết lập, món mặc định được đặt sẵn.
3. Xếp món: mỗi ca là một bảng (dòng = cơ cấu món, cột = ngày). Ca đang thu gọn thì bấm tiêu đề ca. Hai cách:
   - **Nhấp đúp** ô (hoặc bấm bút ✏ hiện khi rê chuột vào ô) → hộp **«Chọn Món Ăn»** → gõ tên món không dấu → click đúng món. Nên dùng cách này khi nhập nhiều ô.
   - Sửa ngay trong ô: chọn món trong ô; **Enter** lưu và xuống dòng dưới, **Tab** lưu và sang ngày kế, **Esc** huỷ.
   - Mỗi ca có ô **«Tìm kiếm…»** (Shift+F) để lọc dòng; «Xóa lọc» bỏ lọc. Không chọn trùng một món trong cùng ca.
4. **Lưu:** trên trang này **đổi món là lưu ngay**; nút lưu nổi chỉ hiện khi lưu lỗi → bấm để thử lại. (Bản V1 `/weekly-meal-plan/menu-plan` dùng công tắc «Tự lưu» hoặc nút lưu nổi.)
5. Menu **«Thao tác»**:
   - Nhóm «Dữ liệu tuần»: «Tải lại»; **«Cập nhật cấu hình mới nhất»** (áp cấu hình ca, khe món mới nhất của bếp vào tuần đã có, giữ món đã xếp và thêm món cho ô còn trống ở dòng đã có món, gồm ô có phần ăn và ô vừa vào cấu hình; ô cũ 0 phần giữ trống); «Cập nhật thiết lập mới nhất» (mở Thiết lập thực đơn của bếp để sửa; lưu xong áp cho các tuần); **«Copy Thực đơn tuần»** (chép món từ một tuần nguồn của cùng bếp; **phải chọn đúng một Điểm dự trù** trước, nếu không ô tuần nguồn bị khoá).
   - Nhóm «Tệp»: «Upload Excel» (xem trước rồi mới ghi; tuần phải khởi tạo trước; chỉ ghi cho điểm đang chọn); «Xuất dự trù dinh dưỡng»; «Tải file Excel theo cells» (dữ liệu thô của tuần, một điểm hoặc tất cả).
6. Menu **«In PDF»**: «In PDF: Thực đơn tuần», «Thực đơn đa ngôn ngữ» (Excel VN · EN · CN · JP · KR, cần chọn đúng 1 điểm), «Định lượng chín - Tuần…» (khi công ty bật định lượng chín, đúng 1 điểm), «Thực đơn tháng (gửi khách)» và «… - Mẫu 2».
7. Menu **«Mở rộng»** (Alt+1): «Danh sách kế hoạch tuần», «Xem Giá nguyên liệu»; khi chọn một điểm có thêm «Xem Ngân hàng thực đơn», «Xem Cost món ăn». Khi bếp chỉ có một điểm, ô Điểm dự trù tự chọn và ẩn đi; xem lại qua «Mở rộng → Xem/Ẩn Điểm dự trù».
8. Nút **«⋮»** ở tiêu đề mỗi ca: «Xem cấu hình ca», «Sao chép ca» / «Dán ca đã chép», «Import JSON ca» / «Export JSON ca», «Hủy thay đổi ca». «Import JSON ca» và «Dán ca» ghi đè cả ca: chỉ dùng khi người dùng yêu cầu rõ; nhập thực đơn từ file của khách thì xếp món tay như bước 3.

### Lưu ý khi xếp món (đã kiểm chứng trên giao diện)

- **Hộp «Chọn Món Ăn» chỉ liệt kê món có Nhóm món trùng nhóm của dòng cơ cấu.** Không thấy món → mở Danh sách món ăn, sửa món, **thêm** nhóm (giữ nhóm cũ) → «Cập nhật». Món chưa có nhóm nào thì không chọn được ở dòng nào.
- Tiêu đề hộp ghi «Chọn Món Ăn — <cơ cấu> (<Thứ> - <ngày>)»: đọc tiêu đề trước khi chọn. Chọn xong hộp **tự sang dòng kế cùng ngày**; «Qua món tiếp theo» bỏ qua dòng mà không ghi; dòng cuối thì hộp đóng. Chỉ sửa một ô: chọn xong đóng hộp bằng dấu X.
- Ô tìm không phân biệt dấu nên ra cả tên gần giống (khoai mỡ / khoai môn, Me / Mẻ, «X» và «X(2)», tên là phần đầu của tên khác): **so đủ tên có dấu** trước khi bấm. Món bị món khác đứng đầu thì gõ thêm từ; cụm dài ra «Trống» thì thử một từ đặc trưng. Trong hộp này **bấm chuột vào đúng dòng**, không dựa vào Enter.
- **Cơ cấu món dùng chung giữa nhiều điểm dự trù cùng ca: chọn món là ghi cho mọi điểm đó**, kể cả khi đang lọc một điểm. Muốn món khác nhau thì phải tách cơ cấu món riêng trong thiết lập. Nhập xong, xem lại từng điểm.
- **Điểm chưa có món:** thêm điểm vào thiết lập sau khi đã xếp món thì điểm đó còn trống ở các dòng đã có món. Khi ô trống đó **có phần ăn** (ô 0 phần không báo, owner 04/11/2026), trang Thực đơn tuần và Dự trù ngày (Tổng hợp) hiện khung vàng «<điểm> chưa có món ở N ô» (ngày đã qua chỉ hiện với người có quyền sửa quá khứ); ô thiếu trên Thực đơn tuần có dấu ⚠ đỏ. Bấm **«Đồng bộ món»** → xem danh sách → **«Đồng bộ»** từng dòng hoặc **«Đồng bộ tất cả»**. Chỉ ghi đúng ô trống, không đổi món của điểm khác. Khi các điểm đang khác món và hoà nhau, trang không tự chọn: chọn món ở ô đó.
- Trang chặn trùng món trong một ca («…đã có trong ca này tại …»). Muốn chuyển món giữa hai dòng, đổi dòng nguồn trước.
- Món có đuôi **«(chưa có công thức)»** là món đã có nhưng chưa có định lượng trong NHTĐ của điểm: vẫn chọn được, **đừng tạo món trùng**; bổ sung định lượng (skill `cs-ui-mon-an-dinh-luong`).
- Trong hộp «Chọn Món Ăn» còn có nút **«Sửa»** (sửa món đang chọn) và phần **Công thức** để xem/sửa định lượng của món trong NHTĐ của điểm ngay tại chỗ (thêm nguyên liệu, sửa định lượng, giá dự trù) → **Shift+Enter** lưu công thức. Đây là sửa NHTĐ dùng chung, không riêng tuần này.
- Món chưa có: thử nhiều cách viết (mì / mỳ…) trước; rồi «Tạo món ăn mới» → Nhóm điền sẵn theo dòng → gõ tên đủ dấu → «Tạo mới» → xác nhận. Món tự vào ô nhưng **chưa có định lượng**; sau đó kiểm Danh sách món ăn chỉ có một bản.
- Nút thùng rác «Bỏ món khỏi ô này?» → «Xóa» xoá **cả ô** (kể cả số phần riêng của ô), với cơ cấu dùng chung thì xoá ở mọi điểm: hỏi người dùng trước.
- Lưu có thể trễ vài giây: ô viền cam bên trái là đang chờ lưu, bảng ca có thể vẽ lại sau mỗi lần lưu. Chờ rồi xem lại; **đừng chọn lại món để ép lưu**.
- Mỗi ca có bộ dòng riêng (có ca thiếu hẳn một nhóm). Nguồn có món cho nhóm mà ca không có dòng → báo người dùng, không nhét vào dòng khác.
- **Kiểm bằng mắt sau mỗi nhóm/ngày** và tải lại trang (F5) để chắc món còn. Ô vẫn món cũ thì dừng, kiểm ô đó trước khi thử lại; hộp đã đóng không phải bằng chứng đã lưu.

### Nhập theo file thực đơn (Excel / ảnh) của khách

- Khớp theo **tên dòng cơ cấu**, không theo vị trí dòng. Khi cột nhãn mâu thuẫn tên món thì tin tên món.
- Ô nguồn trống **không phải lệnh xoá**; nguồn thiếu Chủ nhật hay dòng cơm thì không tự thêm.
- Ô gộp qua nhiều dòng là câu hỏi cần hỏi người dùng, không tự chia.
- Một món lặp ở nhiều dòng/ca là bình thường.
- File «chốt» đè lên bản nháp đã nhập: chỉ sửa những ô khác nhau, liệt kê cho người dùng trước các ô dùng chung sẽ bị ghi đè ở điểm khác.

### Lưu và tra tên theo khách trong Mô tả món ăn

Yêu cầu chủ trì 05/11/2026: giữ những tên khác đã được xác nhận trong **Mô tả** của món được chọn để lần nhập sau tra lại và chuẩn bị dữ liệu cho tên tương đương.

- Trước khi đề xuất tạo món hoặc chọn một tên gần nguồn, đọc tên chính, Nhóm món và **Mô tả** của món hiện có. Ghi chú cũ là bằng chứng để đối chiếu; kiểm đúng thành phần, nhóm và phạm vi của nguồn mới trước khi dùng lại.
- Khi người dùng đã chốt một cách ghép tên, mở **Danh sách món ăn → Sửa → Mô tả**, nối thêm một khối có các dòng **Tên nguồn · Nhóm áp dụng · Phạm vi (bếp/điểm nếu có) · Nguồn (file/sheet/ô hoặc tài liệu) · Xác nhận (người/ngày/đợt)**. Giữ nguyên tên nguồn, kể cả lỗi chính tả, để tìm lại; giữ tên chính của món đang dùng.
- Chỉ ghi «đã xác nhận» cho cách ghép đã được chốt. Tên gần chưa chốt hoặc món khác thành phần không được tự gắn thành tương đương. Tên trùng nhưng khác nhóm phải ghi rõ giới hạn nhóm, nhất là Chay/Mặn.
- Giữ nguyên Mô tả cũ, nối tiếp; không lặp cùng cặp tên/phạm vi. Trường Mô tả tối đa **1.000 ký tự**: thiếu chỗ thì dừng để xử lý nội dung, không cắt bỏ mô tả hay nguồn cũ. Khi tạo món mới đúng tên nguồn, ghi **nguồn tên món**; không bịa thêm tên tương đương.
- Sau lưu, mở lại món để xem nguyên văn Mô tả và kiểm các trường nghiệp vụ khác. Chỉ ghi nhận hoàn tất khi nội dung đã lưu đúng; tài liệu chuẩn bị hoặc ghi chú trong hồ sơ không thay cho Mô tả đã lưu trong phần mềm.

### Trang Thực đơn tuần bản cũ (`/weekly-meal-plan/menu-plan`, `CS-TDT-14`)

Nhận ra: tiêu đề có công tắc **«Tự lưu»** và nút «Tải lại» trên thanh tiêu đề; ô **Điểm dự trù bắt buộc chọn một điểm** (không có chế độ tổng hợp). Cách làm giống trang Tổng hợp, khác ở mấy điểm:
- **Lưu:** «Tự lưu» bật (mặc định) thì lưu sau khoảng nửa giây; tắt thì bấm **nút nổi góc dưới phải** để lưu. Thẻ vàng «N thay đổi chờ tự lưu / chưa lưu» ở tiêu đề ca; ô vừa đổi tô cam. Chờ hết thẻ vàng rồi mới đổi tuần/bếp/điểm.
- **Xếp món:** bấm ô → ô thành danh sách chọn (Enter lưu và xuống dòng, Tab sang ngày kế, Esc huỷ); hoặc rê chuột → bút chì «Sửa» → hộp «Chọn Món Ăn» (như trang Tổng hợp, có «Tạo món ăn mới», «Sửa», «Nhiều NHTĐ», phần Công thức). Thùng rác → «Xóa mục này?» → «Xóa» để bỏ món khỏi ô.
- **Thao tác:** «Cập nhật cấu hình mới nhất», «Copy Thực đơn tuần» (kết quả vào thay đổi chờ lưu), «Tải file excel theo cells»; các mục có chữ DEV hoặc JSON chỉ dùng khi người dùng yêu cầu.
- **In PDF**, **Mở rộng**, nút «…» của ca giống trang Tổng hợp.

## 3. Nhập Số phần ăn dự trù (`/weekly-meal-plan/daily-menu-servings/date`)

1. Chọn **Ngày**, **Bếp nấu**, **Điểm dự trù**. Tuần chưa có kế hoạch → **«Khởi tạo kế hoạch sản xuất tuần»**.
2. Nhập trong bảng của từng ca (tiêu đề «Ca - Điểm»): cột **«Số phần ăn»** chỉ nhập cho **món chính**; món phụ tự tính lại. Cột **«SP. thêm»** là số phần cộng thêm (số âm tô đỏ) và chỉ sửa được ở tab **tên phần** của dãy «Chọn tên phần» (tab «Xem tất cả» chỉ đọc). Cột «Món ăn» cũng đổi được món của ngày.
   - Nút **«Tổng hợp số phần»** (cạnh ô Điểm dự trù) mở ngăn **«Doanh thu cơm»**: xem số phần và doanh thu theo tên phần × ca (chọn «Số phần / Doanh thu / Cả hai»). Bảng **«Doanh thu cơm thực tế»** (khi xem một điểm) cho nhập số phần thực tế từng ca để ghi đè số tổng hợp — để trống là dùng số tổng hợp → **«Lưu»**. Đây là số cho doanh thu cơm của dự trù, khác số thực tế theo Nơi phục vụ (skill `cs-ui-phan-an-thuc-te`).
   - Bấm nút mở dòng để xem nguyên liệu của món; sửa định lượng / giá ngay ở đó tạo **tùy chỉnh riêng cho ô ngày đó** (lưu bằng Shift+Enter); «Xóa tùy chỉnh» để dùng lại bản lưu.
   - Dòng mở rộng ghi **«Trạng thái:»** món đang lấy định lượng từ đâu: **Tùy chỉnh** (riêng ô ngày đó) › **Bản lưu (Plan)** (của tuần) › **Chính (DB)** (Ngân hàng thực đơn). Khi có tùy chỉnh, chỉ bộ tùy chỉnh được tính cho ô đó; cột bản lưu / chính vẫn hiện để so, không phải dòng cộng thêm.
   - Nút **⇄** trong dòng mở rộng mở **«So sánh nguyên liệu - <món>»**: ba cột Tùy chỉnh · Bản lưu (Plan) · Chính (DB) và cột Trạng thái. Muốn áp thay đổi cho các ngày sau thì ghi ngược vào công thức gốc bằng **«Cập nhật»** / **«Thêm vào CT»** từng dòng hoặc **«Cập nhật tất cả (N)»** (theo quyền, có xác nhận). Ghi xong: công ty dùng bản lưu vẫn giữ số cũ cho tuần đó cho tới khi chạy «Đồng bộ bản lưu công thức» (ghi đè bản lưu mọi ngày dùng cặp NHTĐ × món) — hỏi người dùng trước.
   - Nghi bị tính trùng (ví dụ bỏ một nguyên liệu trong tùy chỉnh mà vẫn thấy nó): mở **«Mở rộng» → «Xem Nguyên liệu tổng hợp (Ngày)»** và tìm nguyên liệu đó. Có trong tổng hợp dù đã bỏ khỏi tùy chỉnh thì chụp màn hình dòng mở rộng, cửa sổ so sánh và bảng tổng hợp rồi báo bộ phận hỗ trợ CaterSoft; không tự sửa NHTĐ để bù.
3. **Lưu:** trang **tự lưu ngay** khi đổi; nút lưu nổi chỉ hiện khi lỗi hoặc tạm dừng vì tổng số phần âm.
4. Menu **«Thao tác»**: nhóm «Dữ liệu ngày» — «Tải lại», **«Copy Số phần ăn»** (chọn ngày nguồn), «Upload Excel», «Cập nhật thiết lập mới nhất», **«Đồng bộ bản lưu công thức»** (chỉ có ở công ty dùng chế độ bản lưu, xem mục 4); «Kiểm tra và sửa Dự trù ngày» chỉ có ở một số công ty; nhóm «Đồng bộ» — «Cấu hình đồng bộ ca» (khe món nào đồng bộ định lượng giữa các ca), «Đơn giá dự trù nguyên liệu».
   Menu **«Mở rộng»**: Xem Giá nguyên liệu, Ngân hàng thực đơn, Bản lưu món ăn, Giá theo ngày, Nguyên liệu tổng hợp (Ngày), Báo cáo doanh thu và chi phí (Ngày / Điểm dự trù).
5. Nhiều điểm cùng lúc: dùng **Dự trù ngày (Tổng hợp)** → nút **«Số phần ăn»** của từng ca mở ngăn «Nhập Số phần ăn». Trường học: trang bản Trường học nhập hai cột **«Học sinh» / «Giáo viên»** (khớp theo tên phần: học sinh/tiểu học/mầm non; giáo viên).

### Lưu ý khi nhập số phần

- Ô số phần bị khoá khi điểm chưa có món chính trong ngày → lên thực đơn trước. Điểm hiện **gạch khoá** là điểm chưa có cấu hình trong tuần → khai thiết lập, không gõ thay.
- Lưu số phần món chính có thể sinh ô trống 0 phần: đó không phải món mới, đừng xoá.
- Sau khi bấm chip Thứ hoặc đổi bếp/ngày, **chờ dữ liệu tải và đọc lại ngày, bếp** trên trang/ngăn kéo trước khi nhập.
- Cột nguồn không có số thì để trống, không nhập 0.

## 4. Nguyên liệu dự trù và Số lượng đặt hàng ngày

- Xem nhanh: menu **«Mở rộng» → «Xem Nguyên liệu tổng hợp (Ngày)»** (Dự trù ngày) hoặc **Thao tác → «Xem Nguyên liệu tổng hợp ngày»** (Tổng hợp).
- Tải file: trên **Dự trù ngày** ở menu **«In PDF / Tải Excel»** (hai mục «Tải dữ liệu đặt hàng (Ngày)» / «… chi tiết (Ngày)» chỉ hiện khi bếp đã có kế hoạch tuần; bếp báo «Chưa có kế hoạch sản xuất cho tuần này» thì không có), trên **Dự trù ngày (Tổng hợp)** ở menu **«Thao tác»** → **«Tải dữ liệu đặt hàng (Ngày)»** hoặc **«Tải dữ liệu đặt hàng chi tiết (Ngày)»**. Menu «In PDF / Tải Excel» của trang Tổng hợp xuất Kế hoạch sản xuất mẫu 1/2/3, phiếu sơ chế, SOP giao hàng, dự trù nhiều ngày.
- **Cách hệ thống tính** (giải thích cho khách khi số lệch):
  1. Tổng phần = Số phần ăn + SP. thêm.
  2. ĐL sống = Tổng phần × định lượng. Định lượng lấy theo thứ tự: chỉnh riêng của ô ngày đó → nguồn công thức của ngày → NHTĐ. «Nguồn công thức của ngày» tuỳ công ty:
     - **Công ty có mục «Đồng bộ bản lưu công thức»** trong menu Thao tác (Dự trù ngày hoặc Dự trù ngày (Tổng hợp)): tuần giữ **bản lưu công thức** chụp lúc khởi tạo. **Sửa NHTĐ sau đó không tự vào dự trù**; dòng món hiện «Bản lưu lệch danh mục». Bấm **Thao tác → «Đồng bộ bản lưu công thức»** → xem trước trong ngăn kéo → «Đồng bộ N mục cần cập nhật» (chỉ mục thiếu/lệch), «Đồng bộ ngày …» hoặc «Quét lại cả tuần». Bản lưu tính theo tuần nên đồng bộ đổi cả 7 ngày của tuần: hỏi người dùng trước.
     - **Công ty không có mục đó** (chế độ chốt số cuối ngày): ngày chưa qua dùng NHTĐ và giá hiện tại nên sửa NHTĐ có tác dụng ngay; cuối ngày hệ thống chốt số, ngày đã qua giữ nguyên.
  3. ĐL đặt hàng = ĐL sống ÷ (1 − TLHH sơ chế của nguyên liệu); chưa khai TLHH thì giữ nguyên.
  4. Quy về **đơn vị kho** bằng hệ số quy đổi của nguyên liệu; thiếu quy đổi thì giữ số gốc kèm cảnh báo.
  5. Thành tiền = ĐL đặt hàng × đơn giá dự trù.
- File «Dữ liệu đặt hàng» có: Mã, Tên nguyên liệu, Nhóm nguyên liệu, Tổng số lượng, Đơn vị, số lượng theo ca và điểm, Đơn giá, Thành tiền, Nhà cung cấp (lấy từ Bảng giá dự trù bếp). File chi tiết thêm Ca, Điểm, Cơ cấu, Món, Số phần, Định lượng.
- File đặt hàng **không trừ tồn kho**.
- Chi phí ra 0: Bốn khả năng: định lượng bằng 0; chưa có giá ở **Bảng giá dự trù bếp** cho bếp × nguyên liệu (× ĐVT); giá đã lưu của ngày bằng 0; hai điểm dùng hai NHTĐ khác nhau nhưng **dùng chung cơ cấu món** (xem `cs-ui-thiet-lap-thuc-don-du-tru`).

## 5. Bảng giá dự trù bếp (`/supplier/kitchen-projected-pricings`)

- Chọn **Bếp** → sửa **«Giá dự trù»** và **«NCC liên kết»** trên bảng → **«Lưu thay đổi»**. Mỗi dòng là bếp × nguyên liệu × ĐVT.
- Menu **«Thao tác»**: «Upload Excel» (template trống / template kèm đủ nguyên liệu), **«Cập nhật bảng giá dự trù theo PO»** (chọn tháng), **«Cập nhật bảng giá dự trù theo báo giá tháng NCC»**, «Xóa nhiều», «Tải lại».
- Giá ưu tiên dòng đúng ĐVT định lượng; không có thì suy từ giá theo ĐVT kho × hệ số quy đổi; không có giá thì bằng 0.
- Trên Dự trù ngày, **Thao tác → «Đơn giá dự trù nguyên liệu»** đồng bộ giá bếp vào giá của ngày hoặc sửa tay.

## 6. Cơ cấu báo cáo dự trù ngày (`/settings/pnl-report/configs`)

- Tab **«Báo cáo dự trù ngày»**: mỗi dòng chỉ tiêu thuộc một **hạng mục báo cáo** (doanh thu / chi phí / lợi nhuận) và có cách tính: % cố định theo bếp (nhân công, gas…), tổng, theo hạng mục, lợi nhuận, hoặc **tổng chi phí nguyên liệu theo Nhóm hàng hóa** (có tuỳ chọn «nhóm còn lại»).
- Vì vậy báo cáo dự trù gom chi phí nguyên liệu **theo Nhóm hàng hóa của nguyên liệu**, không theo món: khai đúng «Nhóm» trên nguyên liệu thì báo cáo mới đúng.
- Sửa thứ tự, ghi chú ngay trên bảng (tự lưu khi rời ô); ngăn kéo **«Hạng mục báo cáo»** để thêm/sửa hạng mục. Đây là cấu hình dùng chung toàn công ty: hỏi người dùng trước khi sửa.

## 7. MCP Giai đoạn 1 vs Web UI

| Việc | MCP Giai đoạn 1 | Giao diện Web |
| :--- | :--- | :--- |
| Thực đơn tuần (`CS-TDT-01`) | `cs_weekly_meal_plan_cells_by_day`, `..._cell_set_dish`, `..._cell_set_servings` | Khởi tạo/Copy tuần, Cập nhật cấu hình, In PDF, Xóa ô |
| Dự trù ngày (`CS-TDT-02`/`03`) | Đọc công thức `cs_recipe_get`, `cs_recipe_ingredients_list` | Nhập/tải File đặt hàng, Đồng bộ bản lưu công thức |
| Giá & P&L | Đọc NCC `cs_suppliers_list` | Sửa `CS-TDT-05`, `CS-QTH-01B` |
