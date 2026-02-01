'use client';

import { useZalo } from './ZaloProvider';

interface Tour {
  id: number;
  title: string;
  slug: string;
  shortDescription?: string;
  thumbnail?: string;
  price?: number;
}

interface ZaloBookingButtonProps {
  tour: Tour;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Nút đặt tour qua Zalo
 * Khi click sẽ mở thẳng chat với Zalo OA
 */
export function ZaloBookingButton({ tour, className = '', children }: ZaloBookingButtonProps) {
  const { oaId } = useZalo();

  const handleClick = () => {
    // Tạo message đặt tour
    const message = `Xin chào, tôi muốn đặt tour: ${tour.title}`;
    
    // Mở Zalo OA chat
    const zaloUrl = `https://zalo.me/${oaId}?text=${encodeURIComponent(message)}`;
    window.open(zaloUrl, '_blank');
  };

  return (
    <button 
      onClick={handleClick}
      className={className || 'bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2'}
    >
      {children || (
        <>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.5 2C6.81 2 2.18 6.12 2.01 11.37c-.09 2.68.88 5.22 2.72 7.16.36.38.58.87.6 1.39l.19 3.15c.04.63.59 1.11 1.22 1.05l3.15-.31c.52-.05 1.03.11 1.45.43 1.51 1.14 3.36 1.76 5.32 1.76 5.52 0 10-4.48 10-10S18.02 2 12.5 2z"/>
          </svg>
          Đặt tour ngay
        </>
      )}
    </button>
  );
}

/**
 * Nút chia sẻ tour lên Zalo
 */
interface ZaloShareButtonProps {
  tour: Tour;
  className?: string;
}

export function ZaloShareButton({ tour, className = '' }: ZaloShareButtonProps) {
  const handleShare = () => {
    // Tạo URL chia sẻ
    const shareUrl = `${window.location.origin}/tour/${tour.slug}`;
    const shareText = `${tour.title} - ${tour.shortDescription || 'Tour du lịch hấp dẫn'}`;
    
    // Copy link và thông báo
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`).then(() => {
      alert('Đã copy link tour! Bạn có thể dán vào Zalo để chia sẻ.');
    }).catch(() => {
      // Fallback: mở Zalo với text
      window.open(`https://zalo.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`, '_blank');
    });
  };

  return (
    <button
      onClick={handleShare}
      className={className || 'p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600'}
      title="Chia sẻ"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    </button>
  );
}
