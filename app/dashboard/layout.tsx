import Sidebar from "@/components/UI/Sidebar";
import ThemeToggle from "@/components/UI/ThemeToggle";
import "./layout.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout dark:bg-[#0f172a]">
      <Sidebar />
      <main className="dashboard-main">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        {children}
      </main>
    </div>
  );
}
