"use client";

import { useEffect, useState } from "react";

interface Student {
  id: string;
  name: string;
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: string;
}

export default function AttendancePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [studentId, setStudentId] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("PRESENT");
  const [message, setMessage] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchStudents = () => {
    fetch("/api/admin/students", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStudents(data.students || []));
  };

  const fetchRecords = () => {
    fetch("/api/teacher/attendance", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setRecords(data.attendance || []));
  };

  useEffect(() => {
    fetchStudents();
    fetchRecords();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/teacher/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ studentId, date, status }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Failed to mark attendance");
      return;
    }

    setMessage("Attendance marked successfully");
    fetchRecords();
  };

  const studentName = (id: string) =>
    students.find((s) => s.id === id)?.name || "Unknown";

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-semibold text-indigo-700 mb-6">
        Mark Attendance
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow mb-8 max-w-md"
      >
        {message && <p className="text-sm text-indigo-600 mb-3">{message}</p>}

        <select
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-3 text-gray-900"
          required
        >
          <option value="">Select student</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-3 text-gray-900"
          required
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-4 text-gray-900"
        >
          <option value="PRESENT">Present</option>
          <option value="ABSENT">Absent</option>
        </select>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white rounded-md py-2 font-medium hover:bg-indigo-700"
        >
          Mark Attendance
        </button>
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden max-w-2xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 text-left">
            <tr>
              <th className="p-3">Student</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="border-t text-gray-900">
                <td className="p-3">{studentName(r.studentId)}</td>
                <td className="p-3">{new Date(r.date).toLocaleDateString()}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      r.status === "PRESENT"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}