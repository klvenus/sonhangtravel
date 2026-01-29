/**
 * Zalo Mini App SDK Integration
 * Phát hiện và tích hợp các tính năng Zalo khi chạy trong Mini App
 */

// Kiểm tra xem có đang chạy trong Zalo Mini App không
export function isZaloMiniApp(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Kiểm tra user agent
  const ua = navigator.userAgent.toLowerCase();
  const isZalo = ua.includes('zalo') || ua.includes('zmp');
  
  // Kiểm tra Zalo SDK
  const hasZaloSDK = typeof (window as any).zmp !== 'undefined' || 
                     typeof (window as any).ZaloPay !== 'undefined';
  
  return isZalo || hasZaloSDK;
}

// Zalo SDK interface
interface ZaloUserInfo {
  id: string;
  name: string;
  avatar: string;
}

interface ZaloSDK {
  getUserInfo: (options: {
    success: (data: { userInfo: ZaloUserInfo }) => void;
    fail: (error: any) => void;
  }) => void;
  getPhoneNumber: (options: {
    success: (data: { number: string }) => void;
    fail: (error: any) => void;
  }) => void;
  openChat: (options: {
    type: 'oa' | 'user';
    id: string;
    message?: string;
    success?: () => void;
    fail?: (error: any) => void;
  }) => void;
  share: (options: {
    type: 'link' | 'image';
    data: {
      link?: string;
      title?: string;
      description?: string;
      thumb?: string;
    };
    success?: () => void;
    fail?: (error: any) => void;
  }) => void;
  openWebview: (options: {
    url: string;
    success?: () => void;
    fail?: (error: any) => void;
  }) => void;
  closeApp: () => void;
}

// Lấy Zalo SDK instance
function getZaloSDK(): ZaloSDK | null {
  if (typeof window === 'undefined') return null;
  return (window as any).zmp || null;
}

/**
 * Lấy thông tin user đang đăng nhập Zalo
 */
export function getZaloUserInfo(): Promise<ZaloUserInfo | null> {
  return new Promise((resolve) => {
    const sdk = getZaloSDK();
    if (!sdk || !sdk.getUserInfo) {
      resolve(null);
      return;
    }
    
    sdk.getUserInfo({
      success: (data) => {
        console.log('[Zalo] User info:', data.userInfo);
        resolve(data.userInfo);
      },
      fail: (error) => {
        console.error('[Zalo] Get user info failed:', error);
        resolve(null);
      }
    });
  });
}

/**
 * Lấy số điện thoại (cần user cho phép)
 */
export function getZaloPhoneNumber(): Promise<string | null> {
  return new Promise((resolve) => {
    const sdk = getZaloSDK();
    if (!sdk || !sdk.getPhoneNumber) {
      resolve(null);
      return;
    }
    
    sdk.getPhoneNumber({
      success: (data) => {
        console.log('[Zalo] Phone:', data.number);
        resolve(data.number);
      },
      fail: (error) => {
        console.error('[Zalo] Get phone failed:', error);
        resolve(null);
      }
    });
  });
}

/**
 * Booking info để gửi qua Zalo OA
 */
export interface BookingInfo {
  tourName: string;
  tourSlug?: string;
  departureDate?: string;
  guests?: number | string;
  customerName: string;
  phone: string;
  notes?: string;
}

/**
 * Mở chat với Zalo OA và gửi thông tin đặt tour
 * @param bookingInfo - Thông tin đặt tour
 * @param oaId - Zalo OA ID hoặc số điện thoại
 */
export function openZaloChatBooking(bookingInfo: BookingInfo, oaId?: string): void {
  const message = `🌏 YÊU CẦU ĐẶT TOUR

📌 Tour: ${bookingInfo.tourName}
📅 Ngày đi: ${bookingInfo.departureDate || 'Chưa chọn'}
👥 Số khách: ${bookingInfo.guests || 1} người
👤 Họ tên: ${bookingInfo.customerName}
📞 SĐT: ${bookingInfo.phone}
${bookingInfo.notes ? `📝 Ghi chú: ${bookingInfo.notes}` : ''}

Vui lòng xác nhận và tư vấn thêm cho tôi!`;

  const sdk = getZaloSDK();
  
  if (sdk && sdk.openChat && oaId) {
    // Đang trong Zalo Mini App - mở chat native
    sdk.openChat({
      type: 'oa',
      id: oaId,
      message: message,
      success: () => {
        console.log('[Zalo] Opened OA chat');
      },
      fail: (error) => {
        console.error('[Zalo] Open chat failed:', error);
        // Fallback: mở zalo.me
        fallbackBookingAlert(message, oaId);
      }
    });
  } else {
    // Không trong Zalo Mini App - mở zalo.me link
    fallbackBookingAlert(message, oaId);
  }
}

function fallbackBookingAlert(message: string, zaloLink?: string): void {
  // Trên web thường: mở Zalo.me link
  if (zaloLink) {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://zalo.me/${zaloLink}?text=${encodedMessage}`, '_blank');
  } else {
    // Nếu không có zaloLink, copy và alert
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message);
    }
    alert(`Đặt tour thành công! 🎉\n\nChúng tôi sẽ liên hệ bạn sớm nhất.`);
  }
}

/**
 * Chia sẻ tour lên Zalo
 */
export function shareToZalo(tour: {
  title: string;
  slug: string;
  shortDescription?: string;
  thumbnail?: string;
}): void {
  const sdk = getZaloSDK();
  const shareUrl = `https://sonhangtravel.vercel.app/tour/${tour.slug}`;
  
  if (sdk && sdk.share) {
    sdk.share({
      type: 'link',
      data: {
        link: shareUrl,
        title: tour.title,
        description: tour.shortDescription || 'Tour du lịch Trung Quốc chất lượng cao',
        thumb: tour.thumbnail
      },
      success: () => {
        console.log('[Zalo] Shared tour');
      },
      fail: (error) => {
        console.error('[Zalo] Share failed:', error);
        // Fallback: Web Share API
        fallbackShare(tour.title, shareUrl);
      }
    });
  } else {
    // Fallback: Web Share API hoặc copy link
    fallbackShare(tour.title, shareUrl);
  }
}

function fallbackShare(title: string, url: string): void {
  if (navigator.share) {
    navigator.share({
      title: title,
      url: url
    });
  } else {
    // Copy link
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      alert('Đã copy link tour!');
    }
  }
}

/**
 * Hook để sử dụng Zalo features trong React components
 */
export function useZaloMiniApp() {
  const isMiniApp = isZaloMiniApp();
  
  return {
    isMiniApp,
    getUserInfo: getZaloUserInfo,
    getPhoneNumber: getZaloPhoneNumber,
    openChatBooking: openZaloChatBooking,
    shareToZalo: shareToZalo,
  };
}
