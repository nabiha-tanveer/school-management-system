"use client";

import { useEffect, useState } from "react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchAnnouncements = () => {
    fetch("/api/admin/announcements", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAnnouncements(data.announcements || []));
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/admin/announcements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Failed to post announcement");
      return;
    }

    setTitle("");
    setContent("");
    setMessage("Announcement posted successfully");
    fetchAnnouncements();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-semibold text-indigo-700 mb-6">
        Announcements
      </h1>

      <form
        onSubmit={handleCreate}
        className="bg-white p-6 rounded-lg shadow mb-8 max-w-md"
      >
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Post Announcement
        </h2>

        {message && <p className="text-sm text-indigo-600 mb-3">{message}</p>}

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-3 text-gray-900"
          required
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full border rounded-md px-3 py-2 mb-4 text-gray-900"
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white rounded-md py-2 font-medium hover:bg-indigo-700"
        >
          Post Announcement
        </button>
      </form>

      <div className="space-y-3 max-w-2xl">
        {announcements.map((a) => (
          <div key={a.id} className="bg-white rounded-lg shadow p-4">
            <h3 className="font-medium text-gray-900">{a.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{a.content}</p>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(a.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}