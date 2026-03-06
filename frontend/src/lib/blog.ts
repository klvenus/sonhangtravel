export interface BlogBlock {
  type: 'heading' | 'paragraph'
  text: string
}

export interface BlogPost {
  slug: string
  title: string
  description: string
  excerpt: string
  content: BlogBlock[]
  publishedAt: string
  updatedAt?: string
  category: string
  keywords: string[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'kinh-nghiem-di-dong-hung-1-ngay-tu-mong-cai',
    title: 'Kinh Nghiệm Đi Đông Hưng 1 Ngày Từ Móng Cái: Lịch Trình, Giấy Tờ, Chi Phí',
    description:
      'Cẩm nang đi Đông Hưng 1 ngày từ Móng Cái: cần chuẩn bị gì, lịch trình hợp lý, những điểm nên đi, ăn gì, mua gì và các lưu ý quan trọng cho người đi lần đầu.',
    excerpt:
      'Nếu bạn đang muốn đổi gió thật nhanh mà không cần lên kế hoạch quá dài, Đông Hưng là một lựa chọn rất “vừa xinh”. Chỉ trong một ngày, bạn vẫn có thể ăn ngon, dạo phố, mua sắm và mang về cảm giác như vừa có một chuyến đi nho nhỏ nhưng khá trọn vẹn.',
    publishedAt: '2026-03-06T16:10:00.000Z',
    category: 'Đông Hưng',
    keywords: [
      'kinh nghiệm đi đông hưng 1 ngày',
      'đi đông hưng từ móng cái',
      'tour đông hưng 1 ngày',
      'đông hưng có gì chơi',
      'giấy tờ đi đông hưng',
    ],
    content: [
      { type: 'paragraph', text: 'Nếu bạn đang muốn đổi gió thật nhanh mà không cần xin nghỉ dài ngày, Đông Hưng là một lựa chọn rất “vừa xinh”. Từ Móng Cái đi sang không quá xa, thủ tục nếu chuẩn bị đúng sẽ khá gọn, và cảm giác bước sang một thành phố biên giới nhộn nhịp của Trung Quốc luôn đủ để làm chuyến đi trong ngày trở nên thú vị hơn hẳn.' },
      { type: 'paragraph', text: 'Đây là kiểu hành trình hợp với những ngày bạn chỉ muốn đi chơi nhẹ một chút nhưng vẫn có ảnh đẹp, có đồ ăn ngon và có cảm giác mình vừa đi đâu đó thật rồi.' },
      { type: 'heading', text: 'Đông Hưng có gì khiến người ta thích đi?' },
      { type: 'paragraph', text: 'Điều làm Đông Hưng dễ gây thiện cảm là nhịp sống ở đây khá cuốn. Phố xá đông vui, biển hiệu rực rỡ, quán xá san sát, hàng ăn vặt rất nhiều và không khí giao thương lúc nào cũng có gì đó rất riêng của vùng biên.' },
      { type: 'paragraph', text: 'Chỉ cần đi dạo một vòng, bạn đã có thể thấy đủ thứ đáng để tò mò: từ khu phố có kiến trúc đẹp, các điểm check-in kiểu Trung Hoa, cho tới siêu thị, chợ buôn và những món ăn nhìn thôi đã muốn thử ngay. Với ai thích kiểu vừa đi vừa ngắm vừa ăn, Đông Hưng đúng là khá hợp gu.' },
      { type: 'heading', text: 'Đi lần đầu cần chuẩn bị gì?' },
      { type: 'paragraph', text: 'Nếu đi lần đầu, việc quan trọng nhất vẫn là chuẩn bị giấy tờ cho gọn gàng. Người lớn thường cần CCCD hoặc giấy tờ tùy thân theo yêu cầu của đơn vị tổ chức, ảnh chân dung nền trắng đúng quy cách và hồ sơ thông hành nếu đi tour.' },
      { type: 'paragraph', text: 'Với trẻ em thì cần thêm giấy khai sinh hoặc giấy tờ xác nhận phù hợp. Phần này nghe có vẻ nhỏ nhưng lại quyết định chuyến đi có mượt hay không, nên chuẩn bị sớm vẫn luôn là cách nhàn nhất.' },
      { type: 'heading', text: 'Lịch trình một ngày nên đi thế nào cho đẹp?' },
      { type: 'paragraph', text: 'Một ngày ở Đông Hưng đẹp nhất khi đi theo nhịp vừa phải. Buổi sáng làm thủ tục và sang cửa khẩu, sau đó bắt đầu tham quan các điểm nổi bật như công viên, chùa, khu phố đẹp hoặc các địa danh mang tính biểu tượng.' },
      { type: 'paragraph', text: 'Buổi trưa nên để dành cho một bữa ăn chỉnh chu hơn một chút để cảm nhận rõ món ăn địa phương. Đến chiều, không khí bắt đầu dễ chịu hơn và đây cũng là lúc hợp nhất để dạo phố, mua sắm, chọn quà hoặc tranh thủ chụp thêm vài bộ ảnh xinh xinh.' },
      { type: 'heading', text: 'Một vài mẹo nhỏ để chuyến đi dễ chịu hơn' },
      { type: 'paragraph', text: 'Đừng cố nhồi quá nhiều điểm trong một ngày. Đông Hưng không phải kiểu nơi cần chạy thật nhanh để “đánh dấu đã đến”, mà hợp hơn với cách đi thong thả một chút. Nếu bạn mê ăn uống, hãy ưu tiên khu phố ẩm thực và siêu thị. Nếu thích chụp ảnh, hãy để thời gian cho các khu có kiến trúc đẹp và góc phố nổi bật.' },
      { type: 'paragraph', text: 'Ngoài ra, nên đi giày thoải mái, mang theo ít đồ gọn nhẹ, chuẩn bị sẵn tiền mặt hoặc phương án thanh toán phù hợp và luôn giữ điện thoại đủ pin. Nếu không muốn tự lo quá nhiều, đi theo tour vẫn là lựa chọn dễ chịu vì đã có người hỗ trợ từ thủ tục đến xe cộ, lịch trình và các chặng di chuyển.' },
      { type: 'heading', text: 'Có đáng đi không?' },
      { type: 'paragraph', text: 'Câu trả lời là có, nhất là khi bạn đang cần một chuyến đi ngắn nhưng vẫn đủ cảm giác mới mẻ. Đông Hưng 1 ngày không phải kiểu đi thật xa mới thấy vui, mà là kiểu đi gọn nhưng vẫn mang lại cảm giác mình vừa có một ngày rất khác với thường ngày.' },
      { type: 'paragraph', text: 'Chỉ cần chuẩn bị giấy tờ kỹ và đi đúng nhịp, bạn hoàn toàn có thể có một ngày vừa vui, vừa nhẹ đầu, vừa đủ nhiều thứ để mang về kể lại.' }
    ],
  },
]

export function getAllBlogPosts() {
  return blogPosts
}

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug)
}
