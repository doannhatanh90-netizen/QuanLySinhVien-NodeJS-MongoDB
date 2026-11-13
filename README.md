# BÀI 03 – QUẢN LÝ SINH VIÊN BẰNG NODE.JS VÀ MONGODB

- Họ tên: Đoàn Mai Nhật Anh
- Mã sinh viên: CD-CNTT18A01
- Lớp: CD-CNTT18A

## Mục tiêu
Thực hành kết nối MongoDB từ Node.js, thêm một/nhiều sinh viên, xem, tìm, sửa, xóa, sắp xếp và thống kê.

## Yêu cầu môi trường
- Node.js và npm
- MongoDB Community Server đang chạy trên máy tại `mongodb://127.0.0.1:27017`

## Cách chạy
Mở Terminal tại thư mục có `app.js`:

```powershell
npm install
node app.js
```

## Thực hành
1. Chọn `2` để thêm tối đa 20 sinh viên mẫu vào collection `SinhVien` của database `QuanLySinhVien`.
2. Chọn `3` để xem danh sách; `8` để đếm số sinh viên.
3. Chọn `1` để thêm một sinh viên mới.
4. Chọn `4`, `5`, `6`, `7` để tìm, sửa, xóa và sắp xếp.
5. Chọn `0` để thoát.

## Lưu ý
- Dữ liệu lưu trong MongoDB, không lưu trực tiếp vào tập tin txt.
- Danh sách 20 sinh viên là **dữ liệu minh họa**, không phải danh sách lớp thực tế.
- Mã sinh viên là duy nhất; chọn `2` nhiều lần không thêm trùng các mã đã tồn tại.
- Cần có MongoDB đang chạy thì chương trình mới hoạt động.
