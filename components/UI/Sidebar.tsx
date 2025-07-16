"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { UploadCloud, GalleryHorizontal, LogOut, Menu } from "lucide-react";
import "./Sidebar.css";

export default function Sidebar() {
  const [open, setOpen] = useState(false); // starts closed on mobile
  const { data: session } = useSession();

  return (
    <aside className={`sidebar ${open ? "open" : "collapsed"}`}>
      <div className="sidebar-header">
        <button className="menu-btn" onClick={() => setOpen(!open)}>
          <Menu size={24} />
        </button>
        {open && <h2 className="sidebar-title">🎬 Dashboard</h2>}
      </div>

      {open && (
        <>
          {session?.user?.name && (
            <p className="sidebar-user">
              Welcome, <span>{session.user.name}</span>
            </p>
          )}

          <nav className="sidebar-nav">
            <Link href="/dashboard" className="sidebar-link">
              🏠 Home
            </Link>
            <Link href="/dashboard/uploadVideo" className="sidebar-link">
              <UploadCloud size={18} /> Upload
            </Link>
            <Link href="/dashboard/gallery" className="sidebar-link">
              <GalleryHorizontal size={18} /> My Gallery
            </Link>
            {session?.user?.id && (
              <Link href={`/profile/${session.user.id}`} className="sidebar-link">
                👤 My Profile
              </Link>
            )}
            <Link href="/api/auth/signout" className="sidebar-link logout">
              <LogOut size={18} /> Logout
            </Link>
          </nav>
        </>
      )}
    </aside>
  );
}
