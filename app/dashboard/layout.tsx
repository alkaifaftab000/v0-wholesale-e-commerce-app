import type React from "react"
import { DashboardHeader } from "@/components/dashboard-header"
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FDF8F6]">
      <DashboardHeader />
      <main className="flex-1 px-4 py-8 md:px-6 lg:px-8">{children}</main>
    </div>
  )
}
