"use client";

import { useEffect, useState } from "react";

interface ClassItem {
  id: string;
  name: string;
  section: string;
  teacher: { name: string; email: string };
  students: { name: string; email: string }[];
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [name, setName] = useState("");
  const [section, setSection] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [message, setMessage] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchClasses = () => {
    fetch("/api/admin/classes", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setClasses(data.classes || []));
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/admin/classes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, section, teacherId }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Failed to create class");
      return;
    }

    setName("");
    setSection("");
    setTeacherId("");
    setMessage("Class created successfully");
    fetchClasses();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-semibold text-indigo-700 mb-6">Classes</h1>

      <form
        onSubmit={handleCreate}
        className="bg-white p-6 rounded-lg shadow mb-8 max-w-md"
      >
        <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Class</h2>

        {message && <p className="text-sm text-indigo-600 mb-3">{message}</p>}

        <input
          type="text"
          placeholder="Class name (e.g. Grade 10)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-3 text-gray-900"
          required
        />
        <input
          type="text"
          placeholder="Section (e.g. A)"
          value={section}
          onChange={(e) => setSection(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-3 text-gray-900"
          required
        />
        <input
          type="text"
          placeholder="Teacher ID"
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-4 text-gray-900"
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white rounded-md py-2 font-medium hover:bg-indigo-700"
        >
          Create Class
        </button>
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden max-w-3xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Section</th>
              <th className="p-3">Teacher</th>
              <th className="p-3">Students</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((c) => (
              <tr key={c.id} className="border-t text-gray-900">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.section}</td>
                <td className="p-3">{c.teacher?.name}</td>
                <td className="p-3">{c.students?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}