"use client";

import { useEffect, useState } from "react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function StudentAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    fetch("/api/admin/announcements", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAnnouncements(data.announcements || []));
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-semibold text-indigo-700 mb-6">
        Announcements
      </h1>

      <div className="space-y-3 max-w-2xl">
        {announcements.map((a) => (
          <div key={a.id} className="bg-white rounded-lg shadow p-4">
            <h3 className="font-medium text-gray-900">{a.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{a.content}</p>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(a.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}