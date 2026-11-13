const { MongoClient } = require('mongodb');
const readline = require('readline');

const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const hoi = (cauHoi) => new Promise(resolve => rl.question(cauHoi, answer => resolve(answer.trim())));
const dsMau = [
  'Đoàn Mai Nhật Anh', 'Nguyễn Văn An', 'Trần Thị Bình', 'Lê Minh Châu',
  'Phạm Quốc Dũng', 'Hoàng Thị Hà', 'Võ Thanh Hải', 'Đặng Minh Hiếu',
  'Bùi Ngọc Hân', 'Nguyễn Khánh Huy', 'Trần Quốc Khánh', 'Lê Thị Lan',
  'Phan Đức Long', 'Vũ Hoàng Nam', 'Đỗ Thị Ngọc', 'Nguyễn Minh Phúc',
  'Trương Gia Quân', 'Hồ Thị Thảo', 'Phạm Anh Tuấn', 'Lý Thanh Vy'
].map((hoTen, i) => ({ maSV: `CD-CNTT18A${String(i + 1).padStart(2, '0')}`, hoTen, lop: 'CD-CNTT18A', tuoi: 18 + (i % 4) }));

async function main() {
  try {
    await client.connect();
    const collection = client.db('QuanLySinhVien').collection('SinhVien');
    await collection.createIndex({ maSV: 1 }, { unique: true });
    while (true) {
      console.log('\n===== QUẢN LÝ SINH VIÊN =====');
      console.log('1. Thêm một sinh viên');
      console.log('2. Thêm 20 sinh viên mẫu');
      console.log('3. Xem danh sách sinh viên');
      console.log('4. Tìm theo mã sinh viên');
      console.log('5. Cập nhật sinh viên');
      console.log('6. Xóa sinh viên');
      console.log('7. Sắp xếp theo họ tên');
      console.log('8. Thống kê số sinh viên');
      console.log('0. Thoát');
      const chon = await hoi('Chọn chức năng: ');
      try {
        if (chon === '0') break;
        if (chon === '1') {
          const maSV = await hoi('Mã sinh viên: ');
          const hoTen = await hoi('Họ tên: ');
          const lop = await hoi('Lớp: ');
          const tuoi = Number(await hoi('Tuổi: '));
          if (!maSV || !hoTen || !lop || !Number.isInteger(tuoi) || tuoi <= 0) { console.log('Dữ liệu không hợp lệ.'); continue; }
          await collection.insertOne({ maSV, hoTen, lop, tuoi });
          console.log('Đã thêm sinh viên.');
        } else if (chon === '2') {
          const maDaCo = new Set((await collection.find({}, { projection: { maSV: 1 } }).toArray()).map(sv => sv.maSV));
          const moi = dsMau.filter(sv => !maDaCo.has(sv.maSV));
          if (!moi.length) { console.log('20 mã sinh viên mẫu đã có, không thêm trùng.'); continue; }
          const kq = await collection.insertMany(moi);
          console.log(`Đã thêm ${kq.insertedCount} sinh viên mẫu (bỏ qua mã đã tồn tại).`);
        } else if (chon === '3' || chon === '7') {
          const sapXep = chon === '7' ? { hoTen: 1 } : { maSV: 1 };
          const ds = await collection.find({}, { projection: { _id: 0 } }).sort(sapXep).toArray();
          console.table(ds);
          if (!ds.length) console.log('Chưa có sinh viên.');
        } else if (chon === '4') {
          const maSV = await hoi('Nhập mã cần tìm: ');
          const sv = await collection.findOne({ maSV }, { projection: { _id: 0 } });
          if (sv) console.table([sv]); else console.log('Không tìm thấy sinh viên.');
        } else if (chon === '5') {
          const maSV = await hoi('Mã sinh viên cần sửa: ');
          const hoTen = await hoi('Họ tên mới: ');
          if (!hoTen) { console.log('Họ tên không được trống.'); continue; }
          const kq = await collection.updateOne({ maSV }, { $set: { hoTen } });
          console.log(kq.matchedCount ? 'Đã cập nhật.' : 'Không tìm thấy sinh viên.');
        } else if (chon === '6') {
          const maSV = await hoi('Mã sinh viên cần xóa: ');
          const kq = await collection.deleteOne({ maSV });
          console.log(kq.deletedCount ? 'Đã xóa.' : 'Không tìm thấy sinh viên.');
        } else if (chon === '8') {
          console.log('Tổng số sinh viên:', await collection.countDocuments());
        } else console.log('Vui lòng chọn từ 0 đến 8.');
      } catch (err) {
        if (err.code === 11000) console.log('Mã sinh viên đã tồn tại.');
        else console.log('Lỗi:', err.message);
      }
    }
  } catch (err) {
    console.log('Không kết nối được MongoDB. Hãy bật MongoDB tại localhost:27017.');
    console.log('Chi tiết:', err.message);
  } finally {
    rl.close();
    await client.close();
  }
}
main();
