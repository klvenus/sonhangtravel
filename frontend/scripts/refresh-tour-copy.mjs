import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { neon } from '@neondatabase/serverless';

const applyChanges = process.argv.includes('--apply');
const envPath = resolve('.env.local');
const env = readFileSync(envPath, 'utf8');
const dbLine = env.split('\n').find((item) => item.startsWith('DATABASE_URL='));

if (!dbLine) {
  throw new Error('DATABASE_URL is missing in frontend/.env.local');
}

const sql = neon(dbLine.slice('DATABASE_URL='.length));

function formatSeoTourName(title) {
  const normalizedTitle = title.trim();
  return /^tour\b/i.test(normalizedTitle) ? normalizedTitle : `Tour ${normalizedTitle}`;
}

function stripHtml(text) {
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanHighlightText(text) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/^ngày\s*\d+[:.\-\s]*/i, '')
    .replace(/^\d{1,2}h\d{0,2}\s*[-–:]\s*/i, '')
    .trim();
}

function getAudienceHint(duration) {
  if (/1 ngày/i.test(duration)) {
    return 'khách muốn đi nhanh gọn, đổi gió trong thời gian ngắn nhưng vẫn có trải nghiệm trọn vẹn';
  }
  if (/2 ngày/i.test(duration)) {
    return 'khách thích lịch trình vừa phải, có thêm thời gian nghỉ ngơi, dạo phố và trải nghiệm buổi tối';
  }
  if (/3 ngày/i.test(duration)) {
    return 'khách muốn đi sâu hơn, kết hợp nhiều điểm tham quan và cân bằng giữa khám phá với nghỉ ngơi';
  }
  return 'khách muốn có lịch trình sâu, đi được nhiều điểm và ưu tiên trải nghiệm trọn hành trình';
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }

  const clipped = text.slice(0, maxLength);
  const lastSpace = clipped.lastIndexOf(' ');
  return `${clipped.slice(0, lastSpace > 80 ? lastSpace : maxLength).trim()}.`;
}

function uniqueItems(items, limit) {
  const result = [];
  const seen = new Set();

  for (const item of items || []) {
    const cleaned = cleanHighlightText(String(item || ''));
    const key = cleaned.toLowerCase();

    if (!cleaned || seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(cleaned);

    if (result.length >= limit) {
      break;
    }
  }

  return result;
}

function buildShortDescription(tour) {
  const seoName = formatSeoTourName(tour.title);
  const departure = tour.departure || 'Việt Nam';
  const destination = tour.destination || 'Trung Quốc';
  const duration = tour.duration || 'nhiều ngày';
  const itineraryHighlights = uniqueItems((tour.itinerary || []).map((item) => item.title), 2);
  const highlightText = itineraryHighlights.length > 0
    ? ` Nổi bật với ${itineraryHighlights.join(' và ')}.`
    : '';
  const shortDescription = `${seoName} khởi hành từ ${departure}, lịch trình ${duration}, khám phá ${destination}.${highlightText} Phù hợp cho khách muốn đi thuận tiện và rõ chương trình.`;
  return truncateText(shortDescription, 215);
}

function buildTourContent(tour) {
  const seoName = formatSeoTourName(tour.title);
  const departure = tour.departure || 'Việt Nam';
  const destination = tour.destination || 'Trung Quốc';
  const duration = tour.duration || 'nhiều ngày';
  const audienceHint = getAudienceHint(duration);
  const intro = stripHtml(tour.content || '') || `${seoName} là hành trình phù hợp cho khách muốn khám phá ${destination} với lịch trình ${duration}, khởi hành từ ${departure}.`;
  const itineraryHighlights = uniqueItems((tour.itinerary || []).map((item) => item.title), 5);
  const includeHighlights = uniqueItems(tour.includes || [], 5);
  const noteHighlights = uniqueItems(tour.notes || [], 4);

  const itineraryText = itineraryHighlights.length > 0
    ? `${seoName} nổi bật với các điểm và chặng trải nghiệm như ${itineraryHighlights.join(', ')}. Nhờ lịch trình được sắp xếp rõ ràng, khách dễ theo dõi, dễ chuẩn bị và không bị cảm giác đi quá gấp.`
    : `${seoName} được thiết kế theo hướng rõ điểm đến, dễ theo sát lịch trình và phù hợp cho khách muốn đi ổn định, hạn chế phát sinh trong chuyến đi.`;

  const includedText = includeHighlights.length > 0
    ? `Theo chương trình hiện tại, tour thường đã bao gồm ${includeHighlights.join(', ')}. Điều này giúp khách dễ dự trù chi phí và so sánh nhanh với các lịch trình khác cùng tuyến.`
    : `Chương trình tour được sắp xếp theo hướng thuận tiện cho khách đi thực tế, ưu tiên các hạng mục cơ bản để hành trình diễn ra gọn và dễ theo sát.`;

  const audienceText = `${seoName} đặc biệt phù hợp với ${audienceHint}. Đây là lựa chọn nên ưu tiên nếu anh chị muốn một hành trình rõ điểm nhấn, dễ đi và có thể chốt nhanh theo ngày khởi hành thực tế.`;

  const noteText = noteHighlights.length > 0
    ? `Khi chuẩn bị cho ${seoName.toLowerCase()}, anh chị nên lưu ý các điểm như ${noteHighlights.join(', ')}. Việc chuẩn bị sớm giúp hồ sơ, giấy tờ và lịch trình diễn ra suôn sẻ hơn.`
    : `Để đi tour thuận lợi, anh chị nên chuẩn bị hồ sơ sớm, kiểm tra giấy tờ cần thiết và liên hệ trước để giữ chỗ ở giai đoạn cao điểm.`;

  const bullets = itineraryHighlights.length > 0
    ? `<ul>${itineraryHighlights.map((item) => `<li>${item}</li>`).join('')}</ul>`
    : '';

  return [
    `<p>${intro}</p>`,
    `<p>${itineraryText}</p>`,
    bullets,
    `<p>${includedText}</p>`,
    `<p>${audienceText}</p>`,
    `<p>${noteText}</p>`,
  ].filter(Boolean).join('\n\n');
}

function buildCategoryDescription(category, tours) {
  const tourCount = tours.length;
  const departures = uniqueItems(tours.map((tour) => tour.departure || ''), 2);
  const durations = uniqueItems(tours.map((tour) => tour.duration || ''), 3);
  const destinations = uniqueItems(
    tours.flatMap((tour) =>
      String(tour.destination || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    ),
    4
  );

  const departureText = departures.length > 0 ? ` khởi hành thuận tiện từ ${departures.join(' và ')}` : '';
  const durationText = durations.length > 0 ? ` với các lịch trình ${durations.join(', ')}` : '';
  const destinationText = destinations.length > 0 ? `, nổi bật với ${destinations.join(', ')}` : '';

  return `Tour ${category.name}${departureText}${durationText}. Hiện có khoảng ${tourCount} hành trình trong nhóm này${destinationText}, phù hợp cho khách muốn chọn tuyến đi rõ ràng và dễ so sánh trước khi đặt.`;
}

async function main() {
  const tours = await sql`
    select
      t.id,
      t.title,
      t.slug,
      t.short_description,
      t.content,
      t.duration,
      t.departure,
      t.destination,
      t.includes,
      t.notes,
      t.itinerary,
      t.updated_at,
      c.id as category_id,
      c.name as category_name,
      c.slug as category_slug
    from tours t
    left join categories c on c.id = t.category_id
    where t.published = true
    order by t.id asc
  `;

  const categories = await sql`
    select id, name, slug, description
    from categories
    order by id asc
  `;

  const tourUpdates = tours.map((tour) => ({
    id: tour.id,
    slug: tour.slug,
    title: tour.title,
    shortDescription: buildShortDescription(tour),
    content: buildTourContent(tour),
  }));

  const toursByCategory = new Map();
  for (const tour of tours) {
    if (!tour.category_id) continue;
    const existing = toursByCategory.get(tour.category_id) || [];
    existing.push(tour);
    toursByCategory.set(tour.category_id, existing);
  }

  const categoryUpdates = categories.map((category) => ({
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: buildCategoryDescription(category, toursByCategory.get(category.id) || []),
  }));

  const changedTours = tourUpdates.filter((update, index) => {
    const original = tours[index];
    return update.shortDescription !== original.short_description || update.content !== original.content;
  });

  const changedCategories = categoryUpdates.filter((update, index) => {
    const original = categories[index];
    return update.description !== original.description;
  });

  console.log(`Tours to update: ${changedTours.length}`);
  console.log(`Categories to update: ${changedCategories.length}`);

  for (const tour of changedTours.slice(0, 5)) {
    console.log(`- ${tour.slug}: short=${tour.shortDescription.length} content=${stripHtml(tour.content).length}`);
  }

  if (!applyChanges) {
    console.log('Preview only. Re-run with --apply to update the live DB.');
    return;
  }

  for (const tour of changedTours) {
    await sql`
      update tours
      set
        short_description = ${tour.shortDescription},
        content = ${tour.content},
        updated_at = now()
      where id = ${tour.id}
    `;
  }

  for (const category of changedCategories) {
    await sql`
      update categories
      set
        description = ${category.description},
        updated_at = now()
      where id = ${category.id}
    `;
  }

  console.log(`Applied ${changedTours.length} tour updates and ${changedCategories.length} category updates.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
