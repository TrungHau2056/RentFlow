import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import baoCaoService from '../services/baoCaoService'



// ─── Helper: format VND ──────────────────────────────────────

function formatVND(amount) {
  if (amount >= 1000000000) return (amount / 1000000000).toFixed(1).replace(/\.0$/, '') + ' tỷ'
  if (amount >= 1000000) return (amount / 1000000).toFixed(0) + ' triệu'
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ'
}

// ─── Helper: format full VND (no abbreviation) for export ────

function formatFullVND(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

// ─── Helper: export CSV ──────────────────────────────────────

function exportToCSV(data, filename) {
  if (!data || data.length === 0) return
  const BOM = '\uFEFF'
  const csv = BOM + data.map(row =>
    row.map(cell => {
      const s = String(cell ?? '')
      return s.includes(',') || s.includes('"') || s.includes('\n')
        ? `"${s.replace(/"/g, '""')}"`
        : s
    }).join(',')
  ).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function KPICard({ icon, label, value, bgColor }) {
  return (
    <div className="bg-white rounded-xl border border-outline-variant p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-on-surface-variant mb-1">{label}</p>
          <p className="text-2xl font-bold text-on-surface">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function DonutChart({ data, size = 160, strokeWidth = 28 }) {
  if (!data || data.length === 0) {
    return <p className="text-sm text-on-surface-variant text-center py-4">Chưa có dữ liệu</p>
  }
  const total = data.reduce((sum, d) => sum + Number(d.count || d.value || 0), 0)
  if (total === 0) {
    return <p className="text-sm text-on-surface-variant text-center py-4">Chưa có dữ liệu</p>
  }
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const segments = data.reduce((acc, item) => {
    const val = Number(item.count || item.value || 0)
    const pct = val / total
    const dashArray = `${pct * circumference} ${(1 - pct) * circumference}`
    const dashOffset = -acc.offset * circumference

    return {
      offset: acc.offset + pct,
      items: [...acc.items, { ...item, pct, dashArray, dashOffset }],
    }
  }, { offset: 0, items: [] }).items

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} className="shrink-0">
        {segments.map((item, i) => (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={item.color}
            strokeWidth={strokeWidth}
            strokeDasharray={item.dashArray}
            strokeDashoffset={item.dashOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            className="transition-all duration-500"
          />
        ))}
        <text x={size / 2} y={size / 2 - 8} textAnchor="middle" className="text-2xl font-bold" fill="#051a3e">{total}</text>
        <text x={size / 2} y={size / 2 + 12} textAnchor="middle" className="text-xs" fill="#434654">tổng</text>
      </svg>
      <div className="space-y-2">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-on-surface-variant">{item.status || item.type}</span>
            <span className="text-sm font-medium text-on-surface ml-auto">{item.count || item.value}{item.count ? '' : '%'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}



// ─── Main Page ───────────────────────────────────────────────

export default function BaoCaoThongKePage() {
  const printRef = useRef(null)
  const [dateRange, setDateRange] = useState('thisYear')
  const [exportOpen, setExportOpen] = useState(false)
  const [format, setFormat] = useState('pdf')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [apiBdsThongKe, setApiBdsThongKe] = useState(null)
  const [apiDoanhThu, setApiDoanhThu] = useState(null)
  const [apiHieuSuat, setApiHieuSuat] = useState([])

  // ── New state for extended reports ──
  const [reportType, setReportType] = useState('tong-hop')
  const [filterKhuVuc, setFilterKhuVuc] = useState('')
  const [filterLoaiHinh, setFilterLoaiHinh] = useState('')
  const [apiHopDong, setApiHopDong] = useState(null)
  const [lichSuBaoCao, setLichSuBaoCao] = useState([])
  const [viewMode, setViewMode] = useState('bao-cao')
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    const now = new Date()
    let thang = now.getMonth() + 1
    let nam = now.getFullYear()

    // Map dateRange to thang/nam
    if (dateRange === 'lastMonth') {
      thang = thang === 1 ? 12 : thang - 1
      nam = thang === 12 ? nam - 1 : nam
    } else if (dateRange === 'thisQuarter') {
      thang = Math.floor((thang - 1) / 3) * 3 + 1
    } else if (dateRange === 'lastQuarter') {
      thang = thang - 3
      if (thang <= 0) { thang += 12; nam -= 1 }
      thang = Math.floor((thang - 1) / 3) * 3 + 1
    }
    // thisYear & all: keep current thang, nam; backend will use these

    try {
      let apiError = null
      const fetchBds = baoCaoService.thongKeBatDongSan(thang, nam).catch(err => {
        apiError = err; return null
      })
      const fetchDt = baoCaoService.doanhThuHoaHong(thang, nam).catch(err => {
        apiError = err; return null
      })
      const fetchHs = baoCaoService.hieuSuatMoiGioi(thang, nam).catch(err => {
        apiError = err; return null
      })

      const [bdsRes, dtRes, hsRes] = await Promise.all([fetchBds, fetchDt, fetchHs])
      if (bdsRes?.data) setApiBdsThongKe(bdsRes.data)
      if (dtRes?.data) setApiDoanhThu(dtRes.data)
      if (hsRes?.data && Array.isArray(hsRes.data)) setApiHieuSuat(hsRes.data)

      // Fetch hợp đồng
      if (reportType === 'hop-dong' || reportType === 'tong-hop') {
        const hdRes = await baoCaoService.baoCaoHopDong(thang, nam).catch(err => {
          apiError = err; return null
        })
        if (hdRes?.data) setApiHopDong(hdRes.data)
      }

      // Fetch lịch sử (independent)
      if (viewMode === 'lich-su') {
        const lsRes = await baoCaoService.lichSuBaoCao().catch(err => {
          apiError = err; return null
        })
        if (lsRes?.data && Array.isArray(lsRes.data)) setLichSuBaoCao(lsRes.data)
      }

      if (apiError) setError('Không thể tải một số dữ liệu báo cáo')
    } catch (err) {
      console.error('Failed to fetch report data:', err)
      setError('Không thể tải dữ liệu báo cáo')
    } finally {
      setLoading(false)
    }
  }, [dateRange, reportType, viewMode])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // ── Derived values (must be before handlers that reference them) ──
  const totalRevenue = useMemo(() => {
    if (apiDoanhThu) return apiDoanhThu.tongDaThanhToan + apiDoanhThu.tongChuaThanhToan
    return 0
  }, [apiDoanhThu])

  const totalCommission = useMemo(() => {
    if (apiDoanhThu) return apiDoanhThu.tongHoaHong
    return 0
  }, [apiDoanhThu])

  const activeProperties = apiBdsThongKe ? Number(apiBdsThongKe.soNhaDangKyGui) : 0

  const propertyStatus = useMemo(() => {
    if (apiBdsThongKe) {
      return [
        { status: 'Đang cho thuê', count: Number(apiBdsThongKe.soNhaDaChoThue) || 0, color: '#10b981' },
        { status: 'Đang ký gửi', count: Number(apiBdsThongKe.soNhaDangKyGui) || 0, color: '#3b82f6' },
        { status: 'Sắp hết hạn', count: Number(apiBdsThongKe.soHopDongSapHetHan) || 0, color: '#f59e0b' },
      ]
    }
    return []
  }, [apiBdsThongKe])

  const topBrokers = useMemo(() => {
    if (apiHieuSuat.length > 0) {
      return apiHieuSuat.map((hs) => ({
        id: hs.nhanVienId,
        name: hs.hoTen,
        avatar: null,
        contracts: Number(hs.soHopDongDaChot),
        commission: Number(hs.tongHoaHongNhan),
        amountPaid: Number(hs.tongDaThanhToan),
        rate: Number(hs.tyLeChot) || 0,
        rank: Number(hs.hang) || 0,
      }))
    }
    return []
  }, [apiHieuSuat])

  // ── Export Excel (CSV) ───────────────────────────────────────
  const handleExportExcel = useCallback(() => {
    const thongKe = apiBdsThongKe
    const hieuSuat = apiHieuSuat
    const revenue = totalRevenue
    const commission = totalCommission
    const active = activeProperties
    const statuses = propertyStatus
    const rows = []

    rows.push(['--- BÁO CÁO THỐNG KÊ ---', '', '', '', ''])
    rows.push([''])

    rows.push(['CHỈ SỐ KPI', 'Giá trị', '', '', ''])
    rows.push(['Tổng doanh thu', formatFullVND(revenue)])
    rows.push(['BĐS đang ký gửi', String(active)])
    rows.push(['BĐS đang cho thuê', thongKe ? String(thongKe.soNhaDaChoThue) : '0'])
    rows.push(['Hoa hồng', formatFullVND(commission)])
    rows.push([''])

    rows.push(['BẤT ĐỘNG SẢN THEO TRẠNG THÁI', 'Số lượng', '', '', ''])
    statuses.forEach(p => {
      rows.push([p.status, String(p.count)])
    })
    rows.push([''])

    // Hợp đồng section
    if (apiHopDong) {
      rows.push(['BÁO CÁO HỢP ĐỒNG', 'Số lượng', '', '', ''])
      rows.push(['Tổng HĐ ký gửi', String(apiHopDong.tongHopDongKyGui ?? 0)])
      rows.push(['HĐ ký gửi còn hiệu lực', String(apiHopDong.hopDongKyGuiConHieuLuc ?? 0)])
      rows.push(['HĐ ký gửi hết hạn', String(apiHopDong.hopDongKyGuiHetHan ?? 0)])
      rows.push(['Tổng HĐ thuê', String(apiHopDong.tongHopDongThue ?? 0)])
      rows.push(['HĐ thuê mới', String(apiHopDong.hopDongThueMoi ?? 0)])
      rows.push(['HĐ thuê đang hoạt động', String(apiHopDong.hopDongThueDangHoatDong ?? 0)])
      rows.push(['HĐ thuê kết thúc', String(apiHopDong.hopDongThueKetThuc ?? 0)])
      rows.push([''])
    }

    if (hieuSuat.length > 0) {
      rows.push(['HIỆU SUẤT MÔI GIỚI', 'Hợp đồng', 'Đã thanh toán', 'Hoa hồng', 'Tỷ lệ chốt'])
      hieuSuat.forEach(hs => {
        rows.push([
          hs.hoTen,
          String(hs.soHopDongDaChot),
          formatFullVND(Number(hs.tongDaThanhToan)),
          formatFullVND(Number(hs.tongHoaHongNhan)),
          (Number(hs.tyLeChot) || 0) + '%',
        ])
      })
    }

    const now = new Date()
    const ts = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
    exportToCSV(rows, `bao-cao-thong-ke-${ts}.csv`)
  }, [apiBdsThongKe, apiHieuSuat, apiHopDong, totalRevenue, totalCommission, activeProperties, propertyStatus])

  // ── Export PDF (same as print) ───────────────────────────────
  const handleExportPDF = useCallback(() => {
    window.print()
  }, [])

  // ── Lưu báo cáo ─────────────────────────────────────────────
  const handleLuuBaoCao = useCallback(async () => {
    const now = new Date()
    const thang = now.getMonth() + 1
    const nam = now.getFullYear()
    setSaving(true)
    try {
      const data = {
        loaiBaoCao: reportType.toUpperCase(),
        noiDung: JSON.stringify({
          batDongSan: apiBdsThongKe,
          doanhThu: apiDoanhThu,
          hieuSuat: apiHieuSuat,
          hopDong: apiHopDong,
        }),
        thang,
        nam,
      }
      await baoCaoService.luuBaoCao(data)
      alert('Đã lưu báo cáo thành công!')
    } catch (err) {
      console.error('Failed to save report:', err)
      alert('Không thể lưu báo cáo. Vui lòng thử lại.')
    } finally {
      setSaving(false)
    }
  }, [reportType, apiBdsThongKe, apiDoanhThu, apiHieuSuat, apiHopDong])

  // ── Send email (copy to clipboard) ───────────────────────────
  const handleSendEmail = useCallback(() => {
    const revenue = totalRevenue
    const active = activeProperties
    const commission = totalCommission
    const reportSummary =
      `RentFlow - Báo cáo thống kê\n` +
      `Kỳ: ${dateRange}\n` +
      `Tổng doanh thu: ${formatVND(revenue)}\n` +
      `BĐS đang ký gửi: ${active}\n` +
      `BĐS đang cho thuê: ${apiBdsThongKe ? apiBdsThongKe.soNhaDaChoThue : 0}\n` +
      `Hoa hồng: ${formatVND(commission)}`
    navigator.clipboard.writeText(reportSummary).then(() => {
      alert('Đã sao chép tóm tắt báo cáo vào clipboard. Hãy dán vào email của bạn.')
    }).catch(() => {
      alert('Không thể sao chép. Vui lòng tự soạn email với nội dung báo cáo.')
    })
  }, [dateRange, totalRevenue, activeProperties, apiBdsThongKe, totalCommission])

  return (
    <div className="min-h-screen bg-surface">
      {/* ── Print header (only visible when printing) ── */}
      <div className="print-header">
        <h1>RentFlow - Báo cáo & Thống kê</h1>
        <p>Ngày xuất: {new Date().toLocaleDateString('vi-VN')} | Kỳ: {dateRange}</p>
      </div>

      {/* Header */}
      <div className="bg-surface-container-lowest border-b border-outline-variant px-6 py-4 no-print">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-on-surface">Báo cáo & Thống kê</h1>
            <p className="text-sm text-on-surface-variant mt-1 flex items-center gap-2">
              {loading && (
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full inline-block animate-spin" />
                  Đang tải...
                </span>
              )}
              {!loading && 'Phân tích hoạt động và hiệu suất hệ thống'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode(viewMode === 'bao-cao' ? 'lich-su' : 'bao-cao')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'lich-su'
                  ? 'bg-primary-container text-white'
                  : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <svg className="w-4 h-4 inline-block mr-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {viewMode === 'lich-su' ? 'Báo cáo' : 'Lịch sử'}
            </button>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-outline-variant rounded-lg text-sm text-on-surface bg-white focus:outline-none focus:ring-2 focus:ring-primary-container/20"
            >
              <option value="thisMonth">Tháng này</option>
              <option value="lastMonth">Tháng trước</option>
              <option value="thisQuarter">Quý này</option>
              <option value="lastQuarter">Quý trước</option>
              <option value="thisYear">Năm nay</option>
              <option value="all">Tất cả</option>
            </select>
            <div className="relative">
              <button
                onClick={() => setExportOpen(!exportOpen)}
                className="px-4 py-2 bg-primary-container text-white rounded-lg hover:bg-primary-container/90 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Xuất báo cáo
              </button>
              {exportOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-outline-variant rounded-lg shadow-lg py-1 z-10 min-w-40">
                  <button onClick={handleExportPDF} className="w-full px-4 py-2 text-sm text-left text-on-surface hover:bg-surface-container-low flex items-center gap-2">
                    <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Xuất PDF
                  </button>
                  <button onClick={handleExportExcel} className="w-full px-4 py-2 text-sm text-left text-on-surface hover:bg-surface-container-low flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Xuất Excel
                  </button>
                  <div className="border-t border-outline-variant my-1" />
                  <button onClick={handleLuuBaoCao} disabled={saving} className="w-full px-4 py-2 text-sm text-left text-on-surface hover:bg-surface-container-low flex items-center gap-2 disabled:opacity-50">
                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    {saving ? 'Đang lưu...' : 'Lưu báo cáo'}
                  </button>
                  <button onClick={handleSendEmail} className="w-full px-4 py-2 text-sm text-left text-on-surface hover:bg-surface-container-low flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Gửi email báo cáo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6" ref={printRef}>
        {/* Print-only title */}
        <div className="print-only">
          <h2 className="text-xl font-bold text-on-surface mb-2">Báo cáo thống kê</h2>
          <p className="text-sm text-on-surface-variant mb-6">
            Kỳ: {dateRange === 'thisMonth' ? 'Tháng này' : dateRange === 'lastMonth' ? 'Tháng trước' : dateRange === 'thisQuarter' ? 'Quý này' : dateRange === 'lastQuarter' ? 'Quý trước' : dateRange === 'thisYear' ? 'Năm nay' : 'Tất cả'}
          </p>
        </div>

        {/* Tab Navigation */}
        {viewMode === 'bao-cao' && (
          <div className="flex items-center gap-1 bg-surface-container-low rounded-lg p-1 no-print">
            {[
              { key: 'tong-hop', label: 'Tổng hợp' },
              { key: 'bat-dong-san', label: 'BĐS' },
              { key: 'hop-dong', label: 'Hợp đồng' },
              { key: 'doanh-thu', label: 'Doanh thu' },
              { key: 'hieu-suat', label: 'Hiệu suất' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setReportType(tab.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  reportType === tab.key
                    ? 'bg-white text-on-surface shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* History View */}
        {viewMode === 'lich-su' && (
          <div className="bg-white rounded-xl border border-outline-variant p-6 no-print">
            <h3 className="text-base font-semibold text-on-surface mb-4">Lịch sử báo cáo đã lưu</h3>
            {lichSuBaoCao.length === 0 ? (
              <p className="text-sm text-on-surface-variant text-center py-8">Chưa có báo cáo nào được lưu</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-outline-variant">
                      <th className="pb-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">STT</th>
                      <th className="pb-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Loại báo cáo</th>
                      <th className="pb-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Kỳ</th>
                      <th className="pb-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Ngày tạo</th>
                      <th className="pb-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {lichSuBaoCao.map((bc, idx) => (
                      <tr key={bc.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-3 text-sm text-on-surface">{idx + 1}</td>
                        <td className="py-3 text-sm font-medium text-on-surface">{bc.loaiBaoCao}</td>
                        <td className="py-3 text-sm text-on-surface">Tháng {bc.thang}/{bc.nam}</td>
                        <td className="py-3 text-sm text-on-surface">{new Date(bc.ngayTao).toLocaleDateString('vi-VN')}</td>
                        <td className="py-3">
                          <button
                            onClick={async () => {
                              try {
                                const res = await baoCaoService.chiTietBaoCao(bc.id)
                                if (res?.data) {
                                  alert('Nội dung báo cáo:\n' + JSON.stringify(res.data, null, 2))
                                }
                              } catch {
                                alert('Không thể tải chi tiết báo cáo.')
                              }
                            }}
                            className="text-sm text-primary-container hover:underline"
                          >
                            Xem
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Filter: Khu vực, Loại hình (only for BĐS tab) */}
        {viewMode === 'bao-cao' && reportType === 'bat-dong-san' && (
          <div className="flex items-center gap-3 no-print flex-wrap">
            <select
              value={filterKhuVuc}
              onChange={(e) => setFilterKhuVuc(e.target.value)}
              className="px-3 py-2 border border-outline-variant rounded-lg text-sm text-on-surface bg-white focus:outline-none focus:ring-2 focus:ring-primary-container/20"
            >
              <option value="">Tất cả khu vực</option>
              <option value="Quận 1">Quận 1</option>
              <option value="Quận 2">Quận 2</option>
              <option value="Quận 3">Quận 3</option>
              <option value="Quận 7">Quận 7</option>
              <option value="Quận Bình Thạnh">Bình Thạnh</option>
            </select>
            <select
              value={filterLoaiHinh}
              onChange={(e) => setFilterLoaiHinh(e.target.value)}
              className="px-3 py-2 border border-outline-variant rounded-lg text-sm text-on-surface bg-white focus:outline-none focus:ring-2 focus:ring-primary-container/20"
            >
              <option value="">Tất cả loại hình</option>
              <option value="Căn hộ">Căn hộ</option>
              <option value="Nhà phố">Nhà phố</option>
              <option value="Biệt thự">Biệt thự</option>
              <option value="Đất nền">Đất nền</option>
            </select>
          </div>
        )}

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print-grid-4">
          <KPICard
            icon={<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            label="Tổng doanh thu"
            value={formatVND(totalRevenue)}
            bgColor="bg-blue-50"
          />
          <KPICard
            icon={<svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
            label="BDS đang ký gửi"
            value={activeProperties}
            bgColor="bg-amber-50"
          />
          <KPICard
            icon={<svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            label="BDS đang cho thuê"
            value={apiBdsThongKe ? Number(apiBdsThongKe.soNhaDaChoThue) : 0}
            bgColor="bg-emerald-50"
          />
          <KPICard
            icon={<svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>}
            label={apiDoanhThu ? `HH tháng ${apiDoanhThu.thang}/${apiDoanhThu.nam}` : 'Hoa hồng MG'}
            value={formatVND(totalCommission)}
            bgColor="bg-orange-50"
          />
        </div>

        {/* Báo cáo hợp đồng section */}
        {viewMode === 'bao-cao' && (reportType === 'hop-dong' || reportType === 'tong-hop') && apiHopDong && (
          <div>
            <h3 className="text-base font-semibold text-on-surface mb-4">Báo cáo hợp đồng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard
                icon={<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                label="Tổng HĐ ký gửi"
                value={apiHopDong.tongHopDongKyGui ?? 0}
                bgColor="bg-blue-50"
              />
              <KPICard
                icon={<svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                label="HĐ ký gửi còn hiệu lực"
                value={apiHopDong.hopDongKyGuiConHieuLuc ?? 0}
                bgColor="bg-emerald-50"
              />
              <KPICard
                icon={<svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}
                label="Tổng HĐ thuê"
                value={apiHopDong.tongHopDongThue ?? 0}
                bgColor="bg-indigo-50"
              />
              <KPICard
                icon={<svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                label="HĐ thuê đang hoạt động"
                value={apiHopDong.hopDongThueDangHoatDong ?? 0}
                bgColor="bg-orange-50"
              />
            </div>
          </div>
        )}

        {/* Property Status — only show for tong-hop or bat-dong-san */}
        {(reportType === 'tong-hop' || reportType === 'bat-dong-san') && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-outline-variant p-6">
            <h3 className="text-base font-semibold text-on-surface mb-4">Bất động sản theo trạng thái</h3>
            <DonutChart data={propertyStatus} size={160} strokeWidth={28} />
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-on-surface">
                  {propertyStatus.reduce((s, p) => s + p.count, 0) > 0
                    ? Math.round((propertyStatus[0].count / propertyStatus.reduce((s, p) => s + p.count, 0)) * 100) + '%'
                    : '0%'}
                </p>
                <p className="text-xs text-on-surface-variant mt-1">Tỷ lệ cho thuê</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-amber-600">
                  {propertyStatus.find(p => p.status === 'Sắp hết hạn')?.count || 0}
                </p>
                <p className="text-xs text-on-surface-variant mt-1">BDS sắp hết hạn</p>
              </div>
            </div>
          </div>

          {/* Broker Performance */}
          <div className="bg-white rounded-xl border border-outline-variant p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-on-surface">Hiệu suất môi giới</h3>
                <p className="text-sm text-on-surface-variant mt-0.5">Top môi giới theo hợp đồng và tỷ lệ chốt</p>
              </div>
            </div>

            {topBrokers.length === 0 ? (
              <p className="text-sm text-on-surface-variant text-center py-8">Chưa có dữ liệu môi giới</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-outline-variant">
                      <th className="pb-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Hạng</th>
                      <th className="pb-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Môi giới</th>
                      <th className="pb-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Hợp đồng</th>
                      <th className="pb-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Tỷ lệ chốt</th>
                      <th className="pb-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Đã thanh toán</th>
                      <th className="pb-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Hoa hồng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {topBrokers.map((broker, i) => (
                      <tr key={broker.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-3">
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-slate-200 text-slate-600' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-50 text-slate-400'
                          }`}>{broker.rank || (i + 1)}</span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary-container/10 flex items-center justify-center text-sm font-semibold text-primary-container">
                              {broker.name.split(' ').map(n => n[0]).join('').slice(-2)}
                            </div>
                            <span className="text-sm font-medium text-on-surface">{broker.name}</span>
                          </div>
                        </td>
                        <td className="py-3 text-sm text-on-surface font-medium">{broker.contracts}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-100 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  broker.rate >= 80 ? 'bg-emerald-500' : broker.rate >= 50 ? 'bg-amber-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${Math.min(broker.rate, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-on-surface w-10 text-right">{broker.rate}%</span>
                          </div>
                        </td>
                        <td className="py-3 text-sm text-on-surface">{formatVND(broker.amountPaid)}</td>
                        <td className="py-3 text-sm text-on-surface">{formatVND(broker.commission)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Report Generation */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 no-print">
          <h3 className="text-base font-semibold text-on-surface mb-4">Lập báo cáo</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="text-sm font-medium text-on-surface-variant">Khoảng thời gian</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-outline-variant rounded-lg text-sm text-on-surface bg-white focus:outline-none focus:ring-2 focus:ring-primary-container/20"
              >
                <option value="thisMonth">Tháng này</option>
                <option value="lastMonth">Tháng trước</option>
                <option value="thisQuarter">Quý này</option>
                <option value="lastQuarter">Quý trước</option>
                <option value="thisYear">Năm nay</option>
                <option value="all">Tất cả</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface-variant">Loại báo cáo</label>
              <select className="w-full mt-1 px-3 py-2 border border-outline-variant rounded-lg text-sm text-on-surface bg-white focus:outline-none focus:ring-2 focus:ring-primary-container/20">
                <option>Tổng hợp hoạt động</option>
                <option>Doanh thu</option>
                <option>Hiệu suất môi giới</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface-variant">Định dạng xuất</label>
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => setFormat('pdf')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    format === 'pdf'
                      ? 'border-2 border-blue-500 bg-blue-50 text-blue-700'
                      : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <svg className="w-4 h-4 inline-block mr-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  PDF
                </button>
                <button
                  onClick={() => setFormat('excel')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    format === 'excel'
                      ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <svg className="w-4 h-4 inline-block mr-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Excel
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface-variant">Gửi email</label>
              <button onClick={handleSendEmail} className="w-full mt-1 px-3 py-2 border border-outline-variant text-on-surface rounded-lg text-sm font-medium hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Sao chép & Gửi
              </button>
            </div>
            <div>
              <button
                onClick={format === 'pdf' ? handleExportPDF : handleExportExcel}
                className="w-full px-4 py-2.5 bg-primary-container text-white rounded-lg text-sm font-medium hover:bg-primary-container/90 transition-colors flex items-center justify-center gap-2"
              >
                {format === 'pdf' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
                {format === 'pdf' ? 'In báo cáo' : 'Xuất Excel'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Print footer (only visible when printing) ── */}
      <div className="print-footer">
        <p>RentFlow - Hệ thống quản lý môi giới bất động sản</p>
      </div>

      {/* ── Print styles ── */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .print-header { display: block !important; text-align: center; padding: 20px 0 10px; border-bottom: 2px solid #003d9b; margin-bottom: 16px; }
          .print-header h1 { font-size: 20px; font-weight: 700; margin: 0; color: #003d9b; }
          .print-header p { font-size: 11px; color: #555; margin: 4px 0 0; }
          .print-footer { display: block !important; text-align: center; font-size: 9px; color: #999; padding: 8px 0; border-top: 1px solid #ddd; position: fixed; bottom: 0; left: 0; right: 0; }
          .print-grid-4 { grid-template-columns: repeat(4, 1fr) !important; }
          .group { break-inside: avoid; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; font-size: 12px; }
          .min-h-screen { min-height: auto !important; }
          .bg-surface { background: white !important; }
          * { box-shadow: none !important; }
          .hover\\:shadow-lg { box-shadow: none !important; }
          .hover\\:-translate-y-0\\.5 { transform: none !important; }
          @page { margin: 15mm 20mm; }
          svg { max-width: 100%; }
          table { font-size: 11px; }
          th, td { padding: 6px 8px !important; }
          .divide-y\\/\\* > * + * { border-top: 1px solid #e5e7eb; }
        }
        @media screen {
          .print-only { display: none !important; }
          .print-header { display: none !important; }
          .print-footer { display: none !important; }
        }
      `}</style>
    </div>
  )
}
