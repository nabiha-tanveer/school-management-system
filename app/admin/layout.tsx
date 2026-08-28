"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Wallet,
  CalendarClock,
  Megaphone,
  FileText,
  LogOut,
  School,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Classes", href: "/admin/classes", icon: School },
  { label: "Students", href: "/admin/students", icon: GraduationCap },
  { label: "Fees", href: "/admin/fees", icon: Wallet },
  { label: "Timetable", href: "/admin/timetable", icon: CalendarClock },
  { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
  { label: "Leave Requests", href: "/admin/leave", icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-100">
          <Users className="text-indigo-600" size={22} />
          <span className="text-lg font-bold text-gray-900">ClassBridge</span>
        </div>

        <div className="px-6 py-3">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Admin Panel
          </span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-indigo-50 text-indigo-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

                <div className="border-t border-gray-100 p-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}