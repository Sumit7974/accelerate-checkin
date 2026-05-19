"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [selectedDay, setSelectedDay] = useState(1);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [totalIn, setTotalIn] = useState(0);
  const [totalOut, setTotalOut] = useState(0);

  const fetchStats = async () => {
    const { count: participantsCount } = await supabase
      .from("participants")
      .select("*", { count: "exact", head: true });

    const { count: inCount } = await supabase
      .from("attendance_logs")
      .select("*", { count: "exact", head: true })
      .eq("day", selectedDay)
      .eq("status", "IN");

    const { count: outCount } = await supabase
      .from("attendance_logs")
      .select("*", { count: "exact", head: true })
      .eq("day", 1)
      .eq("status", "OUT");

    setTotalParticipants(participantsCount || 0);
    setTotalIn(inCount || 0);
    setTotalOut(outCount || 0);
  };

  useEffect(() => {
  fetchStats();
}, [selectedDay]);
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
<h1 className="text-3xl font-bold mb-6">
  Admin Dashboard
</h1>

<select
  value={selectedDay}
  onChange={(e) => setSelectedDay(Number(e.target.value))}
  className="mb-6 border p-2 rounded"
>
  <option value={1}>Day 1</option>
  <option value={2}>Day 2</option>
  <option value={3}>Day 3</option>
</select>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-500">Total Participants</h2>
          <p className="text-3xl font-bold">{totalParticipants}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-500">Day 1 Checked IN</h2>
          <p className="text-3xl font-bold">{totalIn}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-500">Day 1 Checked OUT</h2>
          <p className="text-3xl font-bold">{totalOut}</p>
        </div>
      </div>

      <button
        onClick={fetchStats}
        className="mt-6 bg-black text-white px-4 py-2 rounded"
      >
        Refresh Stats
      </button>
    </div>
  );
}