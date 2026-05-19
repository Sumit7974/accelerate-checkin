"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [participantId, setParticipantId] = useState("");
  const [day, setDay] = useState("");
  const [status, setStatus] = useState("IN");
  const [participantInfo, setParticipantInfo] = useState<any>(null);
  const [lastStatus, setLastStatus] = useState("");

  const checkParticipant = async () => {
    if (!participantId || !day) {
      alert("Enter participant ID and day first");
      return;
    }

    const { data: participant, error } = await supabase
      .from("participants")
      .select("*")
      .eq("participant_id", participantId)
      .single();

    if (error || !participant) {
      setParticipantInfo(null);
      setLastStatus("");
      alert("Invalid participant ID");
      return;
    }

    setParticipantInfo(participant);

    const { data: logs } = await supabase
      .from("attendance_logs")
      .select("*")
      .eq("participant_id", participantId)
      .eq("day", Number(day))
      .order("scanned_at", { ascending: false })
      .limit(1);

    setLastStatus(logs?.[0]?.status || "Not marked yet");
  };

  const handleAttendance = async () => {
    if (!participantId || !day || !status) {
      alert("Please fill all fields");
      return;
    }

    const { data: participant, error: participantError } = await supabase
      .from("participants")
      .select("*")
      .eq("participant_id", participantId)
      .single();

    if (participantError || !participant) {
      alert("Invalid participant ID");
      return;
    }

    const { data: lastLogs, error: fetchError } = await supabase
      .from("attendance_logs")
      .select("*")
      .eq("participant_id", participantId)
      .eq("day", Number(day))
      .order("scanned_at", { ascending: false })
      .limit(1);

    if (fetchError) {
      console.log(fetchError);
      alert("Failed to check previous attendance");
      return;
    }

    const previousStatus = lastLogs?.[0]?.status;

    if (status === "IN" && previousStatus === "IN") {
      alert("Participant is already checked IN");
      return;
    }

    if (status === "OUT" && !previousStatus) {
      alert("Cannot check OUT before check IN");
      return;
    }

    if (status === "OUT" && previousStatus === "OUT") {
      alert("Participant is already checked OUT");
      return;
    }

    const { error } = await supabase.from("attendance_logs").insert([
      {
        participant_id: participantId,
        day: Number(day),
        status,
        scanned_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.log(error);
      alert(JSON.stringify(error));
    } else {
      alert(`Attendance marked: ${status}`);
      checkParticipant();
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">Admin Attendance</h1>

      <input
        type="text"
        placeholder="Participant ID"
        value={participantId}
        onChange={(e) => setParticipantId(e.target.value)}
        className="w-full border p-2"
      />

      <input
        type="number"
        placeholder="Day"
        value={day}
        onChange={(e) => setDay(e.target.value)}
        className="w-full border p-2"
      />

      <button
        onClick={checkParticipant}
        className="w-full bg-green-600 text-white p-3 rounded"
      >
        Check Participant
      </button>

      {participantInfo && (
        <div className="p-4 border rounded bg-gray-50">
          <p><b>Name:</b> {participantInfo.name}</p>
          <p><b>Email:</b> {participantInfo.email}</p>
          <p><b>Phone:</b> {participantInfo.phone}</p>
          <p><b>College:</b> {participantInfo.college}</p>
          <p><b>Last Status:</b> {lastStatus}</p>
        </div>
      )}

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full border p-2"
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