"use client";

import { useEffect, useState } from "react";

interface Fee {
  id: string;
  amount: number;
  status: string;
  dueDate: string;
  studentId: string;
}

interface Student {
  id: string;
  name: string;
}

export default function FeesPage() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentId, setStudentId] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchFees = () => {
    fetch("/api/admin/fees", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setFees(data.fees || []));
  };

  const fetchStudents = () => {
    fetch("/api/admin/students", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStudents(data.students || []));
  };

  useEffect(() => {
    fetchFees();
    fetchStudents();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/admin/fees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ studentId, amount: Number(amount), dueDate }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Failed to create fee record");
      return;
    }

    setStudentId("");
    setAmount("");
    setDueDate("");
    setMessage("Fee record created successfully");
    fetchFees();
  };

  const studentName = (id: string) =>
    students.find((s) => s.id === id)?.name || "Unknown";

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-semibold text-indigo-700 mb-6">Fees</h1>

      <form
        onSubmit={handleCreate}
        className="bg-white p-6 rounded-lg shadow mb-8 max-w-md"
      >
        <h2 className="text-lg font-medium text-gray-900 mb-4">Add Fee Record</h2>

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
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-3 text-gray-900"
          required
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-4 text-gray-900"
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white rounded-md py-2 font-medium hover:bg-indigo-700"
        >
          Add Fee Record
        </button>
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden max-w-3xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 text-left">
            <tr>
              <th className="p-3">Student</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((f) => (
              <tr key={f.id} className="border-t text-gray-900">
                <td className="p-3">{studentName(f.studentId)}</td>
                <td className="p-3">Rs {f.amount}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      f.status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {f.status}
                  </span>
                </td>
                <td className="p-3">
                  {new Date(f.dueDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}