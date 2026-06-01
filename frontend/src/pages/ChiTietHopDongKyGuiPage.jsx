import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import hopDongKyGuiService from '../services/hopDongKyGuiService'
import contractService from '../services/contractService'
import { normalizeInternalRole, ROLE_GROUPS } from '../config/roles'

import { HOP_DONG_STATUS } from '../features/hop-dong-ky-gui/contractStatus'
import {
  mapContractToDetailView,
  formatDate,
  formatCurrency,
  getStatusConfig,
} from '../features/hop-dong-ky-gui/contractMappers'
import ContractWorkflowTimeline from '../features/hop-dong-ky-gui/ContractWorkflowTimeline'
import ContractActionPanel from '../features/hop-dong-ky-gui/ContractActionPanel'
import LegalDecisionModal from '../features/hop-dong-ky-gui/LegalDecisionModal'
import SignContractModal from '../features/hop-dong-ky-gui/SignContractModal'

export default function ChiTietHopDongKyGuiPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [contract, setContract] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [notice, setNotice] = useState('')

  // Modals
  const [legalModal, setLegalModal] = useState({ open: false, action: null })
  const [signModal, setSignModal] = useState({ open: false, role: null })

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  const roleGroup = normalizeInternalRole(userInfo?.role)
  const isChuNha = userInfo?.role === 'CHU_NHA'

  const fetchContract = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await hopDongKyGuiService.chiTiet(id)
      setContract(mapContractToDetailView(response.data))
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải hợp đồng')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchContract()
  }, [fetchContract])

  const handleAction = async (action) => {
    const contractId = Number(id)
    const c = contract

    setActionLoading(action)
    try {
      switch (action) {
        case 'approve':
        case 'reject':
        case 'request_edit':
          setLegalModal({ open: true, action, contractId })
          setActionLoading(null)
          return

        case 'submit_legal': {
          if (!window.confirm('Gửi hợp đồng này đến bộ phận pháp lý để duyệt?')) break
          await hopDongKyGuiService.guiPheDuyet(contractId)
          setNotice('Đã gửi duyệt pháp lý')
          break
        }

        case 'sign_owner':
        case 'sign_agency':
          setSignModal({ open: true, role: action === 'sign_owner' ? 'owner' : 'agency' })
          setActionLoading(null)
          return

        case 'delete': {
          if (c?.rawStatus !== 'NHAP') {
            alert('Chỉ có thể xóa hợp đồng ở trạng thái nháp')
            break
          }
          if (!window.confirm('Xác nhận xóa hợp đồng này?')) break
          await hopDongKyGuiService.xoa(contractId)
          navigate(-1)
          break
        }

        case 'extend':
          setNotice('Chức năng gia hạn đang phát triển')
          return

        default:
          setActionLoading(null)
          return
      }
      fetchContract()
    } catch (err) {
      setNotice(err.response?.data?.message || 'Thao tác thất bại')
    } finally {
      setActionLoading(null)
    }
  }

  const handleLegalSubmit = async (action, reason, note) => {
    const contractId = Number(id)
    try {
      switch (action) {
        case 'approve':
          await contractService.approveKyGuiContract(contractId, true)
          setNotice('Đã phê duyệt hợp đồng')
          break
        case 'reject':
          await contractService.approveKyGuiContract(contractId, false, reason || 'Không có lý do')
          setNotice('Đã từ chối hợp đồng')
          break
        case 'request_edit':
          await hopDongKyGuiService.yeuCauSua(contractId, { lyDo: reason, ghiChu: note })
          setNotice('Đã yêu cầu sửa hợp đồng')
          break
        default:
          return
      }
      setLegalModal({ open: false, action: null })
      fetchContract()
    } catch (err) {
      throw err
    }
  }

  const handleSign = async () => {
    const contractId = Number(id)
    try {
      if (signModal.role === 'owner') {
        await hopDongKyGuiService.kyChuNha(contractId)
        setNotice('Đã ký phía chủ nhà')
      } else {
        await hopDongKyGuiService.kyDaiLy(contractId)
        setNotice('Đã ký phía đại lý')
      }
      setSignModal({ open: false, role: null })
      fetchContract()
    } catch (err) {
      throw err
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Đang tải hợp đồng...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-2">{error}</p>
          <button
            onClick={fetchContract}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  if (!contract) return null

  const status = getStatusConfig(contract.trangThai)

  return (
    <>
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-blue-900">Chi tiết Hợp đồng Ký gửi</h1>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${status.color}`}>
            ● {status.label}
          </span>
        </div>
      </header>

      {/* Notice */}
      {notice && (
        <div className="mx-6 mt-4 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {notice}
          </span>
          <button onClick={() => setNotice('')} className="text-blue-500 hover:text-blue-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Page Content */}
      <main className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <p className="text-sm text-slate-500 mb-1">
            Mã hợp đồng:{' '}
            <span className="font-medium text-slate-700">{contract.maHopDong}</span>
          </p>
        </div>

        {/* Workflow Timeline */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Tiến trình xử lý</h3>
          <ContractWorkflowTimeline currentStep={contract.workflowStep} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Thông tin chung */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Thông tin chung
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Chủ nhà (Bên ký gửi)</p>
                  <p className="text-sm font-medium text-slate-800">{contract.chuNha.hoTen || '—'}</p>
                  {contract.chuNha.sdt && (
                    <p className="text-xs text-slate-500">SĐT: {contract.chuNha.sdt}</p>
                  )}
                  {contract.chuNha.email && (
                    <p className="text-xs text-slate-500">Email: {contract.chuNha.email}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Bất động sản</p>
                  <p className="text-sm font-medium text-slate-800">
                    {contract.batDongSan.ten || contract.batDongSan.diaChi || '—'}
                  </p>
                  <p className="text-xs text-slate-500">{contract.batDongSan.diaChi}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Tiền đảm bảo</p>
                  <p className="text-sm font-medium text-slate-800">
                    {formatCurrency(contract.tienDamBao)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Ngày bắt đầu</p>
                  <p className="text-sm font-medium text-slate-800">
                    {formatDate(contract.ngayBatDau)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Ngày kết thúc</p>
                  <p className="text-sm font-medium text-slate-800">
                    {formatDate(contract.ngayKetThuc)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Nhân viên phụ trách</p>
                  <p className="text-sm font-medium text-slate-800">{contract.nhanVien || '—'}</p>
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Tình trạng chữ ký
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`rounded-lg p-4 border ${
                    contract.chuKyChuNha ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <p className="text-xs font-semibold text-slate-600">Chủ nhà</p>
                  <p
                    className={`text-base font-medium mt-1 ${
                      contract.chuKyChuNha ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  >
                    {contract.chuKyChuNha ? '✅ Đã ký' : '⏳ Chưa ký'}
                  </p>
                </div>
                <div
                  className={`rounded-lg p-4 border ${
                    contract.chuKyDaiLy ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <p className="text-xs font-semibold text-slate-600">Đại lý</p>
                  <p
                    className={`text-base font-medium mt-1 ${
                      contract.chuKyDaiLy ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  >
                    {contract.chuKyDaiLy ? '✅ Đã ký' : '⏳ Chưa ký'}
                  </p>
                </div>
              </div>
              {contract.trangThaiBatDongSan && (
                <div className="mt-3 bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <p className="text-xs text-blue-600 font-medium">
                    Trạng thái BĐS: {contract.trangThaiBatDongSan}
                  </p>
                </div>
              )}
            </div>

            {/* Tài liệu đính kèm */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
                Tài liệu đính kèm
              </h3>
              {contract.taiLieuDinhKem.length === 0 ? (
                <div className="border border-dashed border-slate-300 rounded-lg p-4 text-center">
                  <svg className="w-10 h-10 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-xs text-slate-400">Chưa có tài liệu đính kèm</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {contract.taiLieuDinhKem.map((file, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-lg p-4 text-center hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-xs font-medium text-slate-700 truncate">{file.ten}</p>
                      <p className="text-xs text-slate-500 mt-1">{file.dungLuong}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Đánh giá Pháp lý */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                Đánh giá Pháp lý
              </h3>
              {contract.ketQuaPhapLy ? (
                <>
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        contract.ketQuaPhapLy.duyet ? 'bg-emerald-100' : 'bg-red-100'
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 ${contract.ketQuaPhapLy.duyet ? 'text-emerald-600' : 'text-red-600'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {contract.ketQuaPhapLy.duyet ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        )}
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {contract.ketQuaPhapLy.duyet ? 'Đã phê duyệt' : 'Từ chối'}
                      </p>
                      {contract.ketQuaPhapLy.lyDoTuChoi && (
                        <p className="text-xs text-slate-500">{contract.ketQuaPhapLy.lyDoTuChoi}</p>
                      )}
                    </div>
                  </div>
                  {contract.ketQuaPhapLy.ghiChu && (
                    <div className="bg-slate-50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-slate-500 mb-1">Ghi chú từ Bộ phận Pháp lý:</p>
                      <p className="text-sm text-slate-700">{contract.ketQuaPhapLy.ghiChu}</p>
                    </div>
                  )}
                  {contract.ketQuaPhapLy.tenNguoiDuyet && (
                    <div className="pt-3 border-t border-slate-100">
                      <p className="text-xs text-slate-500">Người duyệt:</p>
                      <p className="text-sm font-medium text-slate-700">
                        {contract.ketQuaPhapLy.tenNguoiDuyet}
                        {contract.ketQuaPhapLy.thoiGianDuyet &&
                          ` · ${formatDate(contract.ketQuaPhapLy.thoiGianDuyet)}`}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-slate-400 italic">Chưa có đánh giá pháp lý</p>
                </div>
              )}
            </div>

            {/* Lịch sử Hợp đồng */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Lịch sử Hợp đồng
              </h3>
              {contract.lichSu.length === 0 ? (
                <p className="text-sm text-slate-400 italic">Chưa có hoạt động</p>
              ) : (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
                  <div className="space-y-4">
                    {contract.lichSu.map((item, idx) => (
                      <div key={idx} className="relative flex gap-3 pl-8">
                        <div
                          className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                            item.daHoanThanh ? 'bg-blue-800 border-blue-800' : 'bg-white border-slate-300'
                          }`}
                        >
                          {item.daHoanThanh && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800">{item.buoc}</p>
                          <p className="text-xs text-slate-500">{item.nguoiThucHien}</p>
                          <p className="text-xs text-slate-400 mt-1">{item.thoiGian}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                Thao tác
              </h3>
              <ContractActionPanel
                rawStatus={contract.rawStatus}
                roleGroup={isChuNha ? 'OWNER' : roleGroup}
                onAction={handleAction}
                options={{
                  coDieuKhoanPhatSinh: false,
                  chuKyChuNha: contract.chuKyChuNha,
                  chuKyDaiLy: contract.chuKyDaiLy,
                }}
                actionLoading={actionLoading}
              />
              {isChuNha && (
                <div className="mt-3">
                  {!contract.chuKyChuNha && (
                    <button
                      onClick={() => {
                        setSignModal({ open: true, role: 'owner' })
                      }}
                      disabled={actionLoading === 'sign_owner'}
                      className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      {actionLoading === 'sign_owner' ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      )}
                      Ký hợp đồng (Chủ nhà)
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Legal decision modal */}
      {legalModal.open && (
        <LegalDecisionModal
          onClose={() => setLegalModal({ open: false, action: null })}
          onSubmit={handleLegalSubmit}
          action={legalModal.action}
          contractInfo={{
            ma: contract.maHopDong,
            chuNha: contract.chuNha.hoTen,
            batDongSan: contract.batDongSan.diaChi,
          }}
        />
      )}

      {/* Sign modal */}
      {signModal.open && (
        <SignContractModal
          onClose={() => setSignModal({ open: false, role: null })}
          onSign={handleSign}
          signingRole={signModal.role}
          userDisplayName={userInfo?.hoTen || ''}
          contractInfo={{
            ma: contract.maHopDong,
            chuNha: contract.chuNha.hoTen,
            batDongSan: contract.batDongSan.diaChi,
          }}
        />
      )}
    </>
  )
}
