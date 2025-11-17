import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { TopNav } from '@/components/TopNav'
import { SideNav } from '@/components/SideNav'
import { ToastProvider } from '@/components/ToastProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Pollu-Stake | Environmental Compliance & Green Credits',
  description:
    'On-chain environmental staking platform with AI-powered forecasting and GreenCredits rewards',
  keywords: ['blockchain', 'environment', 'compliance', 'staking', 'green credits'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <TopNav />
        <div className="flex min-h-[calc(100vh-4rem)]">
          <SideNav />
          <main className="flex-1 lg:ml-64">{children}</main>
        </div>
        <ToastProvider />
      </body>
    </html>
  )
}
