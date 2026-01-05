# Hướng dẫn sử dụng Admin Strapi - Sơn Hằng Travel

## 🔗 Truy cập Admin Panel
- URL: http://localhost:1337/admin
- Đăng nhập với tài khoản admin đã tạo

---

## 📁 Cấu trúc Content Types

### 1. **Danh mục Tour** (Category)
Phân loại tour theo chủ đề:
- Tên danh mục (name)
- Slug (tự động từ tên)
- Mô tả (description)
- Icon (emoji hoặc text)
- Ảnh đại diện (image)
- Thứ tự hiển thị (order)

**Ví dụ danh mục:**
- Tour 1 ngày (icon: 🌅)
- Tour nhiều ngày (icon: 🗓️)
- Tour Quảng Đông (icon: 🏙️)
- Tour Quảng Tây (icon: 🏔️)
- Tour mua sắm (icon: 🛍️)

### 2. **Tour Du Lịch** (Tour)
Thông tin đầy đủ của 1 tour:

#### Thông tin cơ bản:
- **Tiêu đề** (title): Tên tour đầy đủ
- **Slug**: URL thân thiện (tự động tạo)
- **Mô tả ngắn** (shortDescription): Hiển thị trên card
- **Nội dung** (content): Mô tả chi tiết (rich text)
- **Danh mục** (category): Chọn từ danh mục đã tạo

#### Thông tin giá:
- **Giá** (price): Giá bán (VND)
- **Giá gốc** (originalPrice): Giá trước giảm (nếu có)

#### Thông tin tour:
- **Thời gian** (duration): VD: "1 ngày", "2N1Đ", "5N4Đ"
- **Điểm khởi hành** (departure): VD: "Móng Cái"
- **Điểm đến** (destination): VD: "Đông Hưng"
- **Phương tiện** (transportation): VD: "Xe du lịch"
- **Quy mô đoàn** (groupSize): VD: "4-15 khách"

#### Hình ảnh:
- **Ảnh đại diện** (thumbnail): Ảnh chính hiển thị trên card
- **Gallery** (gallery): Nhiều ảnh cho slideshow

#### Lịch trình (itinerary):
Thêm từng điểm trong lịch trình:
- Thời gian (time): VD: "07:00"
- Tiêu đề (title): VD: "Tập trung tại cửa khẩu"
- Mô tả (description): Chi tiết hoạt động
- Hình ảnh (image): Ảnh minh họa

#### Dịch vụ:
- **Bao gồm** (includes): Những gì có trong tour
- **Không bao gồm** (excludes): Những gì không có
- **Lưu ý** (notes): Thông tin quan trọng

#### Ngày khởi hành (departureDates):
- Ngày (date)
- Giá riêng (nếu khác giá mặc định)
- Số chỗ còn trống
- Trạng thái (available/almost_full/full)

#### Thông tin thêm:
- **Nổi bật** (featured): Checkbox hiển thị tour hot
- **Đánh giá** (rating): Điểm 1-5
- **Số lượt đánh giá** (reviewCount)
- **Số lượt đặt** (bookingCount)

#### SEO:
- Meta title
- Meta description
- Meta image
- Keywords

---

## 🔐 Cấu hình Permissions (Quan trọng!)

### Bước 1: Vào Settings
1. Click vào **Settings** (⚙️) ở sidebar trái
2. Chọn **Roles** trong phần "Users & Permissions plugin"

### Bước 2: Cấu hình Public Role
1. Click vào **Public**
2. Tìm đến phần **Permissions**:

   **Category:**
   - ✅ find
   - ✅ findOne

   **Tour:**
   - ✅ find
   - ✅ findOne

3. Click **Save**

---

## 📸 Upload ảnh

### Bước 1: Vào Media Library
1. Click **Media Library** (🖼️) ở sidebar trái
2. Click **Add new assets** hoặc kéo thả ảnh

### Bước 2: Tối ưu ảnh
- **Ảnh thumbnail**: Khuyến nghị 600x400px
- **Ảnh gallery**: Khuyến nghị 1200x800px
- **Định dạng**: JPG hoặc WebP
- **Kích thước**: Dưới 2MB mỗi ảnh

### Bước 3: Gán ảnh cho Tour
1. Khi tạo/sửa Tour, click vào field ảnh
2. Chọn từ Media Library hoặc upload mới
3. Click **Finish**

---

## 📝 Tạo Tour mới

### Bước 1: Vào Content Manager
1. Click **Content Manager** ở sidebar
2. Chọn **Tour Du Lịch**
3. Click **Create new entry**

### Bước 2: Điền thông tin
1. Nhập **Tiêu đề**: "Tour Đông Hưng 1 Ngày"
2. **Slug** sẽ tự động tạo: "tour-dong-hung-1-ngay"
3. Nhập **Mô tả ngắn** (150-200 ký tự)
4. Nhập **Giá**: 780000
5. Chọn **Danh mục**
6. Upload **Ảnh đại diện**

### Bước 3: Thêm lịch trình
1. Cuộn xuống **Lịch trình**
2. Click **Add an entry**
3. Nhập: Thời gian, Tiêu đề, Mô tả
4. Lặp lại cho các điểm khác

### Bước 4: Thêm dịch vụ
1. **Bao gồm**: Click Add, nhập từng dòng
   - "Xe đưa đón khách sạn"
   - "HDV tiếng Việt"
   - "Bữa trưa"
   
2. **Không bao gồm**: 
   - "Visa (nếu không có thông hành)"
   - "Chi phí cá nhân"

### Bước 5: Publish
1. Click **Save** để lưu nháp
2. Click **Publish** để xuất bản

---

## 🔄 API Endpoints

Sau khi cấu hình permissions, các API sau sẽ hoạt động:

```
# Lấy danh sách tour
GET http://localhost:1337/api/tours?populate=*

# Lấy tour theo slug
GET http://localhost:1337/api/tours?filters[slug][$eq]=tour-dong-hung-1-ngay&populate=*

# Lấy tour nổi bật
GET http://localhost:1337/api/tours?filters[featured][$eq]=true&populate=*

# Lấy danh mục
GET http://localhost:1337/api/categories?populate=*

# Lấy tour theo danh mục
GET http://localhost:1337/api/tours?filters[category][slug][$eq]=tour-1-ngay&populate=*
```

---

## ✅ Checklist sau khi setup

- [ ] Tạo các danh mục tour
- [ ] Cấu hình permissions cho Public role
- [ ] Tạo ít nhất 3-5 tour mẫu
- [ ] Upload ảnh cho mỗi tour
- [ ] Test API: http://localhost:1337/api/tours?populate=*
- [ ] Kiểm tra frontend hiển thị đúng

---

## 🚀 Triển khai Production

Khi deploy lên server:

1. Đổi database từ SQLite sang PostgreSQL
2. Cấu hình media storage (Cloudinary, AWS S3, etc.)
3. Tạo API Token để bảo mật
4. Cập nhật NEXT_PUBLIC_STRAPI_URL trong frontend

---

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra Strapi console log
2. Kiểm tra Network tab trong browser DevTools
3. Đảm bảo permissions đã được cấu hình đúng
