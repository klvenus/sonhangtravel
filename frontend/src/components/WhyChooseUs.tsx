const reasons = [
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Uy Tín & Chất Lượng',
    description: 'Hơn 10 năm kinh nghiệm với hàng nghìn khách hàng hài lòng',
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Giá Cả Hợp Lý',
    description: 'Cam kết giá tốt nhất với chất lượng dịch vụ vượt trội',
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Hướng Dẫn Chuyên Nghiệp',
    description: 'Đội ngũ HDV giàu kinh nghiệm, am hiểu văn hóa địa phương',
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: 'Hỗ Trợ 24/7',
    description: 'Luôn sẵn sàng hỗ trợ khách hàng mọi lúc, mọi nơi',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container-custom">
        {/* Why Choose Us */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Tại Sao Chọn Sơn Hằng Travel?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cam kết mang đến cho bạn những trải nghiệm du lịch tuyệt vời nhất với dịch vụ chất lượng cao
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00CBA9]/10 text-[#00CBA9] rounded-2xl mb-4">
                {reason.icon}
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{reason.title}</h3>
              <p className="text-gray-600 text-sm">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
