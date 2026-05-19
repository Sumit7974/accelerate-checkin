"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [participantId, setParticipantId] = useState("");
  const [day, setDay] = useState("");
  const [status, setStatus] = useState("IN");

  const handleAttendance = async () => {
    if (!supabase) {
      alert("Supabase is not configured");
      return;
    }

    const { data, error } = await supabase
      .from("attendance_logs")
      .insert([
        {
          participant_id: participantId,
          day: Number(day),
          status: status,
          scanned_at: new Date(),
        },
      ]);

    if (error) {
      alert(JSON.stringify(error));
      console.log(error);
      alert("Attendance failed");
    } else {
      console.log(data);
      alert("Attendance marked");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">
        Admin Attendance
      </h1>

      <input
        type="text"
        placeholder="Participant ID"
        value={participantId}
        onChange={(e) => setParticipantId(e.target.value)}
        className="w-full border p-2 mb-4"
      />

      <input
        type="number"
        placeholder="Day"
        value={day}
        onChange={(e) => setDay(e.target.value)}
        className="w-full border p-2 mb-4"
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full border p-2 mb-4"
      >
        <option value="IN">IN</option>
        <option value="OUT">OUT</option>
      </select>

      <button
  onClick={handleAttendance}
  className="w-full bg-blue-500 text-white p-3 rounded"
>
  Mark Attendance
</button>
    </div>
  );
}
