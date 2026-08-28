"use client";

import { useEffect, useState } from "react";

interface Student {
  id: string;
  name: string;
}

interface ResultRecord {
  id: string;
  studentId: string;
  subject: string;
  marks: number;
}

export default function ResultsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [results, setResults] = useState<ResultRecord[]>([]);
  const [studentId, setStudentId] = useState("");
  const [subject, setSubject] = useState("");
  const [marks, setMarks] = useState("");
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

  const fetchResults = () => {
    fetch("/api/teacher/results", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setResults(data.results || []));
  };

  useEffect(() => {
    fetchStudents();
    fetchResults();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/teacher/results", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ studentId, subject, marks: Number(marks) }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Failed to add result");
      return;
    }

    setSubject("");
    setMarks("");
    setMessage("Result added successfully");
    fetchResults();
  };

  const studentName = (id: string) =>
    students.find((s) => s.id === id)?.name || "Unknown";

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-semibold text-indigo-700 mb-6">Results</h1>

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
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-3 text-gray-900"
          required
        />

        <input
          type="number"
          placeholder="Marks"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-4 text-gray-900"
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white rounded-md py-2 font-medium hover:bg-indigo-700"
        >
          Add Result
        </button>
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden max-w-2xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 text-left">
            <tr>
              <th className="p-3">Student</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Marks</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.id} className="border-t text-gray-900">
                <td className="p-3">{studentName(r.studentId)}</td>
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