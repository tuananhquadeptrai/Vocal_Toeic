# Đề Xuất Kỹ Thuật

## 1. Tech stack đề xuất

### Stack cho MVP

- **Framework:** Next.js 15 với App Router
- **Ngôn ngữ:** TypeScript
- **UI:** Tailwind CSS + shadcn/ui
- **State management:** Zustand
- **Form:** React Hook Form + Zod
- **Local database:** IndexedDB qua Dexie
- **Bảng và danh sách:** TanStack Table
- **Xử lý CSV:** Papa Parse
- **Biểu đồ:** Recharts
- **Testing:** Vitest + Testing Library + Playwright
- **Deploy:** Vercel

### Lý do chọn stack này

- Next.js đủ mạnh cho web MVP và dễ mở rộng sang auth hoặc API sau này
- TypeScript giúp giữ logic quiz và dữ liệu chặt chẽ hơn
- IndexedDB phù hợp hơn localStorage khi lưu danh sách từ lớn và lịch sử quiz
- Dexie giúp thao tác IndexedDB đơn giản và dễ bảo trì
- Zod có thể dùng chung cho validate form và validate dữ liệu import

## 2. Kiến trúc ứng dụng đề xuất

### Phân lớp frontend

- `app/`: route và màn hình
- `components/`: UI dùng chung
- `features/vocabulary/`: logic và giao diện quản lý từ
- `features/quiz/`: quiz engine, session UI, result UI
- `features/progress/`: báo cáo và lịch sử học
- `lib/db/`: schema Dexie và logic lưu trữ
- `lib/utils/`: normalization, parsing, scoring
- `lib/types/`: kiểu dữ liệu dùng chung
- `lib/validators/`: schema validate

### Cách triển khai

- Ưu tiên client-first cho MVP
- Ưu tiên local-first để giảm chi phí backend
- Có thể thêm backend về sau mà không phải viết lại toàn bộ domain logic

## 3. Cấu trúc database

### Lựa chọn cho MVP

Sử dụng **IndexedDB** trong trình duyệt để lưu dữ liệu local-first.

### Bảng `vocabulary_words`

| Trường | Kiểu | Mô tả |
|---|---|---|
| `id` | string | UUID |
| `word` | string | Bắt buộc |
| `normalizedWord` | string | Dùng để search và check trùng |
| `meanings` | string[] | Danh sách nghĩa hợp lệ |
| `normalizedMeanings` | string[] | Dùng để chấm đáp án |
| `synonyms` | string[] | Danh sách synonym |
| `normalizedSynonyms` | string[] | Dùng để chấm đáp án |
| `example` | string nullable | Ví dụ minh họa |
| `topic` | string nullable | Chủ đề |
| `status` | string | `new`, `learning`, `reviewed`, `weak` |
| `reviewCount` | number | Số lần xuất hiện trong quiz |
| `correctCount` | number | Số lần trả lời đúng |
| `wrongCount` | number | Số lần trả lời sai |
| `lastReviewedAt` | string nullable | ISO datetime |
| `createdAt` | string | ISO datetime |
| `updatedAt` | string | ISO datetime |

### Bảng `quiz_sessions`

| Trường | Kiểu | Mô tả |
|---|---|---|
| `id` | string | UUID |
| `mode` | string | `mixed`, `meaning`, `synonym`, `wrong-only` |
| `topic` | string nullable | Bộ lọc quiz |
| `questionCount` | number | Số câu được tạo |
| `correctCount` | number | Tổng câu đúng |
| `wrongCount` | number | Tổng câu sai |
| `accuracy` | number | Tỷ lệ chính xác |
| `startedAt` | string | ISO datetime |
| `finishedAt` | string nullable | ISO datetime |

### Bảng `quiz_answers`

| Trường | Kiểu | Mô tả |
|---|---|---|
| `id` | string | UUID |
| `sessionId` | string | Liên kết tới quiz session |
| `wordId` | string | Liên kết tới vocabulary word |
| `questionType` | string | `meaning` hoặc `synonym` |
| `prompt` | string | Thường là từ tiếng Anh |
| `userAnswer` | string | Câu trả lời gốc |
| `normalizedUserAnswer` | string | Câu trả lời sau chuẩn hóa |
| `isCorrect` | boolean | Kết quả chấm |
| `acceptedAnswer` | string | Một đáp án đúng để hiển thị |
| `answeredAt` | string | ISO datetime |

## 4. Quy tắc nghiệp vụ cốt lõi

### Validation

- `word` là bắt buộc
- phải có ít nhất một meaning
- loại bỏ phần tử rỗng trong mảng meaning và synonym
- gộp giá trị trùng nhau sau khi chuẩn hóa
- có thể chặn hoặc cảnh báo nếu synonym trùng với chính `word`

### Answer matching

- so khớp exact match sau chuẩn hóa
- chưa dùng fuzzy matching ở MVP
- có thể bỏ qua nhiễu dấu câu đơn giản
- chỉ cần khớp một đáp án hợp lệ là tính đúng

## 5. Sitemap màn hình

```text
/
|-- /vocabulary
|   |-- /vocabulary/new
|   |-- /vocabulary/[id]/edit
|-- /quiz
|   |-- /quiz/setup
|   |-- /quiz/session
|   |-- /quiz/result
|-- /progress
|-- /import
|-- /settings
```

## 6. Vai trò từng màn hình

### `/`

- dashboard nhẹ
- hiển thị thống kê nhanh
- shortcut đến thêm từ và bắt đầu quiz

### `/vocabulary`

- danh sách từ có search
- lọc theo topic
- lọc theo trạng thái
- thao tác sửa và xóa nhanh

### `/vocabulary/new`

- form thêm từ mới
- validate trực tiếp

### `/vocabulary/[id]/edit`

- form sửa từ hiện có
- giữ nguyên cấu trúc dữ liệu mảng

### `/quiz/setup`

- chọn mode
- chọn topic
- chọn số câu
- báo số lượng từ hợp lệ có thể quiz

### `/quiz/session`

- hiển thị từng câu hỏi
- ô nhập đáp án
- nút nộp câu trả lời
- phản hồi ngay
- thanh tiến độ

### `/quiz/result`

- tổng kết điểm
- danh sách từ sai
- CTA học lại từ yếu

### `/progress`

- tổng quan học tập
- lịch sử quiz gần đây
- danh sách từ cần ôn lại

### `/import`

- upload CSV
- preview dữ liệu
- xác nhận import
- export dữ liệu

### `/settings`

- reset dữ liệu local
- export backup
- nơi để mở rộng cài đặt sau này

## 7. Cấu trúc thư mục gợi ý

```text
src/
  app/
    page.tsx
    vocabulary/
    quiz/
    progress/
    import/
    settings/
  components/
  features/
    vocabulary/
    quiz/
    progress/
  lib/
    db/
    types/
    utils/
    validators/
```

## 8. Hướng mở rộng sau MVP

- Thêm auth bằng Clerk hoặc Auth.js
- Chuyển từ IndexedDB sang Supabase hoặc Firebase
- Đồng bộ dữ liệu giữa local và cloud
- Thêm spaced repetition
- Thêm chia sẻ bộ từ hoặc classroom mode
