"use client";

import { useEffect, useState } from "react";

interface Student {
  id: string;
  name: string;
  email: string;
  classId: string | null;
  studentClass: { name: string; section: string } | null;
}

interface ClassOption {
  id: string;
  name: string;
  section: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const fetchClasses = () => {
    fetch("/api/admin/classes", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setClasses(data.classes || []));
  };

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role: "STUDENT" }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Failed to register student");
      return;
    }

    setName("");
    setEmail("");
    setPassword("");
    setMessage("Student registered successfully");
    fetchStudents();
  };

  const handleAssignClass = async (studentId: string, classId: string) => {
    await fetch("/api/admin/students/assign-class", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ studentId, classId }),
    });
    fetchStudents();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-semibold text-indigo-700 mb-6">Students</h1>

      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded-lg shadow mb-8 max-w-md"
      >
        <h2 className="text-lg font-medium text-gray-900 mb-4">Register Student</h2>

        {message && <p className="text-sm text-indigo-600 mb-3">{message}</p>}

        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-3 text-gray-900"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-3 text-gray-900"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-4 text-gray-900"
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white rounded-md py-2 font-medium hover:bg-indigo-700"
        >
          Register Student
        </button>
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden max-w-3xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Assign Class</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-t text-gray-900">
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.email}</td>
                <td className="p-3">
                  <select
                    defaultValue={s.classId || ""}
                    onChange={(e) => handleAssignClass(s.id, e.target.value)}
                    className="border rounded-md px-2 py-1 text-gray-900"
                  >
                    <option value="">Not assigned</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} - {c.section}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}