# QA Checklist: Bàn Phím Tiền Custom Và Bàn Tính

Phạm vi: test thủ công trên Android thật hoặc Android emulator qua Capacitor. Feature áp dụng cho các field tiền dùng `CurrencyAmountInput`; các input text, note, date picker và numeric field không phải tiền vẫn dùng hành vi cũ.

## Màn Hình Cần Test

| Màn hình | Field tiền cần kiểm tra | Expected result |
| --- | --- | --- |
| Thêm giao dịch | Số tiền | Focus vào field mở bàn phím tiền custom; không bật native Android keyboard chồng lên. |
| Sửa giao dịch | Số tiền hiện có | Field hiển thị số đã format; mở keyboard custom và cập nhật raw amount đúng khi nhập/xóa/áp dụng bàn tính. |
| Thêm ví | Số dư ban đầu, dư nợ hiện tại nếu là thẻ tín dụng | Field tiền dùng keyboard custom; currency của ví vẫn format đúng. |
| Sửa ví | Số dư/dư nợ, hạn mức tín dụng, phí thường niên | Các field tiền dùng keyboard custom; ngày sao kê/ngày đến hạn vẫn dùng native numeric keyboard. |
| Thêm ngân sách | Số tiền ngân sách | Keyboard custom không che field; footer/action không làm kẹt scroll. |
| Sửa ngân sách | Số tiền ngân sách | Field scroll vào vùng nhìn thấy khi keyboard mở; lưu giữ format đúng. |
| Hóa đơn định kỳ | Số tiền hóa đơn | Field amount dùng keyboard custom; số ngày nhắc trước vẫn dùng native numeric keyboard. |
| Khoản vay/cho vay | Số tiền gốc, số tiền thanh toán nếu có | Keyboard custom mở ổn định; note/contact/date vẫn dùng native keyboard/date picker. |

## Luồng Nhập Số

| Case | Steps | Expected result |
| --- | --- | --- |
| Focus input tiền | Tap vào field tiền trên từng màn hình trong danh sách trên. | Bàn phím tiền custom xuất hiện cố định ở đáy màn hình; field đang focus có border/focus state; native Android keyboard không xuất hiện. |
| Nhập số thường | Tap `1`, `2`, `3`, `4`, `5`. | Raw value cập nhật theo thứ tự nhập; field hiển thị format `12.345` với VND. |
| Nhập `000` | Với field đang có `125`, tap `000`. | Raw value thành `125000`; field hiển thị `125.000`. |
| Xóa ký tự | Với field đang có `125000`, tap phím xóa ký tự. | Raw value xóa một ký tự cuối; field format lại tương ứng, ví dụ `12.500`. |
| Bấm Xong | Tap `Xong`. | Bàn phím tiền custom đóng; field mất focus nếu phù hợp; giá trị hiện tại vẫn giữ nguyên. |
| Đóng form khi keyboard mở | Mở keyboard rồi bấm back/close của form hoặc Android back nếu màn hình hỗ trợ. | Form đóng hoặc back theo hành vi hiện có; không để lại overlay keyboard, body padding, hoặc scroll state bị kẹt. |

## Luồng Bàn Tính

| Case | Steps | Expected result |
| --- | --- | --- |
| Mở bàn tính | Tap field tiền, rồi tap `Bàn tính`. | Keyboard chuyển sang mode calculator; hiển thị expression/result area và các phím toán tử. |
| Tính `100.000 + 25.000` | Trong bàn tính nhập `100000 + 25000`. | Result preview hiển thị `125000` hoặc giá trị tương đương trước khi áp dụng. |
| Áp dụng kết quả | Tap `Áp dụng`. | Bàn tính quay về mode nhập số; field tiền nhận raw value `125000` và hiển thị `125.000`. |
| Chia cho 0 | Nhập `100000 ÷ 0`. | Hiển thị lỗi `Không thể chia cho 0` hoặc bản dịch tương ứng; nút `Áp dụng` không áp dụng kết quả sai. |
| Expression invalid | Nhập biểu thức thiếu toán hạng, ví dụ `100000 +`. | Hiển thị lỗi `Phép tính không hợp lệ`; không thay đổi amount hiện tại khi chưa có kết quả hợp lệ. |

## Currency Và Format

| Case | Steps | Expected result |
| --- | --- | --- |
| VND | Nhập `125000`, hoặc áp dụng calculator ra `125000`. | Field hiển thị `125.000`; không có phần thập phân dư. |
| Currency có decimal | Trên form hỗ trợ đổi currency, chọn currency có `fractionDigits > 0` như USD/SGD/THB, rồi nhập hoặc áp dụng kết quả có decimal. | Field vẫn cho phép decimal theo currency; format dùng `vi-VN`, ví dụ dấu thập phân hiển thị bằng dấu phẩy. |
| Đổi currency nếu form hỗ trợ | Trong form ví, đổi currency rồi focus lại field tiền. | Prefix currency đổi đúng; format/fraction digits cập nhật theo currency mới; raw numeric string vẫn parse đúng khi lưu. |

## Scroll Và Layout Android

| Case | Steps | Expected result |
| --- | --- | --- |
| Scroll form khi keyboard mở | Trên form dài như ví, ngân sách hoặc khoản vay, focus field tiền ở gần cuối form. | Form tự có đủ padding bottom; người dùng scroll được tới field và action liên quan; keyboard không che field. |
| Bottom sheet/fullscreen Android | Mở các form trong `FormSheet`, focus field tiền. | Keyboard render trên `document.body`, không bị clip bởi sheet; sheet không kẹt scroll; sticky/header không đè field. |
| Chuyển sang input text thường | Đóng keyboard tiền, tap note/name/contact field. | Native Android keyboard mở bình thường; `useKeyboardSafeFocus` vẫn scroll text input vào vùng an toàn. |
| Date picker/numeric non-money | Tap ngày giao dịch, ngày đến hạn, ngày sao kê, số ngày nhắc trước. | Không mở money keyboard; dùng DateTimePicker hoặc native numeric keyboard đúng loại field. |

## Pass Criteria

- Tất cả field tiền quan trọng mở bàn phím tiền custom, không bật native Android keyboard chồng lên.
- Nhập số, `000`, xóa, `Xong`, `Bàn tính`, `Áp dụng`, lỗi chia 0 và lỗi expression invalid hoạt động đúng.
- VND không hiển thị decimal dư; currency có fraction digits vẫn hỗ trợ decimal.
- Form/sheet scroll được khi keyboard mở và không để lại layout state sau khi đóng.
- Input text/note/date/numeric không phải tiền không bị ảnh hưởng.
