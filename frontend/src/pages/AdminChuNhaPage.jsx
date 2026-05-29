import { useMemo, useState } from 'react'

const STATUS_CONFIG = {
  dang_hop_tac: {
    label: 'Đang hợp tác',
    className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  },
  can_cham_soc: {
    label: 'Cần chăm sóc',
    className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  },
  tam_dung: {
    label: 'Tạm dừng',
    className: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  },
}

const LANDLORDS = [
  {
    id: 'CN-0001',
    name: 'Nguyễn Văn Minh',
    phone: '0901 234 567',
    email: 'minh.nguyen@rentflow.vn',
    cccd: '001084003921',
    address: '123 Hoàng Quốc Việt, Cầu Giấy, Hà Nội',
    district: 'Cầu Giấy',
    status: 'dang_hop_tac',
    propertyCount: 4,
    activeContracts: 3,
    rentedProperties: 2,
    depositAmount: 180000000,
    manager: 'Trần Văn Hùng',
    joinedAt: '15/03/2025',
    properties: [
      { id: 'BĐS-1201', name: 'Biệt thự Vinhomes Riverside', type: 'Biệt thự', rent: 50000000, status: 'Đang cho thuê' },
      { id: 'BĐS-1202', name: 'Căn hộ 3PN The Manor', type: 'Căn hộ', rent: 28000000, status: 'Đang hiển thị' },
      { id: 'BĐS-1203', name: 'Shophouse Sun Grand City', type: 'Shophouse', rent: 42000000, status: 'Chờ khảo sát' },
    ],
    contracts: [
      { id: 'HĐKG-2025-001', property: 'Biệt thự Vinhomes Riverside', period: '01/04/2025 - 31/03/2026', status: 'Hiệu lực' },
      { id: 'HĐKG-2025-008', property: 'Căn hộ 3PN The Manor', period: '10/04/2025 - 09/04/2026', status: 'Hiệu lực' },
    ],
    deposits: [
      { id: 'GD-9001', date: '02/04/2025', type: 'Thu tiền đảm bảo', amount: 100000000, note: 'Biệt thự Vinhomes Riverside' },
      { id: 'GD-9042', date: '12/04/2025', type: 'Thu tiền đảm bảo', amount: 80000000, note: 'Căn hộ 3PN The Manor' },
    ],
    timeline: [
      { time: 'Hôm nay, 09:30', title: 'Cập nhật điều khoản gia hạn hợp đồng', by: 'Pháp luật' },
      { time: '28/05/2026, 15:10', title: 'Gọi xác nhận lịch bàn giao căn hộ', by: 'Trần Văn Hùng' },
      { time: '20/05/2026, 11:45', title: 'Nhận thêm hồ sơ ký gửi shophouse', by: 'Nhân viên đại lý' },
    ],
  },
  {
    id: 'CN-0002',
    name: 'Trần Thị Hoa',
    phone: '0987 654 321',
    email: 'hoa.tran@rentflow.vn',
    cccd: '001186009112',
    address: '29 Liễu Giai, Ba Đình, Hà Nội',
    district: 'Ba Đình',
    status: 'dang_hop_tac',
    propertyCount: 2,
    activeContracts: 2,
    rentedProperties: 1,
    depositAmount: 95000000,
    manager: 'Lê Quốc Anh',
    joinedAt: '22/02/2025',
    properties: [
      { id: 'BĐS-1310', name: 'Căn hộ Midtown Sài Đồng', type: 'Căn hộ', rent: 15000000, status: 'Đang cho thuê' },
      { id: 'BĐS-1311', name: 'Kiot mặt đường Kim Mã', type: 'Kiot', rent: 12000000, status: 'Đang hiển thị' },
    ],
    contracts: [
      { id: 'HĐKG-2025-014', property: 'Căn hộ Midtown Sài Đồng', period: '01/03/2025 - 28/02/2026', status: 'Hiệu lực' },
      { id: 'HĐKG-2025-016', property: 'Kiot mặt đường Kim Mã', period: '15/05/2025 - 14/05/2026', status: 'Hiệu lực' },
    ],
    deposits: [
      { id: 'GD-9110', date: '01/03/2025', type: 'Thu tiền đảm bảo', amount: 60000000, note: 'Căn hộ Midtown Sài Đồng' },
      { id: 'GD-9188', date: '15/05/2025', type: 'Thu tiền đảm bảo', amount: 35000000, note: 'Kiot mặt đường Kim Mã' },
    ],
    timeline: [
      { time: '27/05/2026, 10:00', title: 'Gửi báo cáo tình trạng khách thuê', by: 'Lê Quốc Anh' },
      { time: '15/05/2026, 14:20', title: 'Hoàn tất ký gửi kiot Kim Mã', by: 'Pháp luật' },
      { time: '05/05/2026, 08:40', title: 'Cập nhật số tài khoản nhận thanh toán', by: 'Kế toán' },
    ],
  },
  {
    id: 'CN-0003',
    name: 'Lê Quốc Bảo',
    phone: '0912 345 678',
    email: 'bao.le@rentflow.vn',
    cccd: '001079004556',
    address: '56 Hàng Bài, Hoàn Kiếm, Hà Nội',
    district: 'Hoàn Kiếm',
    status: 'can_cham_soc',
    propertyCount: 3,
    activeContracts: 1,
    rentedProperties: 1,
    depositAmount: 70000000,
    manager: 'Nguyễn Thị Lan',
    joinedAt: '05/04/2025',
    properties: [
      { id: 'BĐS-1420', name: 'Nhà phố cổ Hàng Bài', type: 'Nhà phố', rent: 25000000, status: 'Đang cho thuê' },
      { id: 'BĐS-1421', name: 'Căn hộ dịch vụ Tràng Tiền', type: 'Căn hộ dịch vụ', rent: 18000000, status: 'Chờ bổ sung hồ sơ' },
    ],
    contracts: [
      { id: 'HĐKG-2025-021', property: 'Nhà phố cổ Hàng Bài', period: '10/04/2025 - 09/04/2026', status: 'Hiệu lực' },
    ],
    deposits: [
      { id: 'GD-9210', date: '10/04/2025', type: 'Thu tiền đảm bảo', amount: 70000000, note: 'Nhà phố cổ Hàng Bài' },
    ],
    timeline: [
      { time: '26/05/2026, 16:30', title: 'Nhắc bổ sung giấy ủy quyền tài sản', by: 'Pháp luật' },
      { time: '22/05/2026, 09:15', title: 'Chủ nhà phản hồi cần điều chỉnh giá thuê', by: 'Nguyễn Thị Lan' },
      { time: '18/05/2026, 13:00', title: 'Đặt lịch khảo sát căn hộ dịch vụ', by: 'Nhân viên đại lý' },
    ],
  },
  {
    id: 'CN-0004',
    name: 'Phạm Minh Tuấn',
    phone: '0903 456 789',
    email: 'tuan.pham@rentflow.vn',
    cccd: '001082007432',
    address: 'Nguyễn Văn Hưởng, Tây Hồ, Hà Nội',
    district: 'Tây Hồ',
    status: 'dang_hop_tac',
    propertyCount: 5,
    activeContracts: 4,
    rentedProperties: 3,
    depositAmount: 260000000,
    manager: 'Phạm Minh Tuấn',
    joinedAt: '10/01/2025',
    properties: [
      { id: 'BĐS-1501', name: 'Biệt thự sân vườn Tây Hồ', type: 'Biệt thự', rent: 65000000, status: 'Đang cho thuê' },
      { id: 'BĐS-1502', name: 'Penthouse view hồ Tây', type: 'Penthouse', rent: 78000000, status: 'Đang hiển thị' },
      { id: 'BĐS-1503', name: 'Nhà phố Xuân Diệu', type: 'Nhà phố', rent: 45000000, status: 'Đang cho thuê' },
    ],
    contracts: [
      { id: 'HĐKG-2025-002', property: 'Biệt thự sân vườn Tây Hồ', period: '01/02/2025 - 31/01/2026', status: 'Hiệu lực' },
      { id: 'HĐKG-2025-024', property: 'Penthouse view hồ Tây', period: '01/05/2025 - 30/04/2026', status: 'Hiệu lực' },
      { id: 'HĐKG-2025-025', property: 'Nhà phố Xuân Diệu', period: '12/05/2025 - 11/05/2026', status: 'Hiệu lực' },
    ],
    deposits: [
      { id: 'GD-9301', date: '01/02/2025', type: 'Thu tiền đảm bảo', amount: 120000000, note: 'Biệt thự sân vườn Tây Hồ' },
      { id: 'GD-9360', date: '01/05/2025', type: 'Thu tiền đảm bảo', amount: 90000000, note: 'Penthouse view hồ Tây' },
      { id: 'GD-9368', date: '12/05/2025', type: 'Thu tiền đảm bảo', amount: 50000000, note: 'Nhà phố Xuân Diệu' },
    ],
    timeline: [
      { time: '29/05/2026, 08:20', title: 'Phê duyệt đăng mới penthouse', by: 'Admin' },
      { time: '24/05/2026, 17:45', title: 'Đối soát tiền đảm bảo tháng 5', by: 'Kế toán' },
      { time: '12/05/2026, 10:25', title: 'Ký hợp đồng ký gửi nhà phố Xuân Diệu', by: 'Pháp luật' },
    ],
  },
  {
    id: 'CN-0005',
    name: 'Đỗ Văn Kiên',
    phone: '0978 111 222',
    email: 'kien.do@rentflow.vn',
    cccd: '001075008001',
    address: '88 Láng Hạ, Đống Đa, Hà Nội',
    district: 'Đống Đa',
    status: 'tam_dung',
    propertyCount: 1,
    activeContracts: 0,
    rentedProperties: 0,
    depositAmount: 0,
    manager: 'Lê Quốc Anh',
    joinedAt: '18/05/2025',
    properties: [
      { id: 'BĐS-1701', name: 'Nhà mặt phố Đống Đa', type: 'Nhà phố', rent: 22000000, status: 'Tạm dừng ký gửi' },
    ],
    contracts: [
      { id: 'HĐKG-2025-029', property: 'Nhà mặt phố Đống Đa', period: 'Chưa hiệu lực', status: 'Chờ ký' },
    ],
    deposits: [],
    timeline: [
      { time: '25/05/2026, 15:00', title: 'Tạm dừng xử lý do thiếu giấy tờ sở hữu', by: 'Pháp luật' },
      { time: '20/05/2026, 09:35', title: 'Gọi xác minh nhu cầu ký gửi', by: 'Lê Quốc Anh' },
      { time: '18/05/2026, 11:10', title: 'Tạo hồ sơ chủ nhà mới', by: 'Nhân viên đại lý' },
    ],
  },
]

const TABS = [
  { id: 'profile', label: 'Thông tin cá nhân' },
  { id: 'properties', label: 'Bất động sản' },
  { id: 'contracts', label: 'Hợp đồng ký gửi' },
  { id: 'deposits', label: 'Tiền đảm bảo' },
  { id: 'timeline', label: 'Lịch sử làm việc' },
]

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
}

function initials(name) {
  return name
    .split(' ')
    .slice(-2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function IconButton({ label, children, onClick }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
    >
      {children}
    </button>
  )
}

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.tam_dung
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  )
}

function KpiCard({ label, value, detail, accent }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>
        <span className={`h-10 w-10 rounded-lg ${accent}`} />
      </div>
    </div>
  )
}

function DrawerSection({ title, children }) {
  return (
    <section>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  )
}

function LandlordDrawer({ landlord, activeTab, setActiveTab, onClose }) {
  if (!landlord) return null

  return (
    <>
      <button
        type="button"
        aria-label="Đóng chi tiết chủ nhà"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-950/35"
      />

      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col bg-white shadow-2xl sm:w-[620px]">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                {initials(landlord.name)}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{landlord.id}</p>
                <h2 className="text-lg font-bold text-slate-900">{landlord.name}</h2>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <StatusBadge status={landlord.status} />
                  <span className="text-xs text-slate-500">{landlord.district}</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              aria-label="Đóng"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
              Chỉnh sửa
            </button>
            <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Xem hợp đồng
            </button>
            <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Liên hệ
            </button>
            <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Xem bất động sản
            </button>
          </div>
        </div>

        <div className="border-b border-slate-200 px-5">
          <div className="flex gap-2 overflow-x-auto py-3">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <DrawerSection title="Thông tin cá nhân">
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    ['Họ tên', landlord.name],
                    ['CCCD', landlord.cccd],
                    ['SĐT', landlord.phone],
                    ['Email', landlord.email],
                    ['Địa chỉ', landlord.address],
                    ['Nhân viên phụ trách', landlord.manager],
                    ['Ngày bắt đầu hợp tác', landlord.joinedAt],
                    ['Quận/Huyện', landlord.district],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <dt className="text-xs font-medium text-slate-500">{label}</dt>
                      <dd className="mt-1 text-sm font-semibold text-slate-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </DrawerSection>
            </div>
          )}

          {activeTab === 'properties' && (
            <DrawerSection title="Danh sách nhà ký gửi">
              <div className="space-y-3">
                {landlord.properties.map((property) => (
                  <div key={property.id} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{property.name}</p>
                        <p className="mt-1 text-xs text-slate-500">{property.id} · {property.type}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {property.status}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-blue-700">{formatCurrency(property.rent)}/tháng</p>
                  </div>
                ))}
              </div>
            </DrawerSection>
          )}

          {activeTab === 'contracts' && (
            <DrawerSection title="Danh sách hợp đồng">
              <div className="space-y-3">
                {landlord.contracts.map((contract) => (
                  <div key={contract.id} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-bold text-slate-900">{contract.id}</p>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        {contract.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-700">{contract.property}</p>
                    <p className="mt-1 text-xs text-slate-500">{contract.period}</p>
                  </div>
                ))}
              </div>
            </DrawerSection>
          )}

          {activeTab === 'deposits' && (
            <DrawerSection title="Lịch sử giao dịch">
              {landlord.deposits.length > 0 ? (
                <div className="space-y-3">
                  {landlord.deposits.map((deposit) => (
                    <div key={deposit.id} className="rounded-lg border border-slate-200 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{deposit.type}</p>
                          <p className="mt-1 text-xs text-slate-500">{deposit.id} · {deposit.date}</p>
                        </div>
                        <p className="text-sm font-bold text-emerald-700">{formatCurrency(deposit.amount)}</p>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{deposit.note}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                  Chưa có giao dịch tiền đảm bảo.
                </div>
              )}
            </DrawerSection>
          )}

          {activeTab === 'timeline' && (
            <DrawerSection title="Timeline hoạt động">
              <div className="space-y-0">
                {landlord.timeline.map((item, index) => (
                  <div key={`${item.time}-${item.title}`} className="relative flex gap-3 pb-5">
                    {index < landlord.timeline.length - 1 && (
                      <span className="absolute left-[9px] top-6 h-full w-px bg-slate-200" />
                    )}
                    <span className="relative mt-1 h-5 w-5 rounded-full border-4 border-white bg-blue-600 ring-1 ring-blue-200" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.time} · {item.by}</p>
                    </div>
                  </div>
                ))}
              </div>
            </DrawerSection>
          )}
        </div>
      </aside>
    </>
  )
}

export default function AdminChuNhaPage() {
  const [nameSearch, setNameSearch] = useState('')
  const [phoneSearch, setPhoneSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [districtFilter, setDistrictFilter] = useState('all')
  const [selectedLandlord, setSelectedLandlord] = useState(null)
  const [activeTab, setActiveTab] = useState('profile')

  const districts = useMemo(
    () => Array.from(new Set(LANDLORDS.map((landlord) => landlord.district))),
    [],
  )

  const filteredLandlords = useMemo(() => {
    const normalizedName = nameSearch.trim().toLowerCase()
    const normalizedPhone = phoneSearch.trim()

    return LANDLORDS.filter((landlord) => {
      const matchesName = !normalizedName ||
        landlord.name.toLowerCase().includes(normalizedName) ||
        landlord.id.toLowerCase().includes(normalizedName) ||
        landlord.email.toLowerCase().includes(normalizedName)
      const matchesPhone = !normalizedPhone || landlord.phone.includes(normalizedPhone)
      const matchesStatus = statusFilter === 'all' || landlord.status === statusFilter
      const matchesDistrict = districtFilter === 'all' || landlord.district === districtFilter

      return matchesName && matchesPhone && matchesStatus && matchesDistrict
    })
  }, [districtFilter, nameSearch, phoneSearch, statusFilter])

  const kpis = useMemo(() => {
    const activeLandlords = LANDLORDS.filter((landlord) => landlord.status === 'dang_hop_tac')
    const rentedLandlords = LANDLORDS.filter((landlord) => landlord.rentedProperties > 0)
    const activeContracts = LANDLORDS.reduce((sum, landlord) => sum + landlord.activeContracts, 0)

    return [
      { label: 'Tổng chủ nhà', value: LANDLORDS.length, detail: 'Hồ sơ đang quản lý', accent: 'bg-blue-100' },
      { label: 'Đang hợp tác', value: activeLandlords.length, detail: 'Chủ nhà còn hoạt động', accent: 'bg-emerald-100' },
      { label: 'Có nhà đang cho thuê', value: rentedLandlords.length, detail: 'Có ít nhất 1 BĐS đã thuê', accent: 'bg-amber-100' },
      { label: 'Hợp đồng ký gửi hiệu lực', value: activeContracts, detail: 'Tổng hợp đồng còn hiệu lực', accent: 'bg-indigo-100' },
    ]
  }, [])

  function openDrawer(landlord, tab = 'profile') {
    setSelectedLandlord(landlord)
    setActiveTab(tab)
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Quản lý chủ nhà</h1>
            <p className="mt-1 text-sm text-slate-500">Theo dõi chủ nhà và bất động sản ký gửi</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm chủ nhà
          </button>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.label} {...kpi} />
          ))}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Họ tên</span>
              <input
                value={nameSearch}
                onChange={(event) => setNameSearch(event.target.value)}
                placeholder="Tìm theo tên, mã, email"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Số điện thoại</span>
              <input
                value={phoneSearch}
                onChange={(event) => setPhoneSearch(event.target.value)}
                placeholder="Nhập SĐT"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Trạng thái hợp tác</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">Tất cả trạng thái</option>
                {Object.entries(STATUS_CONFIG).map(([value, config]) => (
                  <option key={value} value={value}>{config.label}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Quận/Huyện</span>
              <select
                value={districtFilter}
                onChange={(event) => setDistrictFilter(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">Tất cả khu vực</option>
                {districts.map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Danh sách chủ nhà</h2>
              <p className="text-sm text-slate-500">Hiển thị {filteredLandlords.length} hồ sơ phù hợp</p>
            </div>
            <button className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Xuất danh sách
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1080px] w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50">
                <tr>
                  {['Mã chủ nhà', 'Họ tên', 'SĐT', 'Email', 'Số BĐS ký gửi', 'Hợp đồng hiệu lực', 'Tiền đảm bảo', 'Trạng thái', 'Thao tác'].map((column) => (
                    <th key={column} className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredLandlords.map((landlord) => (
                  <tr key={landlord.id} className="transition hover:bg-slate-50">
                    <td className="px-4 py-4 text-sm font-bold text-slate-900">{landlord.id}</td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => openDrawer(landlord)}
                        className="flex items-center gap-3 text-left"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
                          {initials(landlord.name)}
                        </span>
                        <span>
                          <span className="block text-sm font-bold text-slate-900">{landlord.name}</span>
                          <span className="block text-xs text-slate-500">{landlord.district} · {landlord.manager}</span>
                        </span>
                      </button>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">{landlord.phone}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">{landlord.email}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-slate-900">{landlord.propertyCount}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-slate-900">{landlord.activeContracts}</td>
                    <td className="px-4 py-4 text-sm font-bold text-slate-900">{formatCurrency(landlord.depositAmount)}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={landlord.status} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <IconButton label="Chỉnh sửa" onClick={() => openDrawer(landlord, 'profile')}>
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M16.862 4.487l1.651-1.651a1.875 1.875 0 112.651 2.651L8.25 18.401 4 19l.599-4.25L16.862 4.487z" />
                          </svg>
                        </IconButton>
                        <IconButton label="Xem hợp đồng" onClick={() => openDrawer(landlord, 'contracts')}>
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.6L19 8.4V19a2 2 0 01-2 2z" />
                          </svg>
                        </IconButton>
                        <IconButton label="Liên hệ" onClick={() => openDrawer(landlord, 'profile')}>
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M3 5a2 2 0 012-2h2.3a1 1 0 01.95.68l1.1 3.3a1 1 0 01-.5 1.2l-1.5.75a11 11 0 005.72 5.72l.75-1.5a1 1 0 011.2-.5l3.3 1.1a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C8.82 21 3 15.18 3 8V5z" />
                          </svg>
                        </IconButton>
                        <IconButton label="Xem bất động sản" onClick={() => openDrawer(landlord, 'properties')}>
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M3 12l9-8 9 8M5 10.5V20h14v-9.5M9 20v-6h6v6" />
                          </svg>
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <LandlordDrawer
        landlord={selectedLandlord}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onClose={() => setSelectedLandlord(null)}
      />
    </main>
  )
}
