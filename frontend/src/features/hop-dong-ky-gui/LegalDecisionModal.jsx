import { useState } from 'react'

/**
 * LegalDecisionModal — Modal for legal review actions:
 *   - Approve (phê duyệt)
 *   - Reject (từ chối) — requires reason
 *   - Request edit (yêu cầu sửa) — requires reason
 *
 * Props:
 *   onClose    — close modal
 *   onSubmit   — async (action, reason, note) => Promise<void>
 *   action     — 'approve' | 'reject' | 'request_edit'
 *   contractInfo — { ma, chuNha, batDongSan } for display
 */
export default function LegalDecisionModal({ onClose, onSubmit, action, contractInfo }) {
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const needsReason = action === 'reject' || action === 'request_edit'
  const isApprove = action === 'approve'

  const getTitle = () => {
    switch (action) {
      case 'approve':
        return 'Phê duyệt hợp đồng'
      case 'reject':
        return 'Từ chối hợp đồng'
      case 'request_edit':
        return 'Yêu cầu sửa hợp đồng'
      default:
        return 'Xử lý hợp đồng'
    }
  }

  const getDesc = () => {
    switch (action) {
      case 'approve':
        return 'Xác nhận phê duyệt hợp đồng này. Hợp đồng sẽ chuyển sang trạng thái chờ ký.'
      case 'reject':
        return 'Từ chối hợp đồng. Vui lòng nhập lý do từ chối.'
      case 'request_edit':
        return 'Yêu cầu sửa hợp đồng. Vui lòng mô tả nội dung cần sửa.'
      default:
        return ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (needsReason && !reason.trim()) {
      setError('Vui lòng nhập lý do')
      return
    }

    setLoading(true)
    try {
      await onSubmit(action, reason.trim(), note.trim())
    } catch (err) {
      setError(err.response?.data?.message || 'Thao tác thất bại')
      setLoading(false)
    }
  }

  const getButtonStyle = () => {
    switch (action) {
      case 'approve':
        return 'bg-emerald-600 hover:bg-emerald-700 text-white'
      case 'reject':
        return 'bg-red-600 hover:bg-red-700 text-white'
      case 'request_edit':
        return 'bg-orange-500 hover:bg-orange-600 text-white'
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{getTitle()}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{getDesc()}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contract info summary */}
        {contractInfo && (
          <div className="px-5 pt-4">
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Hợp đồng: <span className="font-semibold text-slate-700">{contractInfo.ma || '—'}</span></p>
              <p className="text-xs text-slate-500">Chủ nhà: <span className="font-medium text-slate-700">{contractInfo.chuNha || '—'}</span></p>
              {contractInfo.batDongSan && (
                <p className="text-xs text-slate-500 mt-0.5">BĐS: <span className="font-medium text-slate-700">{contractInfo.batDongSan}</span></p>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Reason (required for reject/request_edit) */}
          {needsReason && (
            <label>
              <span className="block text-xs font-semibold text-slate-600 mb-1.5">
                Lý do *
              </span>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={
                  action === 'reject'
                    ? 'Mô tả lý do từ chối hợp đồng...'
                    : 'Mô tả nội dung cần sửa...'
                }
                rows={4}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                required={needsReason}
              />
            </label>
          )}

          {/* Additional note (optional) */}
          {isApprove && (
            <label>
              <span className="block text-xs font-semibold text-slate-600 mb-1.5">
                Ghi chú (không bắt buộc)
              </span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nhập ghi chú pháp lý..."
                rows={3}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
              />
            </label>
          )}

          {needsReason && (
            <label>
              <span className="block text-xs font-semibold text-slate-600 mb-1.5">
                Ghi chú thêm (không bắt buộc)
              </span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Các ghi chú pháp lý khác..."
                rows={2}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
              />
            </label>
          )}

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getButtonStyle()}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang xử lý...
                </span>
              ) : isApprove ? (
                'Xác nhận phê duyệt'
              ) : action === 'reject' ? (
                'Xác nhận từ chối'
              ) : (
                'Gửi yêu cầu sửa'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
