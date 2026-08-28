"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Users,
  School,
  CalendarCheck,
  FileText,
  Wallet,
  TrendingUp,
} from "lucide-react";

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  attendancePercentage: number;
  pendingLeaves: number;
  feesCollected: number;
  feesPending: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      });
  }, [router]);

  if (loading) return <p className="p-8 text-gray-900">Loading...</p>;

  const cards = [
    {
      label: "Total Students",
      value: stats?.totalStudents,
      icon: GraduationCap,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Total Teachers",
      value: stats?.totalTeachers,
      icon: Users,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Total Classes",
      value: stats?.totalClasses,
      icon: School,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Attendance",
      value: `${stats?.attendancePercentage}%`,
      icon: CalendarCheck,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Pending Leaves",
      value: stats?.pendingLeaves,
      icon: FileText,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Fees Collected",
      value: `Rs ${stats?.feesCollected}`,
      icon: Wallet,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Fees Pending",
      value: `Rs ${stats?.feesPending}`,
      icon: TrendingUp,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Overview of your school's activity
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center mb-3`}>
                <Icon className={c.color} size={20} />
              </div>
              <p className="text-sm text-gray-500">{c.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{c.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}