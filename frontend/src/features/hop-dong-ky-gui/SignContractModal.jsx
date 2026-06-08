import { useState } from 'react'

/**
 * SignContractModal — Confirmation modal for signing a contract.
 * Supports two signing roles: owner (chủ nhà) and agency (đại lý).
 *
 * Props:
 *   onClose          — close modal
 *   onSign           — async () => Promise<void>
 *   signingRole      — 'owner' | 'agency'
 *   contractInfo     — { ma, chuNha, batDongSan }
 *   userDisplayName  — name of the signing user for confirmation display
 */
export default function SignContractModal({
  onClose,
  onSign,
  signingRole,
  contractInfo,
  userDisplayName,
}) {
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isOwner = signingRole === 'owner'
  const roleLabel = isOwner ? 'Chủ nhà' : 'Đại lý'
  const title = `${isOwner ? 'Chủ nhà' : 'Đại lý'} ký hợp đồng`
  const desc = isOwner
    ? 'Xác nhận ký kết hợp đồng ký gửi. Sau khi ký, hợp đồng sẽ có hiệu lực sau khi đại lý ký.'
    : 'Xác nhận ký kết hợp đồng ký gửi phía đại lý. Sau khi ký, hợp đồng sẽ có hiệu lực nếu chủ nhà đã ký.'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!confirmed) return

    setLoading(true)
    setError('')
    try {
      await onSign()
    } catch (err) {
      setError(err.response?.data?.message || 'Ký hợp đồng thất bại')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
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

        {/* Contract info */}
        {contractInfo && (
          <div className="px-5 pt-4">
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <p className="text-xs text-slate-500 mb-0.5">
                Hợp đồng: <span className="font-semibold text-slate-700">{contractInfo.ma || '—'}</span>
              </p>
              <p className="text-xs text-slate-500 mb-0.5">
                Chủ nhà: <span className="font-medium text-slate-700">{contractInfo.chuNha || '—'}</span>
              </p>
              {contractInfo.batDongSan && (
                <p className="text-xs text-slate-500">
                  BĐS: <span className="font-medium text-slate-700">{contractInfo.batDongSan}</span>
                </p>
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

          {/* Confirmation */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Tôi xác nhận ký kết hợp đồng với tư cách <span className="font-bold">{roleLabel}</span>
                </p>
                <p className="text-xs text-blue-600 mt-0.5">
                  Người ký: <span className="font-semibold">{userDisplayName || '—'}</span>
                </p>
                <p className="text-xs text-blue-500 mt-1">
                  Hành động này không thể hoàn tác. Sau khi ký, hợp đồng sẽ được cập nhật trạng thái.
                </p>
              </div>
            </label>
          </div>

          {/* Signatures status */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-lg p-3 border text-center ${
              isOwner ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-slate-50'
            }`}>
              <p className="text-xs font-semibold text-slate-600">Chủ nhà</p>
              <p className={`text-sm font-medium mt-1 ${isOwner ? 'text-blue-700' : 'text-slate-400'}`}>
                {isOwner ? 'Chưa ký' : '—'}
              </p>
            </div>
            <div className={`rounded-lg p-3 border text-center ${
              !isOwner ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-slate-50'
            }`}>
              <p className="text-xs font-semibold text-slate-600">Đại lý</p>
              <p className={`text-sm font-medium mt-1 ${!isOwner ? 'text-blue-700' : 'text-slate-400'}`}>
                {!isOwner ? 'Chưa ký' : '—'}
              </p>
            </div>
          </div>

          {/* Actions */}
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
              disabled={!confirmed || loading}
              className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang ký...
                </span>
              ) : (
                `Xác nhận ký (${roleLabel})`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
