"use client";

import { useEffect, useState } from "react";

interface TimetableEntry {
  id: string;
  classId: string;
  subject: string;
  day: string;
  timeSlot: string;
}

interface ClassOption {
  id: string;
  name: string;
  section: string;
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function TimetablePage() {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [classId, setClassId] = useState("");
  const [subject, setSubject] = useState("");
  const [day, setDay] = useState("Monday");
  const [timeSlot, setTimeSlot] = useState("");
  const [message, setMessage] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchEntries = () => {
    fetch("/api/admin/timetable", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setEntries(data.timetable || []));
  };

  const fetchClasses = () => {
    fetch("/api/admin/classes", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setClasses(data.classes || []));
  };

  useEffect(() => {
    fetchEntries();
    fetchClasses();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/admin/timetable", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ classId, subject, day, timeSlot }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Failed to add entry");
      return;
    }

    setSubject("");
    setTimeSlot("");
    setMessage("Timetable entry added successfully");
    fetchEntries();
  };

  const className = (id: string) => {
    const c = classes.find((c) => c.id === id);
    return c ? `${c.name} - ${c.section}` : "Unknown";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-semibold text-indigo-700 mb-6">Timetable</h1>

      <form
        onSubmit={handleCreate}
        className="bg-white p-6 rounded-lg shadow mb-8 max-w-md"
      >
        <h2 className="text-lg font-medium text-gray-900 mb-4">Add Entry</h2>

        {message && <p className="text-sm text-indigo-600 mb-3">{message}</p>}

        <select
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-3 text-gray-900"
          required
        >
          <option value="">Select class</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} - {c.section}
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

        <select
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-3 text-gray-900"
        >
          {days.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Time slot (e.g. 9:00-10:00)"
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-4 text-gray-900"
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white rounded-md py-2 font-medium hover:bg-indigo-700"
        >
          Add Entry
        </button>
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden max-w-3xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 text-left">
            <tr>
              <th className="p-3">Class</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Day</th>
              <th className="p-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id} className="border-t text-gray-900">
                <td className="p-3">{className(e.classId)}</td>
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