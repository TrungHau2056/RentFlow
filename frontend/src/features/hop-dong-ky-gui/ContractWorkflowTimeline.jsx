import { WORKFLOW_STEPS } from './contractStatus'

/**
 * ContractWorkflowTimeline — 6-step timeline according to spec:
 *   1. Soạn thảo → 2. Kiểm tra ĐK → 3. Pháp lý → 4. KQ pháp lý → 5. Ký kết → 6. Hiệu lực
 *
 * @param {number} currentStep — step number (1-6) derived from WORKFLOW_MAP
 */
export default function ContractWorkflowTimeline({ currentStep }) {
  if (currentStep == null) return null

  return (
    <div className="flex items-center">
      {WORKFLOW_STEPS.map((step, i) => {
        const stepNum = step.step
        const isActive = stepNum <= currentStep
        const isCurrent = stepNum === currentStep
        const isLast = i === WORKFLOW_STEPS.length - 1
        return (
          <div key={step.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold transition-colors ${
                  isActive
                    ? isCurrent
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                      : 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {isActive && !isCurrent ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={`text-[9px] mt-1.5 text-center leading-tight whitespace-nowrap ${
                  isCurrent
                    ? 'text-amber-700 font-semibold'
                    : isActive
                    ? 'text-blue-600 font-medium'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`flex-1 h-0.5 mx-1 rounded-full ${
                  stepNum < currentStep ? 'bg-blue-500' : 'bg-slate-200'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
