// components/DashboardCard.tsx
import "./DashboardCard.css";

interface DashboardCardProps {
  user: string | null | undefined;
}

export default function DashboardCard({ user }: DashboardCardProps) {
  return (
    <div className="dashboard-card">
      <h1 className="dashboard-title">👋 Welcome, {user || "User"}</h1>
      <p className="dashboard-text">
        Use the sidebar to upload or view your videos.
      </p>
    </div>
  );
}
