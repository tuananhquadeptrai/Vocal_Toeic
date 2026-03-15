# Checklist Chức Năng Để Code

## 1. Khởi tạo dự án

- Tạo cấu trúc frontend project
- Cấu hình TypeScript, ESLint, Prettier
- Thiết lập design tokens hoặc UI base
- Thiết lập state management phía client
- Thiết lập local database

## 2. Mô hình dữ liệu

- Định nghĩa model `VocabularyWord`
- Định nghĩa model `QuizSession`
- Định nghĩa model `QuizAnswer`
- Viết utility chuẩn hóa đáp án
- Định nghĩa mapping import và export CSV

## 3. Quản lý từ vựng

- Làm màn hình danh sách từ
- Làm form thêm từ
- Làm form sửa từ
- Làm flow xóa từ
- Thêm validate dữ liệu
- Thêm check từ trùng
- Thêm tìm kiếm theo từ khóa
- Thêm lọc theo topic
- Thêm trạng thái như `new`, `practiced`, `wrong-often`

## 4. Thiết lập quiz

- Làm màn hình setup quiz
- Chọn số câu hỏi
- Chọn chế độ quiz
- Chọn topic
- Thêm chế độ học lại từ sai
- Chặn bắt đầu quiz nếu dữ liệu chưa đủ

## 5. Quiz engine

- Sinh tập câu hỏi hợp lệ từ dữ liệu đã lưu
- Hỗ trợ câu hỏi nghĩa
- Hỗ trợ câu hỏi synonym
- Trộn thứ tự câu hỏi
- Theo dõi vị trí câu hiện tại
- Theo dõi tiến độ phiên học
- Hạn chế lặp câu trong cùng một phiên nếu có thể

## 6. Chấm đáp án

- Chuẩn hóa input của người dùng
- Chuẩn hóa đáp án đã lưu
- So sánh với nhiều meanings
- So sánh với nhiều synonyms
- Trả kết quả đúng hoặc sai ngay
- Hiển thị đáp án đúng khi trả lời sai
- Lưu kết quả từng câu để báo cáo

## 7. Kết quả và ôn lại

- Làm màn hình tổng kết
- Hiển thị điểm và tỷ lệ đúng
- Hiển thị danh sách từ sai
- Thêm nút học lại từ sai
- Cập nhật thống kê từng từ sau mỗi quiz
- Lưu lịch sử phiên học

## 8. Import và export

- Làm giao diện import CSV
- Parse CSV an toàn
- Validate dữ liệu import
- Hiển thị preview trước khi lưu
- Export ra JSON
- Export ra CSV

## 9. Thống kê và tiến độ

- Hiển thị tổng số từ
- Hiển thị nhóm từ yếu
- Hiển thị lịch sử quiz gần đây
- Hiển thị top từ sai nhiều
- Hiển thị hoạt động học theo ngày hoặc tuần

## 10. UX và hoàn thiện

- Thêm empty state cho app mới
- Thêm empty state cho trường hợp không đủ từ để quiz
- Thêm toast thành công và lỗi
- Thêm loading và disabled state
- Tối ưu giao diện mobile
- Tối ưu thao tác bằng bàn phím
- Giữ dữ liệu ổn định sau khi refresh

## 11. Testing

- Viết unit test cho logic chuẩn hóa
- Viết unit test cho logic matching đáp án
- Viết unit test cho logic sinh quiz
- Viết integration test cho CRUD từ vựng
- Viết integration test cho flow quiz
- Viết integration test cho import dữ liệu

## 12. Sẵn sàng phát hành

- Thêm bộ dữ liệu mẫu
- Kiểm tra hiệu năng với 100 đến 500 từ
- Kiểm tra responsive trên mobile và desktop
- Kiểm tra persistence sau reload
- Kiểm tra export backup trước khi release
