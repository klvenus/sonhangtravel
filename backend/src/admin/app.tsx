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
        
        // Content-type translations cho Tour
        'content-manager.components.LeftMenu.collection-types': 'Loại nội dung',
        'content-manager.components.LeftMenu.single-types': 'Nội dung đơn',
        
        // Tour field labels - format đúng cho Strapi 5
        'content-type-builder.form.attribute.item.title': 'Tên Tour',
        
        // Buttons & Actions
        'app.components.Button.publish': 'Xuất bản',
        'app.components.Button.save': 'Lưu',
        'app.components.Button.cancel': 'Hủy',
        'app.components.Button.delete': 'Xóa',
        'app.components.Button.confirm': 'Xác nhận',
        
        // Common
        'global.back': 'Quay lại',
        'global.save': 'Lưu',
        'global.publish': 'Xuất bản',
        'global.delete': 'Xóa',
        'global.cancel': 'Hủy',
        'global.create': 'Tạo mới',
        
        // Draft & Publish
        'content-manager.containers.Edit.draft': 'Bản nháp',
        'content-manager.containers.Edit.published': 'Đã xuất bản',
        
        // Entry actions
        'content-manager.header.actions.publish': 'Xuất bản',
        'content-manager.header.actions.unpublish': 'Hủy xuất bản',
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
