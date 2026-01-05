// Cấu hình Strapi Admin Panel - Tiếng Việt
export default {
  config: {
    // Ngôn ngữ mặc định
    locales: ['vi', 'en'],
    
    // Tùy chỉnh translations
    translations: {
      vi: {
        'app.components.LeftMenu.navbrand.title': 'Sơn Hằng Travel',
        'app.components.LeftMenu.navbrand.workplace': 'Quản trị Tour',
        'Auth.form.welcome.title': 'Chào mừng đến Sơn Hằng Travel',
        'Auth.form.welcome.subtitle': 'Đăng nhập vào tài khoản của bạn',
        'HomePage.helmet.title': 'Trang chủ',
        'global.content-manager': 'Quản lý nội dung',
        'global.plugins': 'Plugins',
        'global.settings': 'Cài đặt',
        
        // Tour fields labels
        'title': 'Tên Tour',
        'slug': 'Đường dẫn SEO',
        'shortDescription': 'Mô tả ngắn',
        'content': 'Nội dung chi tiết',
        'price': 'Giá tour (VNĐ)',
        'originalPrice': 'Giá gốc (VNĐ)',
        'duration': 'Thời gian',
        'departure': 'Điểm khởi hành',
        'destination': 'Điểm đến',
        'transportation': 'Phương tiện',
        'groupSize': 'Số người/đoàn',
        'thumbnail': 'Ảnh đại diện',
        'gallery': 'Thư viện ảnh',
        'itinerary': 'Lịch trình',
        'includes': 'Bao gồm',
        'excludes': 'Không bao gồm',
        'notes': 'Lưu ý',
        'policy': 'Chính sách',
        'category': 'Danh mục',
        'featured': 'Tour nổi bật',
        'rating': 'Đánh giá',
        'reviewCount': 'Số lượt đánh giá',
        'bookingCount': 'Số lượt đặt',
        'departureDates': 'Ngày khởi hành',
        'seo': 'SEO',
        
        // Category fields
        'name': 'Tên',
        'description': 'Mô tả',
        'icon': 'Icon',
        'image': 'Hình ảnh',
        'tours': 'Danh sách tour',
        'order': 'Thứ tự hiển thị',
        
        // Itinerary
        'time': 'Thời gian',
        'text': 'Nội dung',
      },
    },
    
    // Tùy chỉnh theme
    theme: {
      light: {
        colors: {
          primary100: '#e6f9f5',
          primary200: '#b3ede3',
          primary500: '#00CBA9',
          primary600: '#00A88A',
          primary700: '#008F75',
          buttonPrimary500: '#00CBA9',
          buttonPrimary600: '#00A88A',
        },
      },
      dark: {
        colors: {
          primary100: '#1a3d36',
          primary200: '#2d5a50',
          primary500: '#00CBA9',
          primary600: '#00A88A',
          primary700: '#008F75',
          buttonPrimary500: '#00CBA9',
          buttonPrimary600: '#00A88A',
        },
      },
    },
    
    // Tùy chỉnh menu
    menu: {
      logo: undefined, // Có thể thay bằng logo công ty
    },
    
    // Tutorial videos - tắt
    tutorials: false,
    notifications: { releases: false },
  },
  
  bootstrap() {},
};
