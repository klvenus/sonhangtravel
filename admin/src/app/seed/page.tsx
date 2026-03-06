'use client';

import { useState } from 'react';

export default function SeedPage() {
  const [log, setLog] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  function addLog(msg: string) {
    setLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  }

  async function seedCategories() {
    setRunning(true);
    addLog('🌱 Bắt đầu seed danh mục...');
    const categories = [
      { name: 'Tour Đông Hưng', slug: 'tour-dong-hung', icon: '🏮', description: 'Tour khám phá thành phố Đông Hưng, Trung Quốc', order: 1 },
      { name: 'Tour Phòng Thành Cảng', slug: 'tour-phong-thanh-cang', icon: '⛩️', description: 'Tour tham quan Phòng Thành Cảng, Trung Quốc', order: 2 },
      { name: 'Tour Nam Ninh', slug: 'tour-nam-ninh', icon: '🌆', description: 'Tour khám phá Nam Ninh, thủ phủ Quảng Tây', order: 3 },
      { name: 'Tour Bằng Tường', slug: 'tour-bang-tuong', icon: '🏯', description: 'Tour tham quan Bằng Tường, Trung Quốc', order: 4 },
      { name: 'Tour Quảng Châu', slug: 'tour-quang-chau', icon: '🌃', description: 'Tour khám phá Quảng Châu, đô thị sầm uất', order: 5 },
      { name: 'Tour Hạ Long - Móng Cái', slug: 'tour-ha-long-mong-cai', icon: '🌊', description: 'Tour du lịch Hạ Long và Móng Cái', order: 6 },
    ];

    for (const cat of categories) {
      try {
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cat),
        });
        if (res.ok) addLog(`✅ Tạo danh mục: ${cat.name}`);
        else {
          const err = await res.json().catch(() => ({}));
          addLog(`⚠️ ${cat.name}: ${err.error || 'Lỗi'}`);
        }
      } catch { addLog(`❌ Lỗi kết nối khi tạo ${cat.name}`); }
    }
    addLog('🏁 Xong seed danh mục!');
    setRunning(false);
  }

  async function seedSampleTour() {
    setRunning(true);
    addLog('🌱 Tạo tour mẫu...');

    const tour = {
      title: 'Tour Đông Hưng 1 ngày - Khám phá thành phố biên giới',
      slug: 'tour-dong-hung-1-ngay',
      shortDescription: 'Khám phá thành phố Đông Hưng, Trung Quốc trong 1 ngày. Tham quan chợ biên giới, khu phố cổ, thưởng thức ẩm thực đặc sản.',
      content: '<h2>Tour Đông Hưng 1 ngày</h2><p>Hành trình khám phá thành phố biên giới Đông Hưng với nhiều trải nghiệm thú vị. Bạn sẽ được tham quan các điểm nổi bật, mua sắm tại chợ biên giới và thưởng thức ẩm thực địa phương.</p>',
      price: 800000,
      originalPrice: 1000000,
      duration: '1 ngày',
      departure: 'Móng Cái',
      destination: 'Đông Hưng, Trung Quốc',
      transportation: 'Xe du lịch',
      groupSize: '15-25 người',
      thumbnail: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800',
      gallery: [
        'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800',
        'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800',
      ],
      itinerary: [
        { time: '06:00', title: 'Tập trung xuất phát', description: 'Tập trung tại cửa khẩu Móng Cái, làm thủ tục xuất cảnh.' },
        { time: '08:00', title: 'Tham quan chợ Đông Hưng', description: 'Khám phá chợ biên giới nổi tiếng với hàng ngàn mặt hàng.' },
        { time: '11:30', title: 'Ăn trưa', description: 'Thưởng thức ẩm thực Trung Hoa tại nhà hàng địa phương.' },
        { time: '13:30', title: 'Tham quan khu phố cổ', description: 'Dạo quanh khu phố cổ Đông Hưng, chụp ảnh lưu niệm.' },
        { time: '16:00', title: 'Về Móng Cái', description: 'Làm thủ tục nhập cảnh, trở về Móng Cái. Kết thúc tour.' },
      ],
      includes: ['Xe du lịch đời mới', 'Hướng dẫn viên tiếng Trung', 'Bữa trưa', 'Phí cửa khẩu', 'Bảo hiểm du lịch'],
      excludes: ['Chi phí cá nhân', 'Đồ uống', 'Tip cho HDV'],
      notes: ['Mang theo hộ chiếu còn hạn trên 6 tháng', 'Chuẩn bị tiền Nhân dân tệ để mua sắm', 'Mặc trang phục thoải mái, giày đi bộ'],
      categoryId: 1,
      featured: true,
      published: true,
      rating: '4.8',
      reviewCount: 156,
      bookingCount: 1200,
      departureDates: [],
      policy: 'Hủy trước 3 ngày: hoàn 100%. Hủy trước 1 ngày: hoàn 50%. Hủy trong ngày: không hoàn tiền.',
    };

    try {
      const res = await fetch('/api/tours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tour),
      });
      if (res.ok) addLog('✅ Tạo tour mẫu thành công!');
      else {
        const err = await res.json().catch(() => ({}));
        addLog(`⚠️ ${err.error || 'Lỗi'}`);
      }
    } catch { addLog('❌ Lỗi kết nối'); }
    setRunning(false);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">🌱 Seed dữ liệu</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border rounded-xl p-6 space-y-3">
          <h3 className="font-semibold text-gray-700">📁 Seed danh mục</h3>
          <p className="text-sm text-gray-500">Tạo 6 danh mục mặc định: Đông Hưng, Phòng Thành Cảng, Nam Ninh, Bằng Tường, Quảng Châu, Hạ Long - Móng Cái</p>
          <button onClick={seedCategories} disabled={running}
            className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
            {running ? '⏳ Đang chạy...' : '🌱 Seed danh mục'}
          </button>
        </div>

        <div className="bg-white border rounded-xl p-6 space-y-3">
          <h3 className="font-semibold text-gray-700">🗺️ Tạo tour mẫu</h3>
          <p className="text-sm text-gray-500">Tạo 1 tour mẫu &ldquo;Tour Đông Hưng 1 ngày&rdquo; với đầy đủ thông tin để test giao diện.</p>
          <button onClick={seedSampleTour} disabled={running}
            className="w-full py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50">
            {running ? '⏳ Đang chạy...' : '🗺️ Tạo tour mẫu'}
          </button>
        </div>
      </div>

      {log.length > 0 && (
        <div className="bg-gray-900 text-green-400 rounded-xl p-4 font-mono text-sm max-h-80 overflow-y-auto">
          {log.map((line, i) => <div key={i}>{line}</div>)}
        </div>
      )}
    </div>
  );
}
