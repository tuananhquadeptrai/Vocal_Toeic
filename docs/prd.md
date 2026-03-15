# PRD - English Vocabulary Quiz App

## 1. Tổng quan sản phẩm

**Tên sản phẩm:** English Vocabulary Quiz App

**Loại sản phẩm:** Ứng dụng web học từ vựng cá nhân hóa

**Mục tiêu:** Giúp người học tự tạo ngân hàng từ vựng của riêng mình và ôn tập bằng các bài quiz ngắn, tập trung vào nhớ nghĩa và nhớ từ đồng nghĩa.

**Giá trị cốt lõi:** Ứng dụng không phụ thuộc vào bộ dữ liệu có sẵn của hệ thống. Người dùng học trực tiếp trên danh sách từ của chính họ, nên phù hợp với học theo giáo trình, tài liệu ôn thi và chủ đề cá nhân.

## 2. Vấn đề cần giải quyết

Nhiều ứng dụng học từ vựng hiện nay quá chung chung hoặc chỉ xoay quanh bộ từ cố định. Người học cần một công cụ đơn giản hơn để:

- tự nhập bộ từ riêng,
- luyện tập nhanh theo vòng lặp ngắn,
- nhận phản hồi ngay sau khi trả lời,
- theo dõi các từ yếu để ôn lại.

## 3. Đối tượng người dùng

- Học sinh, sinh viên ôn từ theo bài học hoặc chủ đề
- Người tự học tiếng Anh muốn tự xây bộ từ riêng
- Người ôn thi cần luyện bộ từ lấy từ tài liệu hoặc đề mẫu

## 4. Mục tiêu sản phẩm

- Cho phép thêm và quản lý từ vựng nhanh
- Tự động sinh quiz từ dữ liệu người dùng đã nhập
- Chấm đáp án linh hoạt nhờ chuẩn hóa đầu vào và hỗ trợ nhiều đáp án đúng
- Tạo vòng lặp học ngắn: thêm từ, làm quiz, xem lỗi sai, học lại
- Tạo nền tảng để mở rộng sang flashcards và spaced repetition sau này

## 5. Phạm vi MVP

### Trong phạm vi

- Thêm, sửa, xóa từ vựng
- Lưu nhiều nghĩa và nhiều từ đồng nghĩa cho một từ
- Tìm kiếm và lọc theo từ khóa hoặc chủ đề
- Tự động sinh quiz từ các từ hợp lệ
- Hỗ trợ 2 loại câu hỏi:
  - Từ tiếng Anh -> nhập nghĩa tiếng Việt
  - Từ tiếng Anh -> nhập một từ đồng nghĩa hợp lệ
- Chấm đáp án sau khi chuẩn hóa dữ liệu
- Phản hồi ngay sau mỗi câu trả lời
- Hiển thị kết quả cuối bài
- Cho phép học lại các từ làm sai
- Lưu tiến độ học cơ bản trên thiết bị
- Import và export dữ liệu từ vựng

### Ngoài phạm vi MVP

- Tài khoản người dùng
- Đồng bộ đa thiết bị
- Chia sẻ bộ từ
- Gamification
- Spaced repetition nâng cao
- Ứng dụng mobile native

## 6. Luồng sử dụng chính

### Luồng 1: Thêm từ

1. Người dùng mở danh sách từ
2. Chọn thêm từ mới
3. Nhập `word`, `meanings`, `synonyms` và thông tin tùy chọn
4. Hệ thống kiểm tra hợp lệ và lưu dữ liệu
5. Từ mới xuất hiện trong ngân hàng từ vựng

### Luồng 2: Bắt đầu quiz

1. Người dùng vào màn hình thiết lập quiz
2. Chọn số câu, chủ đề và chế độ làm bài
3. Hệ thống sinh bộ câu hỏi hợp lệ
4. Người dùng trả lời từng câu
5. Hệ thống chấm và phản hồi ngay
6. Người dùng xem kết quả cuối bài và danh sách câu sai

### Luồng 3: Học lại từ yếu

1. Người dùng hoàn thành bài quiz
2. Hệ thống hiển thị các từ trả lời sai
3. Người dùng chọn học lại
4. Hệ thống tạo bài quiz mới từ nhóm từ yếu

## 7. Yêu cầu chức năng

### 7.1. Quản lý từ vựng

- Người dùng có thể tạo một từ vựng với các trường:
  - `word` bắt buộc
  - `meanings[]` bắt buộc
  - `synonyms[]` không bắt buộc
  - `example` không bắt buộc
  - `topic` không bắt buộc
- Người dùng có thể sửa và xóa từ
- Người dùng có thể tìm kiếm theo từ, nghĩa, synonym hoặc topic
- Hệ thống cảnh báo từ trùng và dữ liệu bắt buộc bị thiếu

### 7.2. Sinh quiz

- Hệ thống chỉ sinh câu hỏi từ các từ có dữ liệu hợp lệ
- Câu hỏi nghĩa yêu cầu phải có ít nhất một meaning
- Câu hỏi synonym yêu cầu phải có ít nhất một synonym
- Quiz có thể lọc theo topic
- Quiz hỗ trợ các chế độ:
  - mixed
  - meaning only
  - synonym only
  - wrong words only

### 7.3. Kiểm tra đáp án

- Hệ thống chuẩn hóa cả dữ liệu đã lưu và dữ liệu người dùng nhập
- Quy tắc chuẩn hóa gồm:
  - chuyển về chữ thường
  - xóa khoảng trắng đầu và cuối
  - gộp nhiều khoảng trắng liên tiếp
  - bỏ nhiễu dấu câu đơn giản
- Một câu được tính đúng nếu khớp với bất kỳ đáp án hợp lệ nào sau chuẩn hóa
- Nếu sai, hệ thống hiển thị ít nhất một đáp án đúng

### 7.4. Kết quả và tiến độ

- Hiển thị:
  - tổng số câu
  - số câu đúng
  - số câu sai
  - tỷ lệ chính xác
  - danh sách từ sai
- Lưu lịch sử các phiên quiz
- Theo dõi hiệu suất cơ bản của từng từ để phục vụ học lại

### 7.5. Import và export

- Người dùng có thể import từ CSV
- Người dùng có thể export dữ liệu ra CSV hoặc JSON
- Dữ liệu import phải được kiểm tra trước khi lưu

## 8. Yêu cầu phi chức năng

- Giao diện responsive, ưu tiên mobile-first
- Tốc độ thao tác nhanh, phù hợp học hằng ngày
- Không mất dữ liệu khi tải lại trang trong điều kiện sử dụng bình thường
- Có empty state rõ ràng cho người dùng mới
- Form và luồng quiz hỗ trợ tốt cho thao tác bằng bàn phím

## 9. Chỉ số thành công

- Người dùng có thể quản lý ít nhất 100 từ mà không lỗi dữ liệu
- Người dùng có thể bắt đầu một bài quiz trong dưới 30 giây sau khi mở app
- Hệ thống không sinh câu hỏi vô hiệu
- Màn kết quả giúp người dùng nhận ra rõ các từ cần học lại
- Người dùng mới có thể hoàn thành bài quiz đầu tiên mà không cần người khác hướng dẫn

## 10. Rủi ro và hướng xử lý

| Rủi ro | Tác động | Hướng xử lý |
|---|---|---|
| Dữ liệu nhập không đồng nhất | Chấm sai hoặc quiz kém chất lượng | Chuẩn hóa dữ liệu và kiểm tra hợp lệ khi thêm hoặc sửa |
| Số lượng từ quá ít | Trải nghiệm học nghèo nàn | Cung cấp dữ liệu mẫu và hỗ trợ import CSV |
| Trải nghiệm lặp lại, dễ chán | Giảm khả năng quay lại học | Hỗ trợ học lại từ sai và trộn loại câu hỏi |
| Mở rộng quá sớm | Chậm ra MVP | Giữ phạm vi tập trung vào vòng lặp học cốt lõi |

## 11. Khuyến nghị phát hành

Nên triển khai MVP dưới dạng web app local-first để kiểm chứng thói quen học và nhu cầu thực tế trước. Sau khi có tín hiệu tốt, mới mở rộng sang tài khoản, đồng bộ dữ liệu và cơ chế ôn tập nâng cao.
