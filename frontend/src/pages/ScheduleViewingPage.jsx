import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

const PROPERTY = {
  id: 1,
  title: 'Biệt thự cổ điển Pháp tại Phố Cổ',
  price: '45.000.000 đ/tháng',
  location: 'Hoàn Kiếm, Hà Nội',
  area: '320 m²',
  bedrooms: 4,
  bathrooms: 5,
  type: 'Biệt thự',
  image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop',
}

const BROKER = {
  id: 1,
  name: 'Nguyễn Thu Hà',
  role: 'Chuyên viên tư vấn cao cấp',
  rating: 4.9,
  reviews: 127,
  phone: '0988.123.***',
  status: 'online',
  image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
}

const TIME_SLOTS = [
  { time: '08:00', available: true },
  { time: '08:30', available: true },
  { time: '09:00', available: false, reason: 'Đã đặt' },
  { time: '09:30', available: true },
  { time: '10:00', available: true },
  { time: '10:30', available: false, reason: 'Không khả dụng' },
  { time: '11:00', available: true },
  { time: '11:30', available: true },
  { time: '13:30', available: true },
  { time: '14:00', available: false, reason: 'Đã đặt' },
  { time: '14:30', available: true },
  { time: '15:00', available: true },
  { time: '15:30', available: true },
  { time: '16:00', available: false, reason: 'Sắp hết chỗ' },
  { time: '16:30', available: true },
  { time: '17:00', available: true },
]

const VIEWING_METHODS = [
  {
    id: 'trực_tiếp',
    label: 'Xem trực tiếp',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10a1 1 0 011-1h4.828a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a1 1 0 01-1 1H4a1 1 0 01-1-1v-9z" />
      </svg>
    ),
    description: 'Đến xem bất động sản trực tiếp cùng môi giới',
  },
  {
    id: 'video_call',
    label: 'Video call',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    description: 'Xem nhà qua video call với môi giới',
  },
  {
    id: 'di_cung_moi_gioi',
    label: 'Đi cùng môi giới',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    description: 'Đi cùng môi giới từ văn phòng',
  },
]

export default function ScheduleViewingPage() {
  const [searchParams] = useSearchParams()
  const propertyId = searchParams.get('propertyId')
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [viewingMethod, setViewingMethod] = useState('trực_tiếp')
  const [notes, setNotes] = useState('')
  const [numPeople, setNumPeople] = useState('1')
  const [specialRequests, setSpecialRequests] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(null)

  const handleSubmit = () => {
    if (!selectedDate || !selectedTime) return

    setIsSubmitting(true)
    setTimeout(() => {
      setBookingConfirmed({
        date: selectedDate,
        time: selectedTime,
        method: viewingMethod,
        property: PROPERTY.title,
        bookingCode: `SCH-${Date.now().toString().slice(-6)}`,
      })
      setIsSubmitting(false)
      setShowSuccess(true)
    }, 1500)
  }

  const getDaysInMonth = () => {
    const today = new Date()
    const days = []
    for (let i = 0; i < 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      days.push(date)
    }
    return days
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' })
  }

  const formatFullDate = (date) => {
    return date.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  if (showSuccess && bookingConfirmed) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-2xl mx-auto px-6 py-12">
          {/* Success Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-xl shadow-slate-200/40">
            {/* Success Animation */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center animate-bounce">
              <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-slate-800 mb-2">Đặt lịch thành công!</h1>
            <p className="text-slate-500 mb-8">
              Lịch xem nhà của bạn đã được xác nhận
            </p>

            {/* Booking Details */}
            <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left">
              <div className="flex items-start gap-4 mb-6">
                <img
                  src={PROPERTY.image}
                  alt={PROPERTY.title}
                  className="w-24 h-20 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 mb-1 line-clamp-1">{bookingConfirmed.property}</h3>
                  <p className="text-sm text-slate-500">{PROPERTY.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase mb-1">Ngày xem</p>
                  <p className="text-sm font-semibold text-slate-800">{formatFullDate(new Date(bookingConfirmed.date))}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase mb-1">Giờ xem</p>
                  <p className="text-sm font-semibold text-slate-800">{bookingConfirmed.time}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase mb-1">Hình thức</p>
                  <p className="text-sm font-semibold text-slate-800">{VIEWING_METHODS.find(m => m.id === bookingConfirmed.method)?.label || bookingConfirmed.method}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase mb-1">Mã lịch hẹn</p>
                  <p className="text-sm font-semibold text-primary-container">{bookingConfirmed.bookingCode}</p>
                </div>
              </div>
            </div>

            {/* Broker Info */}
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl mb-8">
              <img
                src={BROKER.image}
                alt={BROKER.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">{BROKER.name}</p>
                <p className="text-xs text-slate-500">Môi giới phụ trách</p>
              </div>
              <a href={`tel:${BROKER.phone}`} className="text-primary-container text-sm font-medium hover:text-primary">
                Gọi ngay
              </a>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Link
                to="/tenant/lich-xem"
                className="flex-1 bg-primary-container hover:bg-primary text-white font-semibold py-3 px-6 rounded-xl transition-all"
              >
                Xem lịch hẹn của tôi
              </Link>
              <Link
                to="/bat-dong-san"
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-all"
              >
                Khám phá nhà khác
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const days = getDaysInMonth()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Đặt lịch xem nhà</h1>
          <p className="text-slate-500">Chọn thời gian phù hợp để xem bất động sản thực tế</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex gap-4">
                <img
                  src={PROPERTY.image}
                  alt={PROPERTY.title}
                  className="w-40 h-28 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <h2 className="font-semibold text-slate-800 mb-2 line-clamp-1">{PROPERTY.title}</h2>
                  <p className="text-primary-container font-bold text-lg mb-2">{PROPERTY.price}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {PROPERTY.location}
                    </span>
                    <span>{PROPERTY.area}</span>
                    <span>{PROPERTY.bedrooms} ngủ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-4">Chọn ngày xem</h3>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {days.map((date) => {
                  const isSelected = selectedDate === date.toISOString()
                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => {
                        setSelectedDate(date.toISOString())
                        setSelectedTime(null)
                      }}
                      className={`flex-shrink-0 w-16 h-20 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-primary-container border-primary-container text-white'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-primary-container hover:bg-blue-50'
                      }`}
                    >
                      <div className="text-xs uppercase mb-1">{date.toLocaleDateString('vi-VN', { weekday: 'short' })}</div>
                      <div className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                        {date.getDate()}
                      </div>
                      <div className="text-xs">{date.getMonth() + 1}/{date.getFullYear().toString().slice(-2)}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-4">
                  Chọn giờ xem - {formatDate(new Date(selectedDate))}
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {TIME_SLOTS.map((slot, index) => {
                    const isSelected = selectedTime === slot.time
                    return (
                      <button
                        key={index}
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                          !slot.available
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-primary-container text-white shadow-md'
                            : 'bg-white border border-slate-200 text-slate-600 hover:border-primary-container hover:bg-blue-50'
                        }`}
                      >
                        {slot.time}
                      </button>
                    )
                  })}
                </div>
                <div className="flex gap-4 mt-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-white border border-slate-200"></span>
                    Có thể đặt
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-slate-100"></span>
                    Đã kín
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-primary-container"></span>
                    Đã chọn
                  </span>
                </div>
              </div>
            )}

            {/* Viewing Method */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-4">Hình thức xem nhà</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {VIEWING_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setViewingMethod(method.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      viewingMethod === method.id
                        ? 'border-primary-container bg-blue-50'
                        : 'border-slate-200 bg-white hover:border-primary-container/50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                      viewingMethod === method.id ? 'bg-primary-container text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {method.icon}
                    </div>
                    <p className="text-sm font-semibold text-slate-800 mb-1">{method.label}</p>
                    <p className="text-xs text-slate-500">{method.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Info Form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-4">Thông tin bổ sung</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Số người đi cùng
                  </label>
                  <div className="flex gap-2">
                    {['1', '2', '3', '4+'].map((num) => (
                      <button
                        key={num}
                        onClick={() => setNumPeople(num)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          numPeople === num
                            ? 'bg-primary-container text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ghi chú cho môi giới
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ví dụ: Tôi cần xem phòng ngủ hướng Nam..."
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Yêu cầu đặc biệt (nếu có)
                  </label>
                  <input
                    type="text"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Ví dụ: Cần người biết tiếng Anh..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Broker Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm sticky top-6">
              <h3 className="font-semibold text-slate-800 mb-4">Môi giới phụ trách</h3>

              <div className="text-center mb-4">
                <img
                  src={BROKER.image}
                  alt={BROKER.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-3 ring-4 ring-blue-50"
                />
                <h4 className="font-semibold text-slate-800">{BROKER.name}</h4>
                <p className="text-sm text-slate-500">{BROKER.role}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <svg className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="font-bold text-slate-800">{BROKER.rating}</span>
                <span className="text-sm text-slate-500">({BROKER.reviews} đánh giá)</span>
              </div>

              {/* Status */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className={`w-2.5 h-2.5 rounded-full ${BROKER.status === 'online' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                <span className="text-sm text-slate-600 capitalize">{BROKER.status === 'online' ? 'Đang hoạt động' : 'Ngoại tuyến'}</span>
              </div>

              {/* Phone */}
              <div className="bg-slate-50 rounded-xl p-3 mb-4">
                <p className="text-center text-sm text-slate-500 mb-1">Số điện thoại</p>
                <p className="text-center font-semibold text-slate-800">{BROKER.phone}</p>
              </div>

              {/* Summary */}
              <div className="border-t border-slate-200 pt-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Tóm tắt lịch hẹn</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ngày</span>
                    <span className="font-medium text-slate-800">
                      {selectedDate ? formatDate(new Date(selectedDate)) : 'Chưa chọn'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Giờ</span>
                    <span className="font-medium text-slate-800">
                      {selectedTime || 'Chưa chọn'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hình thức</span>
                    <span className="font-medium text-slate-800 capitalize">
                      {viewingMethod.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Số người</span>
                    <span className="font-medium text-slate-800">{numPeople}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!selectedDate || !selectedTime || isSubmitting}
                className="w-full mt-4 bg-primary-container hover:bg-primary text-white font-semibold py-3.5 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Xác nhận đặt lịch
                  </>
                )}
              </button>

              <p className="text-xs text-slate-500 text-center mt-3">
                Bạn sẽ nhận được xác nhận qua email
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
