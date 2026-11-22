---
name: cs-ui-nhan-su-va-phan-quyen
description: >-
  Hướng dẫn vận hành phân hệ Nhân sự – Chấm công – Tiền lương (CS-NS-01..16), Công việc cá nhân (CS-CV-01..03) và Quản trị công ty – Tài khoản – Phân quyền chi tiết – Yêu cầu hỗ trợ (CS-QTH-02, CS-QTH-03, CS-QTH-08..13) qua Web UI và các công cụ MCP Giai đoạn 1 được phép.
---

# Kỹ năng UI: Nhân sự, Chấm công, Tiền lương & Phân quyền công ty

> **Quy tắc bắt buộc (An toàn MCP OAuth 2.1 & UI):** Trên Claude Code và Codex, luôn đọc thêm file `../cs-ui-ban-do-thuc-don-du-tru/QUY-TAC-BAT-BUOC.md` trước khi thao tác hoặc gọi công cụ MCP (Antigravity nạp sẵn qua `rules/AGENTS.md`).

> Đọc `cs-ui-ban-do-thuc-don-du-tru` trước. Tài liệu danh mục toàn bộ màn hình & mã chức năng: `https://catersoft.app/llms-hr.txt` và `https://catersoft.app/llms-settings.txt`.

## 1. Phạm vi MCP Giai đoạn 1 vs Giao diện Web

| STT | Tác vụ | Được phép qua MCP Giai đoạn 1 | Bắt buộc thao tác trên Giao diện Web |
| :-: | :--- | :--- | :--- |
| 1 | Hồ sơ Nhân sự (`CS-NS-05`..`13`) | Chỉ đọc `cs_hr_employees_list`, `cs_hr_employee_get` | Tạo/sửa nhân sự, CCCD, Bộ phận, Chức vụ, Hợp đồng, Khám sức khỏe, Khen thưởng/vi phạm, Sơ đồ tổ chức bếp |
| 2 | Chấm công & Tiền lương | Không có công cụ chấm công / sửa lương qua MCP | **Điểm danh (`CS-NS-01`)**, đồng bộ máy chấm công, khóa ngày, **Tổng hợp công (`CS-NS-04`)**, **Quản lý lương (`CS-NS-06`)** |
| 3 | Công việc cá nhân (`CS-CV-*`) | Đọc/tạo/sửa `cs_todos_list`, `cs_todo_create`, `cs_todo_update` | Xử lý quy trình nâng cao trên `/todo`, `/todo/my-tasks`, `/todo/progress` |
| 4 | Quản trị công ty & Phân quyền | `cs_tenant_whoami` để kiểm tra vai trò & quyền hiện tại | Sửa **Thông tin công ty (`CS-QTH-03`)**, **Tài khoản nhân viên (`CS-QTH-02`)**, **Phân quyền chi tiết (`CS-QTH-11`)**, **Menu (`CS-QTH-10`)** |

## 2. Bản đồ màn hình Nhân sự & Quản trị công ty

| STT | Tên ngắn | Tên trên menu | Đường dẫn | Mã trang | Dùng để |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | Quy trình Nhân sự | Quy trình Nhân sự | `/hr` | `CS-NS-16` | Sơ đồ 5 làn nghiệp vụ: Hồ sơ → Gắn theo NV → Công tháng → Máy chấm công → Tra cứu |
| 2 | Danh mục nhân sự gốc | Bộ phận / Chức vụ / Ca làm việc | `/hr/departments`, `/hr/positions`, `/hr/work-shifts` | `CS-NS-10B`, `CS-NS-10C`, `CS-NS-06B` | Thiết lập khung tổ chức và ca làm việc nhân sự trước khi nhập hồ sơ |
| 3 | Hồ sơ nhân sự | Danh sách nhân sự & CCCD | `/hr/employees`, `/hr/citizen-id`, `/hr/org-chart` | `CS-NS-05`, `CS-NS-07`, `CS-NS-10` | Quản lý thông tin nhân sự, giấy tờ tùy thân và phân bổ vào sơ đồ bếp |
| 4 | Hồ sơ gắn theo NV | Hợp đồng / Khám sức khỏe / Khen thưởng | `/hr/employment-contracts`, `/hr/health-examinations`, `/hr/employee-records` | `CS-NS-13`, `CS-NS-08`, `CS-NS-09` | Theo dõi hợp đồng lao động, hạn khám sức khỏe và ghi nhận kỷ luật/khen thưởng |
| 5 | Điểm danh hàng ngày | Điểm danh hàng ngày (V2) / Điểm danh (V1 cũ) | `/hr/daily-attendance`, `/hr/attendance` | `CS-NS-01` | Chấm công theo bếp và ngày; tài khoản có quyền V2 khi vào `/hr/attendance` sẽ tự chuyển sang `/hr/daily-attendance` |
| 6 | Tổng hợp công & Lương | Tổng hợp điểm danh (V2) / Quản lý lương | `/hr/daily-attendance/reports`, `/hr/attendance/reports`, `/hr/salaries` | `CS-NS-04`, `CS-NS-06` | Tổng hợp công tháng, xuất bảng lương và quản lý mức lương nhân sự |
| 7 | Quản trị công ty | Thông tin công ty & Menu công ty | `/admin/company`, `/admin/company/sidebar-items` | `CS-QTH-03`, `CS-QTH-10` | Cập nhật pháp nhân, logo, cấu hình hệ thống, bảng quy đổi gợi ý và ẩn/hiện menu |
| 8 | Tài khoản & Phân quyền | Tài khoản nhân viên / Phân quyền chi tiết | `/admin/staff`, `/admin/permission-matrix` | `CS-QTH-02`, `CS-QTH-11` | Tạo/mở/khóa tài khoản, gán phạm vi dữ liệu kho/bếp và cấp quyền chi tiết từng màn hình |
| 9 | Hỗ trợ kỹ thuật | Yêu cầu hỗ trợ | `/support-tickets` | `CS-QTH-13` | Tạo và theo dõi phiếu yêu cầu hỗ trợ kỹ thuật gửi đội ngũ CaterSoft |

## 3. Thứ tự khởi tạo & Nguyên tắc vận hành an toàn

1. **Dựng dữ liệu Nhân sự theo đúng thứ tự (`CS-NS-16`):**
   - Khai trước **Bộ phận (`CS-NS-10B`)**, **Chức vụ (`CS-NS-10C`)**, **Ca làm việc (`CS-NS-06B`)**.
   - Tạo **Nhân sự (`CS-NS-05`)** và **CCCD (`CS-NS-07`)**, phân vào **Sơ đồ tổ chức (`CS-NS-10`)** theo từng bếp để khi mở **Điểm danh hàng ngày (`CS-NS-01`)** có thể dùng nút **Khởi tạo dữ liệu / danh sách từ nhân sự bếp** (`CS-NS-01-F02`).
   - Sau đó mới gắn **Hợp đồng (`CS-NS-13`)**, **Khám sức khỏe (`CS-NS-08`)** và **Mức lương (`CS-NS-06`)**.
2. **Chấm công & Tính lương hàng ngày (`CS-NS-01`, `CS-NS-04`):**
   - Nhập chấm công hoặc đồng bộ máy chấm công → kiểm tra lại và bấm **Lưu** trên thanh chờ (`CS-NS-01-F04`).
   - Lưu ý **Khóa ngày điểm danh (`CS-NS-01-F07`):** tính năng này **chỉ có trên màn hình Điểm danh V1 cũ** (`/hr/attendance`); trên bản Điểm danh hàng ngày V2 (`/hr/daily-attendance`) `CS-NS-01-F07` có trạng thái `Chưa có trên trang`. Chỉ bấm **Khóa ngày điểm danh** (bản V1) hoặc **Khóa / Chốt bảng lương** sau khi **người dùng xác nhận đồng ý**.
3. **Cấp quyền cho nhân sự hoặc Trợ lý AI MCP (`CS-QTH-02`, `CS-QTH-11`):**
   - Quyền của kết nối **CaterSoft MCP (OAuth 2.1)** luôn kế thừa 100% từ quyền tài khoản trên `/admin/staff` và `/admin/permission-matrix` (cùng phạm vi Bếp / Kho được gán).
   - Khi tài khoản không thấy một màn hình hoặc công cụ MCP báo thiếu quyền (`-32003`), hướng dẫn quản trị công ty mở `/admin/staff` và `/admin/permission-matrix` kiểm tra lại nhóm quyền và danh sách Bếp được giao.
   - Mọi thao tác **khóa tài khoản**, **nâng vai trò quản trị**, **đổi phạm vi quyền** hoặc **sửa Cấu hình Công ty (`CS-QTH-03`)** đều phải **dừng lại trình bày chi tiết và chờ người dùng xác nhận**.
