import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { categories, tours, siteSettings, adminUsers } from '../lib/schema';
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL!;
const sql = neon(DATABASE_URL);
const db = drizzle(sql);

async function seed() {
  console.log('Seeding database...');

  // 1. Admin user
  const passwordHash = await hash('sonhang2026', 10);
  await db.insert(adminUsers).values({ username: 'admin', passwordHash }).onConflictDoNothing();
  console.log('Admin user created');

  // 2. Categories
  const catData = [
    { name: 'Tour Đông Hưng', slug: 'tour-dong-hung', description: 'Tour du lịch Đông Hưng 1-2 ngày từ Móng Cái', icon: '🏮', order: 1 },
    { name: 'Tour Nam Ninh', slug: 'tour-nam-ninh', description: 'Tour Nam Ninh shopping, mua sắm', icon: '🛍️', order: 2 },
    { name: 'Tour Thượng Hải', slug: 'tour-thuong-hai', description: 'Tour Thượng Hải thành phố hiện đại', icon: '🌃', order: 3 },
    { name: 'Tour Quảng Châu', slug: 'tour-quang-chau', description: 'Tour Quảng Châu - Thâm Quyến', icon: '🏙️', order: 4 },
    { name: 'Tour Bắc Kinh', slug: 'tour-bac-kinh', description: 'Tour Bắc Kinh - Vạn Lý Trường Thành', icon: '🏯', order: 5 },
    { name: 'Tour Phượng Hoàng', slug: 'tour-phuong-hoang', description: 'Tour Phượng Hoàng Cổ Trấn', icon: '��️', order: 6 },
  ];

  const inserted = await db.insert(categories).values(catData).onConflictDoNothing().returning();
  console.log(`${inserted.length} categories created`);

  const catMap: Record<string, number> = {};
  if (inserted.length === 0) {
    for (const c of catData) {
      const r = await db.select().from(categories).where(eq(categories.slug, c.slug));
      if (r[0]) catMap[c.slug] = r[0].id;
    }
  } else {
    for (const c of inserted) catMap[c.slug] = c.id;
  }

  // 3. Tours
  const tourData = [
    {
      title: 'Tour Đông Hưng 2N1Đ - Khám phá thành phố biên giới',
      slug: 'tour-dong-hung-2-ngay-1-dem',
      shortDescription: 'Khám phá Đông Hưng - điểm du lịch mua sắm nổi tiếng. Tour 2 ngày 1 đêm trọn gói visa, ăn ở, xe.',
      content: '<h2>Tour Đông Hưng 2 Ngày 1 Đêm</h2><p>Khám phá thành phố biên giới Đông Hưng với trải nghiệm mua sắm, ẩm thực đường phố và văn hóa Trung Quốc đặc sắc.</p>',
      price: 1990000, originalPrice: 2490000, duration: '2 ngày 1 đêm',
      departure: 'Móng Cái', destination: 'Đông Hưng', transportation: 'Xe du lịch', groupSize: '10-25 người',
      thumbnail: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80',
      categoryId: catMap['tour-dong-hung'], featured: true, rating: '4.8', reviewCount: 256, bookingCount: 1520,
      itinerary: JSON.stringify([
        { time: '07:00', title: 'Tập trung tại Móng Cái', description: 'Đón khách, làm thủ tục xuất cảnh' },
        { time: '09:00', title: 'Chợ Đông Hưng', description: 'Mua sắm tại chợ lớn nhất vùng biên' },
        { time: '12:00', title: 'Ăn trưa', description: 'Ẩm thực Trung Quốc đặc sắc' },
        { time: '14:00', title: 'Tham quan thành phố', description: 'Các điểm du lịch nổi tiếng Đông Hưng' },
        { time: '18:00', title: 'Ăn tối & phố đi bộ', description: 'Dạo phố đi bộ Đông Hưng về đêm' },
        { time: '08:00', title: 'Ngày 2 - Mua sắm tự do', description: 'Tự do mua sắm, tham quan' },
        { time: '15:00', title: 'Về Móng Cái', description: 'Làm thủ tục nhập cảnh, kết thúc tour' },
      ]),
      includes: JSON.stringify(['Xe du lịch đời mới', 'Khách sạn 3 sao', 'Bữa ăn theo chương trình', 'Visa cửa khẩu', 'HDV tiếng Việt', 'Bảo hiểm du lịch', 'Vé tham quan']),
      excludes: JSON.stringify(['Chi phí cá nhân', 'Đồ uống', 'Tip HDV & lái xe', 'Phụ thu phòng đơn']),
      notes: JSON.stringify(['CCCD còn hạn + 2 ảnh 4x6 nền trắng', 'Gửi giấy tờ trước 3 ngày', 'Trẻ em dưới 5 tuổi miễn phí']),
    },
    {
      title: 'Tour Nam Ninh - Quảng Châu 4N3Đ mua sắm',
      slug: 'tour-nam-ninh-quang-chau-4-ngay',
      shortDescription: 'Tour Nam Ninh Quảng Châu 4 ngày 3 đêm - Thiên đường mua sắm hàng hiệu.',
      content: '<h2>Tour Nam Ninh - Quảng Châu 4N3Đ</h2><p>Khám phá 2 thành phố lớn nhất miền Nam Trung Quốc.</p>',
      price: 5990000, originalPrice: 7490000, duration: '4 ngày 3 đêm',
      departure: 'Móng Cái', destination: 'Nam Ninh - Quảng Châu', transportation: 'Xe + Tàu cao tốc', groupSize: '15-30 người',
      thumbnail: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80',
      categoryId: catMap['tour-nam-ninh'], featured: true, rating: '4.9', reviewCount: 189, bookingCount: 980,
      itinerary: JSON.stringify([
        { time: '06:00', title: 'Ngày 1: Móng Cái - Nam Ninh', description: 'Xuất cảnh, di chuyển đến Nam Ninh' },
        { time: '14:00', title: 'Tham quan Nam Ninh', description: 'Thanh Tú Sơn, phố đi bộ' },
        { time: '08:00', title: 'Ngày 2: Nam Ninh - Quảng Châu', description: 'Tàu cao tốc đến Quảng Châu' },
        { time: '08:00', title: 'Ngày 3: Mua sắm Quảng Châu', description: 'Trung tâm thương mại lớn' },
        { time: '08:00', title: 'Ngày 4: Về Móng Cái', description: 'Mua sắm sáng, chiều về' },
      ]),
      includes: JSON.stringify(['Xe + tàu cao tốc', 'KS 4 sao', 'Bữa ăn', 'Visa', 'HDV', 'Bảo hiểm']),
      excludes: JSON.stringify(['Chi phí cá nhân', 'Đồ uống', 'Tip', 'Phụ thu phòng đơn']),
      notes: JSON.stringify(['CCCD + 2 ảnh 4x6', 'Cọc 50%']),
    },
    {
      title: 'Tour Thượng Hải - Hàng Châu 5N4Đ',
      slug: 'tour-thuong-hai-hang-chau-5-ngay',
      shortDescription: 'Khám phá Thượng Hải hiện đại và Hàng Châu cổ kính - Tây Hồ thơ mộng.',
      content: '<h2>Tour Thượng Hải - Hàng Châu 5N4Đ</h2><p>Thành phố hiện đại nhất Trung Quốc kết hợp Hàng Châu cổ kính.</p>',
      price: 12990000, originalPrice: null, duration: '5 ngày 4 đêm',
      departure: 'Hà Nội', destination: 'Thượng Hải', transportation: 'Máy bay + Xe', groupSize: '15-25 người',
      thumbnail: 'https://images.unsplash.com/photo-1537531383496-f4749b88b040?w=800&q=80',
      categoryId: catMap['tour-thuong-hai'], featured: true, rating: '4.7', reviewCount: 143, bookingCount: 650,
      itinerary: JSON.stringify([
        { time: '08:00', title: 'Ngày 1: Hà Nội - Thượng Hải', description: 'Bay đến Thượng Hải' },
        { time: '08:00', title: 'Ngày 2: Thượng Hải', description: 'Bến Thượng Hải, Tháp Minh Châu, phố Nam Kinh' },
        { time: '08:00', title: 'Ngày 3: Hàng Châu', description: 'Tây Hồ thơ mộng' },
        { time: '08:00', title: 'Ngày 4: Hàng Châu - Thượng Hải', description: 'Chùa Linh Ẩn, mua sắm' },
        { time: '08:00', title: 'Ngày 5: Về Hà Nội', description: 'Bay về' },
      ]),
      includes: JSON.stringify(['Vé máy bay', 'KS 4 sao', 'Bữa ăn', 'Visa', 'HDV', 'Bảo hiểm']),
      excludes: JSON.stringify(['Chi phí cá nhân', 'Hành lý quá cước', 'Tip']),
      notes: JSON.stringify(['Hộ chiếu còn hạn 6 tháng', 'Cọc 50%']),
    },
    {
      title: 'Tour Bắc Kinh - Vạn Lý Trường Thành 6N5Đ',
      slug: 'tour-bac-kinh-van-ly-truong-thanh',
      shortDescription: 'Chinh phục Vạn Lý Trường Thành, khám phá Tử Cấm Thành ngàn năm lịch sử.',
      content: '<h2>Tour Bắc Kinh 6N5Đ</h2><p>Chinh phục kỳ quan thế giới và thủ đô ngàn năm lịch sử.</p>',
      price: 15990000, originalPrice: 17990000, duration: '6 ngày 5 đêm',
      departure: 'Hà Nội', destination: 'Bắc Kinh', transportation: 'Máy bay + Xe', groupSize: '15-25 người',
      thumbnail: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80',
      categoryId: catMap['tour-bac-kinh'], featured: true, rating: '4.9', reviewCount: 312, bookingCount: 1850,
      itinerary: JSON.stringify([
        { time: '08:00', title: 'Ngày 1: Hà Nội - Bắc Kinh', description: 'Bay đến Bắc Kinh' },
        { time: '08:00', title: 'Ngày 2: Vạn Lý Trường Thành', description: 'Chinh phục đoạn Bát Đạt Lĩnh' },
        { time: '08:00', title: 'Ngày 3: Tử Cấm Thành', description: 'Tử Cấm Thành, Thiên An Môn' },
        { time: '08:00', title: 'Ngày 4: Di Hòa Viên', description: 'Di Hòa Viên, Thiên Đàn' },
        { time: '08:00', title: 'Ngày 5: Mua sắm', description: 'Phố Vương Phủ Tỉnh' },
        { time: '08:00', title: 'Ngày 6: Về Hà Nội', description: 'Bay về' },
      ]),
      includes: JSON.stringify(['Vé máy bay', 'KS 4 sao', 'Bữa ăn', 'Visa', 'HDV', 'Bảo hiểm', 'Vé tham quan']),
      excludes: JSON.stringify(['Chi phí cá nhân', 'Hành lý quá cước', 'Tip']),
      notes: JSON.stringify(['Hộ chiếu 6 tháng', 'Cọc 50%', 'Mang giày thoải mái']),
    },
    {
      title: 'Tour Quảng Châu - Thâm Quyến 3N2Đ',
      slug: 'tour-quang-chau-tham-quyen-3-ngay',
      shortDescription: 'Khám phá 2 siêu đô thị miền Nam Trung Quốc, công nghệ và mua sắm.',
      content: '<h2>Tour Quảng Châu - Thâm Quyến 3N2Đ</h2><p>Quảng Châu ẩm thực + Thâm Quyến công nghệ.</p>',
      price: 4490000, originalPrice: null, duration: '3 ngày 2 đêm',
      departure: 'Móng Cái', destination: 'Quảng Châu', transportation: 'Xe + Tàu cao tốc', groupSize: '15-30 người',
      thumbnail: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=800&q=80',
      categoryId: catMap['tour-quang-chau'], featured: true, rating: '4.6', reviewCount: 98, bookingCount: 560,
      itinerary: JSON.stringify([
        { time: '06:00', title: 'Ngày 1: Móng Cái - Quảng Châu', description: 'Xuất cảnh, đi Quảng Châu' },
        { time: '08:00', title: 'Ngày 2: Quảng Châu - Thâm Quyến', description: 'Tham quan + chiều đi Thâm Quyến' },
        { time: '08:00', title: 'Ngày 3: Về Móng Cái', description: 'Mua sắm, về Móng Cái' },
      ]),
      includes: JSON.stringify(['Xe du lịch', 'KS 3-4 sao', 'Bữa ăn', 'Visa', 'HDV', 'Bảo hiểm']),
      excludes: JSON.stringify(['Chi phí cá nhân', 'Đồ uống', 'Tip']),
      notes: JSON.stringify(['CCCD + 2 ảnh 4x6', 'Cọc 50%']),
    },
    {
      title: 'Tour Phượng Hoàng Cổ Trấn 5N4Đ',
      slug: 'tour-phuong-hoang-co-tran',
      shortDescription: 'Phượng Hoàng Cổ Trấn - cổ trấn đẹp nhất Trung Quốc bên dòng Đà Giang.',
      content: '<h2>Tour Phượng Hoàng Cổ Trấn 5N4Đ</h2><p>Cổ trấn đẹp nhất Trung Quốc, kiến trúc cổ kính bên Đà Giang.</p>',
      price: 11990000, originalPrice: 13990000, duration: '5 ngày 4 đêm',
      departure: 'Hà Nội', destination: 'Hồ Nam', transportation: 'Máy bay + Xe', groupSize: '15-25 người',
      thumbnail: 'https://images.unsplash.com/photo-1591017403286-fd8493524e1e?w=800&q=80',
      categoryId: catMap['tour-phuong-hoang'], featured: true, rating: '4.8', reviewCount: 178, bookingCount: 890,
      itinerary: JSON.stringify([
        { time: '08:00', title: 'Ngày 1: Hà Nội - Trương Gia Giới', description: 'Bay đến Trương Gia Giới' },
        { time: '08:00', title: 'Ngày 2: Trương Gia Giới', description: 'Công viên Quốc gia - Avatar Mountain' },
        { time: '08:00', title: 'Ngày 3: Cầu kính', description: 'Cầu kính Trương Gia Giới, Thiên Môn Sơn' },
        { time: '08:00', title: 'Ngày 4: Phượng Hoàng Cổ Trấn', description: 'Dạo phố cổ' },
        { time: '08:00', title: 'Ngày 5: Về Hà Nội', description: 'Bay về' },
      ]),
      includes: JSON.stringify(['Vé máy bay', 'KS 4 sao', 'Bữa ăn', 'Visa', 'HDV', 'Bảo hiểm', 'Vé tham quan']),
      excludes: JSON.stringify(['Chi phí cá nhân', 'Hành lý quá cước', 'Tip']),
      notes: JSON.stringify(['Hộ chiếu 6 tháng', 'Giày thể thao', 'Cọc 50%']),
    },
  ];

  for (const t of tourData) {
    await db.insert(tours).values(t).onConflictDoNothing();
  }
  console.log(`${tourData.length} tours created`);

  // 4. Site settings
  await db.insert(siteSettings).values({
    siteName: 'Sơn Hằng Travel',
    phoneNumber: '0338239888',
    zaloNumber: '0388091993',
    email: 'Lienhe@sonhangtravel.com',
    address: 'Khu 5 - Phường Móng Cái - Quảng Ninh',
    bannerSlides: JSON.stringify([{
      image: 'https://res.cloudinary.com/dzxntgoko/image/upload/v1772779153/large_Web_2250c7f598.png',
      title: 'Tour Du Lịch Trung Quốc',
      subtitle: 'Giá tốt nhất - Dịch vụ chất lượng',
      linkUrl: '/tours',
      linkText: 'Xem tour ngay',
    }]),
  }).onConflictDoNothing();
  console.log('Site settings created');

  console.log('\nDone!');
}

seed().catch(console.error);
