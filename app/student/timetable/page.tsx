"use client";

import { useEffect, useState } from "react";

interface TimetableEntry {
  id: string;
  subject: string;
  day: string;
  timeSlot: string;
}

export default function StudentTimetablePage() {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    fetch("/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const classId = data.user?.classId;
        if (!classId) return;

        fetch(`/api/admin/timetable?classId=${classId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((tData) => setEntries(tData.timetable || []));
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-semibold text-indigo-700 mb-6">
        My Timetable
      </h1>

      <div className="bg-white rounded-lg shadow overflow-hidden max-w-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 text-left">
            <tr>
              <th className="p-3">Subject</th>
              <th className="p-3">Day</th>
              <th className="p-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id} className="border-t text-gray-900">
                <td className="p-3">{e.subject}</td>
                <td className="p-3">{e.day}</td>
                <td className="p-3">{e.timeSlot}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}