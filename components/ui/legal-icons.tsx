// 法律專業圖標組件
import { LucideProps } from 'lucide-react'

// Legal Mentor 主要 Logo
export function LegalMentorLogo({ className, ...props }: LucideProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* 天平圖案 - 代表法律公正 */}
      <path d="M12 2v20" />
      <path d="M8 6h8" />
      <path d="M6 10c0 2 2 4 4 4s4-2 4-4" />
      <path d="M14 10c0 2 2 4 4 4s4-2 4-4" />
      <circle cx="8" cy="10" r="2" />
      <circle cx="16" cy="10" r="2" />
      {/* AI 元素 - 代表智能 */}
      <path d="M12 2l2 2-2 2-2-2z" fill="currentColor" />
    </svg>
  )
}

// 法律研究圖標
export function LegalResearchIcon({ className, ...props }: LucideProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10,9 9,9 8,9" />
      <circle cx="12" cy="15" r="1" fill="currentColor" />
    </svg>
  )
}

// 合同分析圖標
export function ContractAnalysisIcon({ className, ...props }: LucideProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14,2 14,8 20,8" />
      <path d="M12 18v-6l3 3" />
      <path d="M12 12l-3 3" />
    </svg>
  )
}

// 案例法圖標
export function CaseLawIcon({ className, ...props }: LucideProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h8" />
      <path d="M8 11h8" />
      <path d="M8 15h6" />
      <circle cx="16" cy="15" r="1" fill="currentColor" />
    </svg>
  )
}

// 法規遵循圖標
export function ComplianceIcon({ className, ...props }: LucideProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}