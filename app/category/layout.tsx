import type React from "react"
import { DashboardHeader } from "@/components/dashboard-header"

export default function CategoryLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col bg-[#FDF8F6]">
            <DashboardHeader />
            <main className="flex-1">{children}</main>
        </div>
    )
}
