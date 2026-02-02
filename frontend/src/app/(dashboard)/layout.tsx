import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            <aside className=" shrink-0 h-full overflow-hidden bg-white">
                <Sidebar />
            </aside>

            <main className="flex-1 h-full overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
