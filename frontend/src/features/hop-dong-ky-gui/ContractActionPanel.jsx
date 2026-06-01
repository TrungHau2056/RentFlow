import { getAvailableActions } from './contractStatus'

/**
 * ContractActionPanel — Renders action buttons based on the contract's
 * raw status and the current user's role group.
 *
 * Props:
 *   rawStatus   — raw backend status string (e.g. 'NHAP', 'DA_PHE_DUYET')
 *   roleGroup   — normalized role group ('ADMIN', 'AGENCY', 'LEGAL')
 *   onAction    — (action: string) => void
 *   options     — { coDieuKhoanPhatSinh, chuKyChuNha, chuKyDaiLy }
 *   actionLoading — string | null (currently loading action name)
 */
export default function ContractActionPanel({
  rawStatus,
  roleGroup,
  onAction,
  options = {},
  actionLoading,
}) {
  const actions = getAvailableActions(rawStatus, roleGroup, options)

  if (actions.length === 0) return null

  const getButtonClass = (variant) => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700'
      case 'success':
        return 'bg-emerald-600 text-white hover:bg-emerald-700'
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700'
      case 'warning':
        return 'bg-orange-500 text-white hover:bg-orange-600'
      case 'secondary':
        return 'border border-slate-200 text-slate-700 hover:bg-slate-50'
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700'
    }
  }

  const getActionIcon = (action) => {
    switch (action) {
      case 'edit':
      case 'submit_legal':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        )
      case 'approve':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case 'reject':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      case 'request_edit':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        )
      case 'sign_owner':
      case 'sign_agency':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        )
      case 'delete':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        )
      case 'extend':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )
      default:
        return null
    }
  }

  const getLabel = (act) => {
    if (act.action === 'sign_owner') return 'Ký phía chủ nhà'
    if (act.action === 'sign_agency') return 'Ký phía đại lý'
    if (act.action === 'submit_legal') return 'Gửi pháp lý'
    return act.label
  }

  // Split actions into primary group and secondary/danger group
  const primaryActions = actions.filter((a) =>
    ['primary', 'success', 'warning'].includes(a.variant)
  )
  const secondaryActions = actions.filter((a) =>
    ['secondary', 'danger'].includes(a.variant)
  )

  return (
    <div className="space-y-2">
      {primaryActions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {primaryActions.map((act) => (
            <button
              key={act.action}
              onClick={() => onAction?.(act.action)}
              disabled={actionLoading === act.action}
              className={`flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getButtonClass(act.variant)}`}
            >
              {actionLoading === act.action ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                getActionIcon(act.action)
              )}
              {getLabel(act)}
            </button>
          ))}
        </div>
      )}
      {secondaryActions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {secondaryActions.map((act) => (
            <button
              key={act.action}
              onClick={() => onAction?.(act.action)}
              disabled={actionLoading === act.action}
              className={`flex-1 min-w-[100px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getButtonClass(act.variant)}`}
            >
              {actionLoading === act.action ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                getActionIcon(act.action)
              )}
              {getLabel(act)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
