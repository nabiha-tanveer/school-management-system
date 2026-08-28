"use client";

import { useEffect, useState } from "react";

interface Fee {
  id: string;
  amount: number;
  status: string;
  dueDate: string;
}

export default function StudentFeesPage() {
  const [fees, setFees] = useState<Fee[]>([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    fetch(`/api/admin/fees?studentId=${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setFees(data.fees || []));
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-semibold text-indigo-700 mb-6">My Fees</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden max-w-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 text-left">
            <tr>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((f) => (
              <tr key={f.id} className="border-t text-gray-900">
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