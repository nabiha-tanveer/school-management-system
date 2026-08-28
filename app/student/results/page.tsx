"use client";

import { useEffect, useState } from "react";

interface ResultRecord {
  id: string;
  subject: string;
  marks: number;
}

export default function StudentResultsPage() {
  const [results, setResults] = useState<ResultRecord[]>([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    fetch(`/api/teacher/results?studentId=${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setResults(data.results || []));
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-semibold text-indigo-700 mb-6">
        My Results
      </h1>

      <div className="bg-white rounded-lg shadow overflow-hidden max-w-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 text-left">
            <tr>
              <th className="p-3">Subject</th>
              <th className="p-3">Marks</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.id} className="border-t text-gray-900">
                <td className="p-3">{r.subject}</td>
                <td className="p-3">{r.marks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}