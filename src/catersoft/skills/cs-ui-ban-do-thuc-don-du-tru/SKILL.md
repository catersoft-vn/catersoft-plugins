---
name: cs-ui-ban-do-thuc-don-du-tru
description: >-
  Bản đồ toàn chuỗi Thực đơn & Dự trù trên CaterSoft: dữ liệu nào phụ thuộc dữ liệu nào (nguyên liệu, nhóm, ĐVT, quy đổi,
  món ăn, nhóm món, cơ cấu món, ngân hàng thực đơn, định lượng, ca, điểm dự trù, thiết lập thực đơn dự trù, thực đơn tuần,
  dự trù ngày, số lượng đặt hàng, phần ăn thực tế), thứ tự nhập khi bắt đầu, và cách truy ngược khi số liệu sai hoặc trống.
  Đọc skill này TRƯỚC khi dùng các skill cs-ui-* còn lại, hoặc khi khách hỏi «bắt đầu từ đâu», «vì sao dự trù trống/sai».
---

# Bản đồ Thực đơn & Dự trù (đọc trước)

> **Quy tắc bắt buộc** khi thao tác trên CaterSoft nằm ở file `QUY-TAC-BAT-BUOC.md` cạnh file này (cùng nội dung `rules/AGENTS.md` của plugin).
> - Khi máy chủ **CaterSoft MCP** (`https://catersoft.app/mcp`) đã kết nối bằng tài khoản OAuth của bạn: ưu tiên gọi các công cụ tra cứu và nhập liệu/cập nhật cơ bản (`cs_tenant_whoami`, `cs_units_*`, `cs_inventory_items_*`, `cs_dishes_*`, `cs_recipes_*`, `cs_weekly_meal_plan_*`, `cs_actual_meal_serving_set`...), sau đó luôn đọc lại để xác nhận.
> - Khi thao tác trực tiếp trên trình duyệt hoặc dùng tính năng ngoài phạm vi MCP Giai đoạn 1 (nhập Excel, xóa mềm, cấu hình phức tạp), áp dụng nghiêm ngặt 7 Quy tắc Vàng DOM trong `QUY-TAC-BAT-BUOC.md`.

Plugin **CaterSoft** Giai đoạn 1 phục vụ chuỗi nhập liệu cốt lõi: **khai nguyên liệu và ĐVT → khai món ăn và định lượng → dựng khung suất ăn của bếp → lên thực đơn tuần → nhập số phần dự trù → nhập số phần thực tế để đối soát**. Mỗi bước dùng dữ liệu của bước trước; số liệu sai ở cuối chuỗi gần như luôn do thiếu hoặc sai dữ liệu ở đầu chuỗi.

## 1. Sơ đồ quan hệ dữ liệu

```
ĐƠN VỊ TÍNH ──┐
NHÓM LỚN / NHÓM (bắt buộc) / NHÓM NHỎ ──┐
                                        ▼
NGUYÊN LIỆU (= Hàng hóa loại Thực phẩm)
  • Đơn vị cơ bản (= ĐVT kho) • ĐVT định lượng • Đơn vị quy đổi (1 ĐVT mua = n ĐVT cơ bản) • TLHH sơ chế %
                                        │
NHÓM MÓN ──► MÓN ĂN ◄── NHÓM NL CHÍNH    │
   │            │                       │
   ▼            ▼                       ▼
CƠ CẤU MÓN   NGÂN HÀNG THỰC ĐƠN (NHTĐ) = tập định lượng: Món × Nguyên liệu × ĐVT × Định lượng (sống)
(1 nhóm món)      │
   │              │        CA LÀM VIỆC      ĐIỂM DỰ TRÙ (= một thực đơn, gắn khách hàng)
   │              │             │                 │
   ▼              ▼             ▼                 ▼
THIẾT LẬP THỰC ĐƠN DỰ TRÙ (đúng 1 bản / bếp)
  Bếp → Ca → Điểm dự trù → { Giá/phần ăn, NHTĐ (bắt buộc), Cơ cấu phần → Nhóm món (1 «Món chính» + «Món phụ») → Cơ cấu món → Món mặc định }
                                        │  chép khung khi «Khởi tạo thực đơn tuần»
                                        ▼
THỰC ĐƠN TUẦN: mỗi ca một bảng, dòng = cơ cấu món, cột = ngày, ô = món
                                        │
                                        ▼
DỰ TRÙ NGÀY: Số phần ăn (món chính) + SP. thêm
  → ĐL sống = tổng phần × định lượng (NHTĐ) → ĐL đặt hàng = ĐL sống ÷ (1 − TLHH sơ chế)
  → quy đổi về ĐVT kho → FILE ĐẶT HÀNG NGÀY;  × Bảng giá dự trù bếp → chi phí dự trù
                                        │
                                        ▼
PHẦN ĂN THỰC TẾ: Nơi phục vụ (khách hàng × bếp, có đơn giá) ← Điểm dự trù liên kết Nơi phục vụ
  → Số báo / Số thực tế → Số thanh toán → So sánh dự trù – thực tế
```

## 2. Thứ tự nhập khi bắt đầu (một bếp mới)

| STT | Việc | Skill | Thiếu thì hỏng ở đâu |
| :-: | :--- | :--- | :--- |
| 1 | Bếp nấu, Địa điểm (thường đã có sẵn khi khởi tạo công ty); **Khách hàng** (Khách hàng → Danh sách KH) | — | Không chọn được bếp; Điểm dự trù và Nơi phục vụ không gắn được khách |
| 2 | Đơn vị tính, Nhóm hàng (Nhóm lớn / Nhóm / Nhóm nhỏ) | `cs-ui-nguyen-lieu-dvt` | Không tạo được nguyên liệu |
| 3 | Nguyên liệu: ĐVT cơ bản, ĐVT định lượng, quy đổi, TLHH sơ chế | `cs-ui-nguyen-lieu-dvt` | Định lượng sai đơn vị, file đặt hàng sai số / cảnh báo thiếu quy đổi |
| 4 | Nhóm món, Món ăn, Cơ cấu món | `cs-ui-mon-an-dinh-luong` | Không khai được thiết lập, thực đơn tuần không có dòng |
| 5 | Tên NHTĐ, Định lượng từng món | `cs-ui-mon-an-dinh-luong` | Dự trù ra 0 nguyên liệu cho món |
| 6 | Ca làm việc, Điểm dự trù, (Quy tắc chọn món, Giá phần ăn nếu dùng mẫu) | `cs-ui-thiet-lap-thuc-don-du-tru` | Thiết lập báo «Thiếu dữ liệu ca / điểm dự trù / công thức» |
| 7 | Thiết lập thực đơn dự trù của bếp | `cs-ui-thiet-lap-thuc-don-du-tru` | Không khởi tạo được thực đơn tuần |
| 8 | Thực đơn tuần | `cs-ui-thuc-don-tuan-du-tru-ngay` | Dự trù ngày không có món |
| 9 | **Bảng giá dự trù bếp** (Nhà cung cấp → Bảng giá dự trù bếp), rồi Số phần ăn dự trù ngày → file đặt hàng ngày | `cs-ui-thuc-don-tuan-du-tru-ngay` | Thiếu giá: chi phí dự trù 0đ, file đặt hàng không có đơn giá |
| 10 | Nơi phục vụ, Thiết lập số phần ăn → nhập phần ăn thực tế | `cs-ui-phan-an-thuc-te` | Không tạo được cấu hình ngày để nhập số báo |

Đường tắt cho bếp mới: **Tiện ích → Khởi tạo bếp mới** (`/tien-ich/khoi-tao-bep`, `CS-TI-01`) đi qua *Địa điểm · Bếp · Kho → Khách hàng → Công thức → Điểm dự trù → Cấu hình dự trù → Xem thử → Mẫu in* trên một trang.

### Tìm trang trên menu bên trái

Menu do từng công ty sắp xếp; bảng dưới là vị trí thường gặp (đã xem trên một công ty mẫu ngày 02/11/2026). Không thấy thì dùng ô tìm **«Danh mục & Báo cáo» (⌘K / Ctrl+K)** ở cuối sidebar; vẫn không có thì báo người dùng nhờ quản trị cấp quyền, không gõ đường dẫn để vào.

Ô **«Danh mục & Báo cáo»** có bốn tab **«Danh mục» · «Báo cáo» · «Tạo mới» · «Tiện ích»** và **chỉ tìm trong tab đang mở**: «Không có danh mục nào khớp» chưa có nghĩa là trang không có. Báo cáo như **«So sánh dự trù - thực tế»** nằm ở tab **«Báo cáo»**; Danh sách nguyên liệu, Danh sách món ăn, Cơ cấu món ăn, Ngân hàng thực đơn, Điểm dự trù… nằm ở tab «Danh mục». Gõ không dấu (ví dụ `so sanh`, `co cau mon`).

Có công ty dùng menu gọn khác hẳn bảng dưới (đã xem trên một công ty khác ngày 02/11/2026): nhóm **«Khách hàng»** chứa Phần ăn thực tế, Doanh thu SACN, Thiết lập số phần ăn, Nơi Phục Vụ; nhóm **«Thực đơn dự trù»** chứa thêm Thiết Lập Thực Đơn và Bảng giá dự trù bếp; nhóm **«Món ăn/Nguyên liệu»** chỉ có trang danh mục: **Danh mục mặt hàng** (tab «Nguyên liệu» có cùng nút «Thêm nguyên liệu», «Thao tác»), **Danh mục món ăn** (tab Món ăn · Tên ngân hàng thực đơn · Nhóm món · Nhóm NL chính · Hao hụt chế biến), **QL Ngân hàng thực đơn**. Trang không có trên menu thì tìm bằng ô ⌘K như trên; trang không có cả ở đó (ví dụ «Nhập phần ăn (pivot)») là công ty không dùng: làm bằng trang thay thế trong skill tương ứng.

| STT | Nhóm menu | Trang |
| :-: | :--- | :--- |
| 1 | Dữ liệu chung | Đơn vị tính (Unit) · Nhóm lớn / Nhóm / Nhóm nhỏ hàng hóa · Danh mục mặt hàng · Nhóm món ăn · Nhóm NL chính món ăn · Bếp nấu (Kitchen) · Điểm dự trù · Nhóm điểm dự trù · Ca làm việc (Shift) · Nhóm ca làm việc · Thiết lập số phần ăn |
| 2 | Món ăn/Nguyên liệu | Danh sách nguyên liệu · Danh sách món ăn · Danh mục món ăn · Cơ cấu món ăn · Quy tắc chọn món · Tên ngân hàng thực đơn · Ngân hàng thực đơn · QL Ngân hàng thực đơn · Hao hụt chế biến · Giá phần ăn · Thiết Lập Thực Đơn · Nơi Phục Vụ |
| 3 | Thực đơn dự trù | Thực đơn tuần (Tổng hợp) · Dự trù ngày · Dự trù ngày (Tổng hợp) · So sánh dự trù - thực tế · Phần ăn thực tế · Nhập phần ăn (pivot) · Doanh thu SACN |
| 4 | Khách hàng | Danh sách KH |
| 5 | Nhà cung cấp | Bảng giá dự trù bếp |
| 6 | Tiện ích | Khởi tạo bếp mới · Dựng ngân hàng thực đơn |
| 7 | Quản trị hệ thống | Thông tin công ty (tab «Đơn vị quy đổi») |

Cấu hình báo cáo P&L (cơ cấu báo cáo dự trù ngày) có thể không nằm trên menu của công ty: hỏi người quản trị.

Một số công ty đặt tên menu khác nhau cho cùng một trang (ví dụ «Thực đơn tuần» có thể là trang Tổng hợp mới hoặc bản cũ có công tắc «Tự lưu»): đọc **tiêu đề trang** và mã trong thẻ `page-function-catalog` (`CS-TDT-01` = Tổng hợp, `CS-TDT-14` = bản cũ) trước khi làm theo skill.

Trong Tiện ích, «Dựng ngân hàng thực đơn» (`CS-TI-02`) nhân bản món từ NHTĐ khác hoặc nạp Excel vào một NHTĐ; **món trùng ở NHTĐ đích bị ghi đè**, hỏi người dùng trước. Ba mục «Cấu hình dự trù bếp», «Lên thực đơn dự trù», «Lên định lượng» đang ghi «Sắp có» và chỉ dẫn sang các trang trong bảng trên.

## 3. Truy ngược khi số liệu sai hoặc trống

| Triệu chứng | Kiểm tra theo thứ tự |
| :--- | :--- |
| Thực đơn tuần báo «Chưa có thực đơn cho tuần này» | Bấm **«Khởi tạo thực đơn tuần»**. Báo «Không tìm thấy thực đơn cho bếp này» → bếp chưa có Thiết lập thực đơn dự trù. |
| Thực đơn tuần có ca nhưng không có dòng món | Thực đơn (điểm dự trù) chưa có Cơ cấu phần / nhóm món / cơ cấu món trong thiết lập; sửa thiết lập rồi **Thao tác → «Cập nhật cấu hình mới nhất»**. |
| Sửa thiết lập mà tuần không đổi | Tuần đã khởi tạo giữ bản chép cũ → **«Cập nhật cấu hình mới nhất»**. Vẫn không đổi giá/cơ cấu phần → kiểm trang **Giá phần ăn** (bản đang hoạt động trùng NHTĐ sẽ thắng thiết lập). |
| Dự trù ngày có món nhưng nguyên liệu bằng 0 / thiếu | Nếu vừa bổ sung định lượng mà dự trù chưa đổi: công ty dùng bản lưu công thức → **Thao tác → «Đồng bộ bản lưu công thức»** (skill `cs-ui-thuc-don-tuan-du-tru-ngay` mục 4). Ngoài ra: Món chưa có định lượng trong đúng NHTĐ mà thực đơn (điểm dự trù) đang dùng; hoặc số phần = 0. |
| Số lượng đặt hàng quá lớn / quá nhỏ (×1000) | ĐVT định lượng của nguyên liệu (ví dụ Gam) và quy đổi sang ĐVT kho (Kg) chưa khai, hoặc nhập định lượng theo sai ĐVT. |
| File đặt hàng cảnh báo thiếu quy đổi | Nguyên liệu chưa có **Đơn vị quy đổi** giữa ĐVT định lượng và ĐVT cơ bản. |
| Thành tiền dự trù = 0 | Bốn khả năng: định lượng bằng 0; chưa có giá ở **Bảng giá dự trù bếp** cho bếp × nguyên liệu (× ĐVT); giá đã lưu của ngày bằng 0; hai điểm dùng hai NHTĐ khác nhau nhưng **dùng chung cơ cấu món** (xem `cs-ui-thiet-lap-thuc-don-du-tru`). |
| Doanh thu dự kiến 0đ / % chi phí món 0 | Chưa nhập «Giá/phần ăn» > 0 cho điểm dự trù trong Thiết lập thực đơn (giá ở Nơi phục vụ không thay được). |
| Không thấy món trong hộp «Chọn Món Ăn» | Món chưa gán Nhóm món trùng nhóm của dòng cơ cấu → thêm nhóm cho món. |
| Chọn món ở điểm này làm đổi món ở điểm khác | Hai điểm dùng chung cơ cấu món → tách cơ cấu món riêng trong thiết lập. |
| «Lấy số từ dự trù» không điền được ô | Điểm dự trù chưa liên kết **Nơi phục vụ**; sửa liên kết ngay trong cửa sổ «Lấy số phần từ dự trù». |

## 4. Nguyên tắc khi làm việc trong chuỗi này

- Sửa dữ liệu nền (nguyên liệu, món, định lượng, thiết lập) ảnh hưởng mọi tuần/ngày dùng chung; báo người dùng phạm vi ảnh hưởng trước khi lưu.
- Các thao tác **thay thế toàn bộ** phải hỏi người dùng trước: «Khởi tạo nguyên liệu từ Excel» (xóa toàn bộ định lượng của NHTĐ), «Ghi đè tất cả» khi lấy số từ dự trù, «Dán» phần ăn, «Đồng bộ đơn giá» phần ăn thực tế (không hoàn tác được).
- Sau mỗi bước, đọc lại trên trang kế tiếp của chuỗi (ví dụ khai định lượng xong → mở Dự trù ngày xem nguyên liệu tổng hợp).
