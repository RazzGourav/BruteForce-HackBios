'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Factory,
  AlertTriangle,
  Coins,
  Vote,
  Settings,
  FileText,
  TrendingUp,
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const adminNav: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Factories', href: '/admin/factories', icon: Factory },
  { label: 'Slash Monitor', href: '/admin/slash-monitor', icon: AlertTriangle },
  { label: 'Treasury', href: '/admin/treasury', icon: Coins },
  { label: 'Governance', href: '/admin/governance', icon: Vote },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

const factoryNav: NavItem[] = [
  { label: 'Dashboard', href: '/factory', icon: LayoutDashboard },
  { label: 'Stake Management', href: '/factory/stake', icon: Coins },
  { label: 'Forecasts', href: '/factory/forecasts', icon: TrendingUp },
  { label: 'Slash History', href: '/factory/history', icon: AlertTriangle },
  { label: 'Compliance', href: '/factory/compliance', icon: FileText },
]

export function SideNav() {
  const pathname = usePathname()
  const { isSidebarOpen } = useStore()

  const isAdmin = pathname.startsWith('/admin')
  const isFactory = pathname.startsWith('/factory')

  if (!isAdmin && !isFactory) {
    return null
  }

  const navItems = isAdmin ? adminNav : factoryNav

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 border-r border-charcoal-200 bg-white transition-transform duration-300',
          'lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="flex h-full flex-col gap-2 overflow-y-auto p-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-100 text-primary-900'
                    : 'text-charcoal-700 hover:bg-charcoal-100'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
