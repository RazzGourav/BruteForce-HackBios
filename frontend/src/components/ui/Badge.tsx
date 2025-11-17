import { cn, getRiskColor } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  risk?: 'low' | 'medium' | 'high' | 'critical'
  className?: string
}

export function Badge({ children, variant = 'default', risk, className }: BadgeProps) {
  const variantStyles = {
    default: 'bg-charcoal-100 text-charcoal-800 border-charcoal-300',
    success: 'bg-primary-100 text-primary-800 border-primary-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    danger: 'bg-red-100 text-red-800 border-red-300',
    info: 'bg-teal-100 text-teal-800 border-teal-300',
  }

  const styles = risk ? getRiskColor(risk) : variantStyles[variant]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium',
        styles,
        className
      )}
    >
      {children}
    </span>
  )
}
