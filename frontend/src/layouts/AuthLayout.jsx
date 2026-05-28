import { Link } from 'react-router-dom'

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-white lg:flex">
      <aside className="relative hidden min-h-screen overflow-hidden lg:flex lg:w-[52%] xl:w-[55%]">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&h=1500&fit=crop"
          alt="Biệt thự cao cấp tại Hà Nội"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#03183f]/95 via-[#063b92]/44 to-[#03183f]/28" />

        <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
          <Link to="/home" className="flex items-center gap-3 text-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md ring-1 ring-white/25">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight">RentFlow</p>
              <p className="text-xs text-blue-100">Ký gửi &amp; Cho thuê nhà</p>
            </div>
          </Link>

          <div className="max-w-xl pb-8">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-orange-400" />
              Bất động sản chọn lọc tại Hà Nội
            </span>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
              Khám phá căn nhà phù hợp dành cho bạn
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-blue-50">
              Hàng trăm bất động sản được cập nhật mỗi ngày
            </p>

            <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
              {[
                { value: '500+', label: 'Căn nhà' },
                { value: '24/7', label: 'Hỗ trợ' },
                { value: '100%', label: 'Xác minh' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                  <p className="mt-1 text-xs text-blue-100">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-blue-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            Thông tin bảo mật và dữ liệu được bảo vệ an toàn
          </div>
        </div>
      </aside>

      <section className="flex min-h-screen w-full flex-col bg-white lg:w-[48%] xl:w-[45%]">
        <main className="flex flex-1 items-center justify-center px-5 py-8 sm:px-10 lg:px-12">
          <div className="w-full max-w-[460px]">{children}</div>
        </main>

        <footer className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-slate-100 px-6 py-5 text-xs text-slate-500">
          <a href="#" className="transition hover:text-primary-container">Chính sách bảo mật</a>
          <a href="#" className="transition hover:text-primary-container">Điều khoản sử dụng</a>
          <a href="mailto:support@rentflow.vn" className="transition hover:text-primary-container">Liên hệ hỗ trợ</a>
        </footer>
      </section>
    </div>
  )
}
