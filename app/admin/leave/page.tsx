"use client";

import { useEffect, useState } from "react";

interface LeaveRequest {
  id: string;
  reason: string;
  status: string;
  fromDate: string;
  toDate: string;
  user: { name: string; email: string; role: string };
}

export default function LeavePage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchLeaves = () => {
    fetch("/api/admin/leave", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setLeaves(data.leaves || []));
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const updateStatus = async (leaveId: string, status: string) => {
    await fetch("/api/admin/leave", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ leaveId, status }),
    });
    fetchLeaves();
  };

  const statusColor = (status: string) => {
    if (status === "APPROVED") return "bg-green-100 text-green-700";
    if (status === "REJECTED") return "bg-red-100 text-red-700";
    return "bg-amber-100 text-amber-700";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-semibold text-indigo-700 mb-6">
        Leave Requests
      </h1>

      <div className="bg-white rounded-lg shadow overflow-hidden max-w-4xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Role</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Dates</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((l) => (
              <tr key={l.id} className="border-t text-gray-900">
                <td className="p-3">{l.user?.name}</td>
                <td className="p-3">{l.user?.role}</td>
                <td className="p-3">{l.reason}</td>
                <td className="p-3 text-xs">
                  {new Date(l.fromDate).toLocaleDateString()} -{" "}
                  {new Date(l.toDate).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${statusColor(
                      l.status
                    )}`}
                  >
                    {l.status}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  {l.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => updateStatus(l.id, "APPROVED")}
                        className="text-green-600 text-xs hover:underline"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(l.id, "REJECTED")}
                        className="text-red-600 text-xs hover:underline"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}