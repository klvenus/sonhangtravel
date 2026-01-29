'use client';

import { useState } from 'react';
import { useZalo } from './ZaloProvider';
import { openZaloChatBooking, BookingInfo, shareToZalo } from '@/lib/zalo';

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
 * Khi click sẽ mở form và gửi thông tin đến Zalo OA
 */
export function ZaloBookingButton({ tour, className = '', children }: ZaloBookingButtonProps) {
  const { isMiniApp, user, oaId } = useZalo();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    date: '',
    guests: '2',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Vui lòng nhập họ tên');
      return;
    }
    
    if (!formData.phone.trim()) {
      alert('Vui lòng nhập số điện thoại');
      return;
    }

    const bookingInfo: BookingInfo = {
      tourName: tour.title,
      tourSlug: tour.slug,
      departureDate: formData.date,
      guests: formData.guests,
      customerName: formData.name,
      phone: formData.phone,
      notes: formData.notes
    };

    openZaloChatBooking(bookingInfo, oaId);
    setShowForm(false);
  };

  return (
    <>
      <button 
        onClick={() => setShowForm(true)}
        className={className || 'bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2'}
      >
        {children || (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.5 2C6.81 2 2.18 6.12 2.01 11.37c-.09 2.68.88 5.22 2.72 7.16.36.38.58.87.6 1.39l.19 3.15c.04.63.59 1.11 1.22 1.05l3.15-.31c.52-.05 1.03.11 1.45.43 1.51 1.14 3.36 1.76 5.32 1.76 5.52 0 10-4.48 10-10S18.02 2 12.5 2z"/>
            </svg>
            {isMiniApp ? 'Đặt qua Zalo' : 'Đặt tour ngay'}
          </>
        )}
      </button>

      {/* Booking Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-lg font-semibold">Đặt Tour</h3>
              <button 
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* Tour info */}
              <div className="bg-emerald-50 rounded-lg p-3">
                <p className="text-sm text-emerald-600 font-medium">Tour đã chọn:</p>
                <p className="font-semibold text-gray-800">{tour.title}</p>
                {tour.price && (
                  <p className="text-emerald-600 font-bold mt-1">
                    {new Intl.NumberFormat('vi-VN').format(tour.price)}đ
                  </p>
                )}
              </div>

              {/* Zalo user info */}
              {user && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm text-blue-600">Đăng nhập với Zalo:</p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nhập họ tên"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="0123 456 789"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày khởi hành dự kiến
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* Guests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số khách
                </label>
                <select
                  value={formData.guests}
                  onChange={(e) => setFormData({...formData, guests: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="1">1 người</option>
                  <option value="2">2 người</option>
                  <option value="3">3 người</option>
                  <option value="4">4 người</option>
                  <option value="5">5 người</option>
                  <option value="6+">6+ người</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Yêu cầu đặc biệt..."
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.5 2C6.81 2 2.18 6.12 2.01 11.37c-.09 2.68.88 5.22 2.72 7.16.36.38.58.87.6 1.39l.19 3.15c.04.63.59 1.11 1.22 1.05l3.15-.31c.52-.05 1.03.11 1.45.43 1.51 1.14 3.36 1.76 5.32 1.76 5.52 0 10-4.48 10-10S18.02 2 12.5 2z"/>
                </svg>
                {isMiniApp ? 'Gửi qua Zalo' : 'Gửi yêu cầu đặt tour'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
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
  const { isMiniApp } = useZalo();

  const handleShare = () => {
    shareToZalo({
      title: tour.title,
      slug: tour.slug,
      shortDescription: tour.shortDescription,
      thumbnail: tour.thumbnail
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
