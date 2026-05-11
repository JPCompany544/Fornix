import type { Metadata } from "next";
import FinorHeader from "@/components/dashboard/finor/FinorHeader";

export const metadata: Metadata = {
    title: "Command Center | Fornix Financial Operations",
    description: "Institutional-grade capital management and oversight dashboard.",
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen w-full bg-[#f8fbff] text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
            <FinorHeader />
            {children}
        </div>
    );
}
