import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import { db } from './db.js';
import { tours, categories } from './schema.js';
import { eq, desc, asc } from 'drizzle-orm';
import { revalidateProduction } from './revalidate.js';
import { uploadToCloudinary } from './cloudinary.js';

// ─── Config ───
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const SITE_URL = process.env.VERCEL_SITE_URL || 'https://sonhangtravel.vercel.app';

if (!BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN is required');
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
console.log('🤖 Sơn Hằng Travel Bot đang chạy...');

// ─── Helpers ───
function slugify(text: string): string {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Session state for multi-step tour creation
interface TourDraft {
  step: string;
  title?: string;
  slug?: string;
  price?: number;
  originalPrice?: number | null;
  duration?: string;
  departure?: string;
  destination?: string;
  transportation?: string;
  groupSize?: string;
  shortDescription?: string;
  content?: string;
  thumbnail?: string;
  gallery?: string[];
  itinerary?: { time?: string; title: string; description?: string }[];
  includes?: string[];
  excludes?: string[];
  notes?: string[];
  categoryId?: number | null;
  featured?: boolean;
  published?: boolean;
}

const sessions = new Map<number, TourDraft>();

// ─── /start ───
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId,
    `🏝️ <b>Sơn Hằng Travel Bot</b>\n\n` +
    `Xin chào! Bot quản lý tours cho sonhangtravel.com\n\n` +
    `📋 <b>Lệnh quản lý:</b>\n` +
    `/tours — Danh sách tours\n` +
    `/tour_info [id] — Chi tiết tour\n` +
    `/new_tour — Tạo tour mới (từng bước)\n` +
    `/quick_tour — Tạo tour nhanh (1 tin nhắn)\n` +
    `/delete_tour [id] — Xóa tour\n` +
    `/toggle_featured [id] — Bật/tắt nổi bật\n` +
    `/toggle_published [id] — Bật/tắt công khai\n\n` +
    `📁 <b>Danh mục:</b>\n` +
    `/categories — Danh sách danh mục\n` +
    `/new_category [tên] — Tạo danh mục\n\n` +
    `🔧 <b>Khác:</b>\n` +
    `/stats — Thống kê\n` +
    `/revalidate — Cập nhật lại website\n` +
    `/cancel — Hủy thao tác đang thực hiện\n\n` +
    `🌐 Website: ${SITE_URL}`,
    { parse_mode: 'HTML' }
  );
});

// ─── /help ───
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id,
    `📖 <b>Hướng dẫn tạo tour nhanh</b>\n\n` +
    `Gửi lệnh /quick_tour rồi nhập theo format:\n\n` +
    `<code>Tiêu đề: Tour Đông Hưng 2N1Đ\n` +
    `Giá: 1500000\n` +
    `Thời gian: 2 ngày 1 đêm\n` +
    `Điểm đến: Đông Hưng, Trung Quốc\n` +
    `Khởi hành: Móng Cái\n` +
    `Phương tiện: Xe du lịch\n` +
    `Số người: 15-25 người\n` +
    `Mô tả: Khám phá thành phố Đông Hưng...</code>\n\n` +
    `Hoặc dùng /new_tour để tạo từng bước.\n\n` +
    `💡 <b>Gửi ảnh</b> kèm caption <code>/upload</code> để upload ảnh lên Cloudinary.`,
    { parse_mode: 'HTML' }
  );
});

// ─── /stats ───
bot.onText(/\/stats/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    const allTours = await db.select().from(tours);
    const allCats = await db.select().from(categories);
    const published = allTours.filter(t => t.published);
    const featured = allTours.filter(t => t.featured);

    bot.sendMessage(chatId,
      `📊 <b>Thống kê Sơn Hằng Travel</b>\n\n` +
      `🗺️ Tổng tours: <b>${allTours.length}</b>\n` +
      `✅ Đang công khai: <b>${published.length}</b>\n` +
      `⭐ Nổi bật: <b>${featured.length}</b>\n` +
      `📁 Danh mục: <b>${allCats.length}</b>\n\n` +
      `🌐 ${SITE_URL}`,
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    bot.sendMessage(chatId, `❌ Lỗi: ${error}`);
  }
});

// ─── /tours ───
bot.onText(/\/tours/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    const data = await db.select({
      id: tours.id,
      title: tours.title,
      slug: tours.slug,
      price: tours.price,
      duration: tours.duration,
      destination: tours.destination,
      featured: tours.featured,
      published: tours.published,
    }).from(tours).orderBy(desc(tours.createdAt));

    if (data.length === 0) {
      bot.sendMessage(chatId, '📭 Chưa có tour nào. Dùng /new_tour để tạo.');
      return;
    }

    let text = `🗺️ <b>Danh sách Tours (${data.length})</b>\n\n`;
    for (const t of data) {
      const status = [
        t.published ? '✅' : '🔒',
        t.featured ? '⭐' : '',
      ].filter(Boolean).join('');
      text += `${status} <b>#${t.id}</b> ${escapeHtml(t.title)}\n`;
      text += `   💰 ${formatPrice(t.price)} · ${t.duration || '—'} · ${escapeHtml(t.destination || '—')}\n`;
      text += `   🔗 ${SITE_URL}/tour/${t.slug}\n\n`;
    }
    text += `💡 /tour_info [id] để xem chi tiết`;

    bot.sendMessage(chatId, text, { parse_mode: 'HTML', disable_web_page_preview: true });
  } catch (error) {
    bot.sendMessage(chatId, `❌ Lỗi: ${error}`);
  }
});

// ─── /tour_info [id] ───
bot.onText(/\/tour_info(?:\s+(\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const id = match?.[1] ? Number(match[1]) : null;
  if (!id) {
    bot.sendMessage(chatId, '⚠️ Dùng: /tour_info [id]\nVí dụ: /tour_info 11');
    return;
  }
  try {
    const [tour] = await db.select().from(tours).where(eq(tours.id, id)).limit(1);
    if (!tour) {
      bot.sendMessage(chatId, `❌ Không tìm thấy tour #${id}`);
      return;
    }

    const gallery = (tour.gallery as string[]) || [];
    const itinerary = (tour.itinerary as { time?: string; title: string; description?: string }[]) || [];
    const incl = (tour.includes as string[]) || [];
    const excl = (tour.excludes as string[]) || [];

    let text = `🗺️ <b>${escapeHtml(tour.title)}</b>\n\n`;
    text += `🆔 ID: ${tour.id}\n`;
    text += `🔗 Slug: ${tour.slug}\n`;
    text += `💰 Giá: <b>${formatPrice(tour.price)}</b>`;
    if (tour.originalPrice) text += ` (gốc: ${formatPrice(tour.originalPrice)})`;
    text += `\n`;
    text += `⏱️ Thời gian: ${tour.duration || '—'}\n`;
    text += `📍 Khởi hành: ${tour.departure || '—'}\n`;
    text += `🎯 Điểm đến: ${tour.destination || '—'}\n`;
    text += `🚌 Phương tiện: ${tour.transportation || '—'}\n`;
    text += `👥 Số người: ${tour.groupSize || '—'}\n`;
    text += `${tour.published ? '✅ Công khai' : '🔒 Ẩn'} · ${tour.featured ? '⭐ Nổi bật' : '— Thường'}\n`;
    text += `⭐ ${tour.rating}/5 · ${tour.reviewCount} đánh giá · ${tour.bookingCount} lượt đặt\n`;
    text += `🖼️ Gallery: ${gallery.length} ảnh\n`;

    if (tour.shortDescription) {
      text += `\n📝 <i>${escapeHtml(tour.shortDescription)}</i>\n`;
    }

    if (itinerary.length > 0) {
      text += `\n🗓️ <b>Lịch trình (${itinerary.length} mục):</b>\n`;
      for (const item of itinerary) {
        text += `  • ${item.time ? item.time + ' — ' : ''}${escapeHtml(item.title)}\n`;
      }
    }

    if (incl.length > 0) {
      text += `\n✅ <b>Bao gồm:</b> ${incl.map(i => escapeHtml(i)).join(', ')}\n`;
    }
    if (excl.length > 0) {
      text += `\n❌ <b>Không bao gồm:</b> ${excl.map(i => escapeHtml(i)).join(', ')}\n`;
    }

    text += `\n🌐 ${SITE_URL}/tour/${tour.slug}`;

    if (tour.thumbnail) {
      bot.sendPhoto(chatId, tour.thumbnail, {
        caption: text,
        parse_mode: 'HTML',
      });
    } else {
      bot.sendMessage(chatId, text, { parse_mode: 'HTML', disable_web_page_preview: true });
    }
  } catch (error) {
    bot.sendMessage(chatId, `❌ Lỗi: ${error}`);
  }
});

// ─── /categories ───
bot.onText(/\/categories/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    const data = await db.select().from(categories).orderBy(asc(categories.order));
    if (data.length === 0) {
      bot.sendMessage(chatId, '📭 Chưa có danh mục. Dùng /new_category [tên] để tạo.');
      return;
    }

    let text = `📁 <b>Danh mục (${data.length})</b>\n\n`;
    for (const c of data) {
      text += `${c.icon || '📁'} <b>#${c.id}</b> ${escapeHtml(c.name)} (${c.slug})\n`;
      if (c.description) text += `   ${escapeHtml(c.description)}\n`;
    }

    bot.sendMessage(chatId, text, { parse_mode: 'HTML' });
  } catch (error) {
    bot.sendMessage(chatId, `❌ Lỗi: ${error}`);
  }
});

// ─── /new_category [name] ───
bot.onText(/\/new_category(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const name = match?.[1]?.trim();
  if (!name) {
    bot.sendMessage(chatId, '⚠️ Dùng: /new_category Tên danh mục\nVí dụ: /new_category Tour Đông Hưng');
    return;
  }
  try {
    const slug = slugify(name);
    const [newCat] = await db.insert(categories).values({
      name, slug, icon: '🌏', order: 0,
    }).returning();
    bot.sendMessage(chatId,
      `✅ Tạo danh mục thành công!\n\n` +
      `${newCat.icon} <b>${escapeHtml(newCat.name)}</b>\n` +
      `🔗 Slug: ${newCat.slug}\n` +
      `🆔 ID: ${newCat.id}`,
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    bot.sendMessage(chatId, `❌ Lỗi tạo danh mục: ${error}`);
  }
});

// ─── /delete_tour [id] ───
bot.onText(/\/delete_tour(?:\s+(\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const id = match?.[1] ? Number(match[1]) : null;
  if (!id) {
    bot.sendMessage(chatId, '⚠️ Dùng: /delete_tour [id]\nVí dụ: /delete_tour 11');
    return;
  }
  try {
    const [deleted] = await db.delete(tours).where(eq(tours.id, id)).returning();
    if (!deleted) {
      bot.sendMessage(chatId, `❌ Không tìm thấy tour #${id}`);
      return;
    }
    revalidateProduction([`/tour/${deleted.slug}`]);
    bot.sendMessage(chatId,
      `🗑️ Đã xóa tour <b>${escapeHtml(deleted.title)}</b> (#${id})\n` +
      `Website sẽ cập nhật trong vài giây.`,
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    bot.sendMessage(chatId, `❌ Lỗi: ${error}`);
  }
});

// ─── /toggle_featured [id] ───
bot.onText(/\/toggle_featured(?:\s+(\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const id = match?.[1] ? Number(match[1]) : null;
  if (!id) { bot.sendMessage(chatId, '⚠️ Dùng: /toggle_featured [id]'); return; }
  try {
    const [tour] = await db.select().from(tours).where(eq(tours.id, id)).limit(1);
    if (!tour) { bot.sendMessage(chatId, `❌ Không tìm thấy tour #${id}`); return; }
    const newVal = !tour.featured;
    await db.update(tours).set({ featured: newVal, updatedAt: new Date() }).where(eq(tours.id, id));
    revalidateProduction([`/tour/${tour.slug}`]);
    bot.sendMessage(chatId,
      `${newVal ? '⭐' : '💤'} Tour <b>${escapeHtml(tour.title)}</b> (#${id}): ${newVal ? 'Nổi bật ✅' : 'Thường ❌'}`,
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    bot.sendMessage(chatId, `❌ Lỗi: ${error}`);
  }
});

// ─── /toggle_published [id] ───
bot.onText(/\/toggle_published(?:\s+(\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const id = match?.[1] ? Number(match[1]) : null;
  if (!id) { bot.sendMessage(chatId, '⚠️ Dùng: /toggle_published [id]'); return; }
  try {
    const [tour] = await db.select().from(tours).where(eq(tours.id, id)).limit(1);
    if (!tour) { bot.sendMessage(chatId, `❌ Không tìm thấy tour #${id}`); return; }
    const newVal = !tour.published;
    await db.update(tours).set({ published: newVal, updatedAt: new Date() }).where(eq(tours.id, id));
    revalidateProduction([`/tour/${tour.slug}`]);
    bot.sendMessage(chatId,
      `${newVal ? '✅' : '🔒'} Tour <b>${escapeHtml(tour.title)}</b> (#${id}): ${newVal ? 'Công khai ✅' : 'Ẩn 🔒'}`,
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    bot.sendMessage(chatId, `❌ Lỗi: ${error}`);
  }
});

// ─── /revalidate ───
bot.onText(/\/revalidate/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    await revalidateProduction();
    bot.sendMessage(chatId, '🔄 Đã gửi yêu cầu revalidate cho /, /tours. Website sẽ cập nhật trong vài giây.');
  } catch (error) {
    bot.sendMessage(chatId, `❌ Lỗi: ${error}`);
  }
});

// ─── /cancel ───
bot.onText(/\/cancel/, (msg) => {
  const chatId = msg.chat.id;
  if (sessions.has(chatId)) {
    sessions.delete(chatId);
    bot.sendMessage(chatId, '❌ Đã hủy thao tác.');
  } else {
    bot.sendMessage(chatId, 'ℹ️ Không có thao tác nào đang thực hiện.');
  }
});

// ─── /quick_tour — Create tour in one message ───
bot.onText(/\/quick_tour/, (msg) => {
  const chatId = msg.chat.id;
  sessions.set(chatId, { step: 'quick_tour_input' });
  bot.sendMessage(chatId,
    `📝 <b>Tạo tour nhanh</b>\n\n` +
    `Gửi thông tin tour theo format sau (mỗi dòng 1 trường):\n\n` +
    `<code>Tiêu đề: Tour Đông Hưng 2N1Đ\n` +
    `Giá: 1500000\n` +
    `Giá gốc: 2000000\n` +
    `Thời gian: 2 ngày 1 đêm\n` +
    `Điểm đến: Đông Hưng, Trung Quốc\n` +
    `Khởi hành: Móng Cái\n` +
    `Phương tiện: Xe du lịch\n` +
    `Số người: 15-25 người\n` +
    `Mô tả: Khám phá thành phố Đông Hưng...</code>\n\n` +
    `Chỉ bắt buộc: <b>Tiêu đề</b> và <b>Giá</b>.\n` +
    `/cancel để hủy`,
    { parse_mode: 'HTML' }
  );
});

// ─── /new_tour — Step-by-step tour creation ───
bot.onText(/\/new_tour/, (msg) => {
  const chatId = msg.chat.id;
  sessions.set(chatId, { step: 'title' });
  bot.sendMessage(chatId,
    `🗺️ <b>Tạo tour mới</b>\n\n` +
    `Bước 1/6: Nhập <b>tiêu đề</b> tour:\n\n` +
    `💡 Ví dụ: Tour Đông Hưng 2 ngày 1 đêm\n\n/cancel để hủy`,
    { parse_mode: 'HTML' }
  );
});

// ─── Upload photo with /upload caption ───
bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;
  const caption = msg.caption || '';

  // Check if this is a photo for tour creation (gallery step)
  const session = sessions.get(chatId);
  if (session && session.step === 'gallery') {
    try {
      const fileId = msg.photo![msg.photo!.length - 1].file_id;
      const file = await bot.getFile(fileId);
      const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`;
      const response = await fetch(fileUrl);
      const buffer = Buffer.from(await response.arrayBuffer());
      const url = await uploadToCloudinary(buffer, `tour_${Date.now()}.jpg`);
      if (url) {
        if (!session.gallery) session.gallery = [];
        session.gallery.push(url);
        // First photo = thumbnail
        if (!session.thumbnail) session.thumbnail = url;
        bot.sendMessage(chatId,
          `✅ Đã upload! (${session.gallery.length} ảnh)\n` +
          `📷 Gửi thêm ảnh hoặc nhập <b>xong</b> để tiếp tục.\n` +
          `Ảnh đầu tiên sẽ là thumbnail.`,
          { parse_mode: 'HTML' }
        );
      } else {
        bot.sendMessage(chatId, '❌ Upload thất bại, thử lại.');
      }
    } catch (error) {
      bot.sendMessage(chatId, `❌ Lỗi upload: ${error}`);
    }
    return;
  }

  // Standalone upload with /upload caption
  if (caption.toLowerCase().includes('/upload') || caption.toLowerCase().startsWith('upload')) {
    try {
      const fileId = msg.photo![msg.photo!.length - 1].file_id;
      const file = await bot.getFile(fileId);
      const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`;
      const response = await fetch(fileUrl);
      const buffer = Buffer.from(await response.arrayBuffer());
      const url = await uploadToCloudinary(buffer, `upload_${Date.now()}.jpg`);
      if (url) {
        bot.sendMessage(chatId,
          `✅ Đã upload lên Cloudinary!\n\n` +
          `🔗 <code>${url}</code>\n\n` +
          `Copy URL trên để dùng cho tour.`,
          { parse_mode: 'HTML' }
        );
      } else {
        bot.sendMessage(chatId, '❌ Upload thất bại');
      }
    } catch (error) {
      bot.sendMessage(chatId, `❌ Lỗi: ${error}`);
    }
  }
});

// ─── Handle text messages (for sessions) ───
bot.on('text', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text || '';

  // Skip commands
  if (text.startsWith('/')) return;

  const session = sessions.get(chatId);
  if (!session) return;

  // ── Quick tour input ──
  if (session.step === 'quick_tour_input') {
    try {
      const lines = text.split('\n');
      const data: Record<string, string> = {};
      for (const line of lines) {
        const colonIdx = line.indexOf(':');
        if (colonIdx > 0) {
          const key = line.substring(0, colonIdx).trim().toLowerCase();
          const val = line.substring(colonIdx + 1).trim();
          data[key] = val;
        }
      }

      const title = data['tiêu đề'] || data['title'] || data['tên'] || '';
      const price = Number(data['giá'] || data['price'] || 0);

      if (!title) {
        bot.sendMessage(chatId, '⚠️ Thiếu tiêu đề. Thêm dòng: Tiêu đề: ...');
        return;
      }
      if (!price) {
        bot.sendMessage(chatId, '⚠️ Thiếu giá. Thêm dòng: Giá: ...');
        return;
      }

      const [newTour] = await db.insert(tours).values({
        title,
        slug: slugify(title),
        price,
        originalPrice: data['giá gốc'] ? Number(data['giá gốc']) : null,
        duration: data['thời gian'] || data['duration'] || '',
        destination: data['điểm đến'] || data['destination'] || '',
        departure: data['khởi hành'] || data['departure'] || 'Móng Cái',
        transportation: data['phương tiện'] || data['transport'] || '',
        groupSize: data['số người'] || data['group'] || '',
        shortDescription: data['mô tả'] || data['description'] || '',
        content: data['nội dung'] || data['content'] || '',
        thumbnail: '',
        gallery: [],
        itinerary: [],
        includes: [],
        excludes: [],
        notes: [],
        featured: true,
        published: true,
        rating: '5.0',
        reviewCount: 0,
        bookingCount: 0,
        departureDates: [],
      }).returning();

      revalidateProduction([`/tour/${newTour.slug}`]);
      sessions.delete(chatId);

      bot.sendMessage(chatId,
        `✅ <b>Tạo tour thành công!</b>\n\n` +
        `🆔 ID: ${newTour.id}\n` +
        `📛 ${escapeHtml(newTour.title)}\n` +
        `💰 ${formatPrice(newTour.price)}\n` +
        `🔗 ${SITE_URL}/tour/${newTour.slug}\n\n` +
        `⭐ Nổi bật: ✅ · ✅ Công khai\n\n` +
        `💡 Gửi ảnh với caption /upload rồi dùng /tour_info ${newTour.id} để cập nhật thêm.`,
        { parse_mode: 'HTML', disable_web_page_preview: true }
      );
    } catch (error) {
      bot.sendMessage(chatId, `❌ Lỗi tạo tour: ${error}`);
      sessions.delete(chatId);
    }
    return;
  }

  // ── Step-by-step tour creation ──
  switch (session.step) {
    case 'title': {
      session.title = text.trim();
      session.slug = slugify(session.title);
      session.step = 'price';
      bot.sendMessage(chatId,
        `✅ Tiêu đề: <b>${escapeHtml(session.title)}</b>\n` +
        `🔗 Slug: ${session.slug}\n\n` +
        `Bước 2/6: Nhập <b>giá</b> (VNĐ, số nguyên):\n` +
        `💡 Ví dụ: 1500000`,
        { parse_mode: 'HTML' }
      );
      break;
    }
    case 'price': {
      const price = Number(text.replace(/[.,\s]/g, ''));
      if (!price || price <= 0) {
        bot.sendMessage(chatId, '⚠️ Giá không hợp lệ. Nhập số nguyên, ví dụ: 1500000');
        return;
      }
      session.price = price;
      session.step = 'details';
      bot.sendMessage(chatId,
        `✅ Giá: <b>${formatPrice(price)}</b>\n\n` +
        `Bước 3/6: Nhập <b>chi tiết</b> tour (mỗi dòng 1 trường):\n\n` +
        `<code>Thời gian: 2 ngày 1 đêm\n` +
        `Điểm đến: Đông Hưng, Trung Quốc\n` +
        `Khởi hành: Móng Cái\n` +
        `Phương tiện: Xe du lịch\n` +
        `Số người: 15-25</code>\n\n` +
        `Hoặc nhập <b>skip</b> để bỏ qua.`,
        { parse_mode: 'HTML' }
      );
      break;
    }
    case 'details': {
      if (text.toLowerCase() !== 'skip') {
        const lines = text.split('\n');
        for (const line of lines) {
          const colonIdx = line.indexOf(':');
          if (colonIdx > 0) {
            const key = line.substring(0, colonIdx).trim().toLowerCase();
            const val = line.substring(colonIdx + 1).trim();
            if (key.includes('thời gian') || key.includes('duration')) session.duration = val;
            else if (key.includes('điểm đến') || key.includes('destination')) session.destination = val;
            else if (key.includes('khởi hành') || key.includes('departure')) session.departure = val;
            else if (key.includes('phương tiện') || key.includes('transport')) session.transportation = val;
            else if (key.includes('số người') || key.includes('group')) session.groupSize = val;
          }
        }
      }
      session.step = 'description';
      bot.sendMessage(chatId,
        `✅ Chi tiết đã lưu!\n\n` +
        `Bước 4/6: Nhập <b>mô tả ngắn</b> về tour:\n\n` +
        `Hoặc nhập <b>skip</b> để bỏ qua.`,
        { parse_mode: 'HTML' }
      );
      break;
    }
    case 'description': {
      if (text.toLowerCase() !== 'skip') {
        session.shortDescription = text.trim();
      }
      session.step = 'gallery';
      session.gallery = [];
      bot.sendMessage(chatId,
        `✅ Mô tả đã lưu!\n\n` +
        `Bước 5/6: <b>Gửi ảnh</b> cho tour (gửi từng ảnh hoặc nhiều ảnh).\n` +
        `📷 Ảnh đầu tiên sẽ là thumbnail.\n\n` +
        `Nhập <b>xong</b> khi đã gửi đủ ảnh, hoặc <b>skip</b> để bỏ qua.`,
        { parse_mode: 'HTML' }
      );
      break;
    }
    case 'gallery': {
      if (text.toLowerCase() === 'xong' || text.toLowerCase() === 'skip' || text.toLowerCase() === 'done') {
        session.step = 'itinerary';
        bot.sendMessage(chatId,
          `✅ Ảnh: ${session.gallery?.length || 0} ảnh\n\n` +
          `Bước 6/6: Nhập <b>lịch trình</b> (mỗi dòng 1 hoạt động):\n\n` +
          `<code>07:00 | Tập trung tại cửa khẩu | Mô tả...\n` +
          `09:00 | Qua cửa khẩu Bắc Luân | Làm thủ tục...\n` +
          `12:00 | Ăn trưa | Nhà hàng...</code>\n\n` +
          `Format: <code>thời gian | tiêu đề | mô tả</code>\n` +
          `Hoặc nhập <b>skip</b> để bỏ qua và lưu tour.`,
          { parse_mode: 'HTML' }
        );
      }
      // If it's just text (not "xong"/"skip"), ignore — photos are handled in photo handler
      break;
    }
    case 'itinerary': {
      const itinerary: { time?: string; title: string; description?: string }[] = [];

      if (text.toLowerCase() !== 'skip') {
        const lines = text.split('\n').filter(l => l.trim());
        for (const line of lines) {
          const parts = line.split('|').map(p => p.trim());
          if (parts.length >= 2) {
            itinerary.push({
              time: parts[0] || undefined,
              title: parts[1],
              description: parts[2] || undefined,
            });
          } else if (parts[0]) {
            itinerary.push({ title: parts[0] });
          }
        }
      }
      session.itinerary = itinerary;

      // ── SAVE TOUR ──
      try {
        const [newTour] = await db.insert(tours).values({
          title: session.title!,
          slug: session.slug || slugify(session.title!),
          price: session.price!,
          originalPrice: session.originalPrice || null,
          duration: session.duration || '',
          destination: session.destination || '',
          departure: session.departure || 'Móng Cái',
          transportation: session.transportation || '',
          groupSize: session.groupSize || '',
          shortDescription: session.shortDescription || '',
          content: '',
          thumbnail: session.thumbnail || '',
          gallery: session.gallery || [],
          itinerary: session.itinerary || [],
          includes: [],
          excludes: [],
          notes: [],
          featured: true,
          published: true,
          rating: '5.0',
          reviewCount: 0,
          bookingCount: 0,
          departureDates: [],
        }).returning();

        revalidateProduction([`/tour/${newTour.slug}`]);
        sessions.delete(chatId);

        let summary = `🎉 <b>Tour đã được tạo!</b>\n\n`;
        summary += `🆔 ID: ${newTour.id}\n`;
        summary += `📛 ${escapeHtml(newTour.title)}\n`;
        summary += `💰 ${formatPrice(newTour.price)}\n`;
        if (newTour.duration) summary += `⏱️ ${newTour.duration}\n`;
        if (newTour.destination) summary += `🎯 ${newTour.destination}\n`;
        summary += `🖼️ ${(newTour.gallery as string[])?.length || 0} ảnh\n`;
        summary += `🗓️ ${(newTour.itinerary as unknown[])?.length || 0} mục lịch trình\n`;
        summary += `⭐ Nổi bật: ✅ · ✅ Công khai\n\n`;
        summary += `🔗 ${SITE_URL}/tour/${newTour.slug}\n\n`;
        summary += `Website sẽ cập nhật trong vài giây! 🚀`;

        bot.sendMessage(chatId, summary, { parse_mode: 'HTML', disable_web_page_preview: true });
      } catch (error) {
        bot.sendMessage(chatId, `❌ Lỗi tạo tour: ${error}`);
        sessions.delete(chatId);
      }
      break;
    }
  }
});

// ─── Error handling ───
bot.on('polling_error', (error) => {
  console.error('Polling error:', error.message);
});

process.on('SIGINT', () => {
  console.log('\n👋 Bot đang tắt...');
  bot.stopPolling();
  process.exit(0);
});
