import { createSupabaseServerClient } from "@/lib/supabase-server";
import type {
  AttendanceScanResult,
  AttendanceStatus,
  ParticipantDetails,
} from "@/app/admin/scanning/types";

type ParticipantRow = {
  id: string;
  name: string | null;
  email: string | null;
  college: string | null;
  participant_id: string | null;
};

type AttendanceLogRow = {
  id: string;
  status: "CHECK_IN" | "CHECK_OUT";
  scanned_at: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      dayNumber?: unknown;
      participantId?: unknown;
      qrToken?: unknown;
    };
    const qrToken = typeof body.qrToken === "string" ? body.qrToken.trim() : "";
    const participantId =
      typeof body.participantId === "string" ? body.participantId.trim() : "";
    const scannedValue = qrToken || participantId;

    if (!scannedValue) {
      return Response.json(createInvalidQrResult(), { status: 400 });
    }

    const supabase = createSupabaseServerClient();
    const now = new Date();
    const dayNumber = getRequestedDayNumber(body.dayNumber, now);

    const { participant, error: participantError } = await findParticipant(
      scannedValue
    );

    if (participantError) {
      return Response.json(
        { error: "Could not verify QR code" },
        { status: 500 }
      );
    }

    if (!participant) {
      return Response.json(createInvalidQrResult(now, dayNumber), {
        status: 404,
      });
    }

    const { data: attendanceLogs, error: attendanceError } = await supabase
      .from("attendance_logs")
      .select("id,status,scanned_at")
      .eq("participant_id", participant.id)
      .eq("day_number", dayNumber)
      .in("status", ["CHECK_IN", "CHECK_OUT"])
      .order("scanned_at", { ascending: true })
      .returns<AttendanceLogRow[]>();

    if (attendanceError) {
      return Response.json(
        { error: "Could not read attendance logs" },
        { status: 500 }
      );
    }

    const completedScans = attendanceLogs?.length ?? 0;
    const status = getNextAttendanceStatus(completedScans);
    const result = createAttendanceResult({
      status,
      participant,
      scannedAt: now,
      dayNumber,
    });

    const { error: insertError } = await supabase
      .from("attendance_logs")
      .insert({
        participant_id: participant.id,
        day_number: dayNumber,
        status,
        scanned_at: now.toISOString(),
      });

    if (insertError) {
      return Response.json(
        { error: "Could not save attendance log" },
        { status: 500 }
      );
    }

    return Response.json(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unexpected attendance error";

    return Response.json({ error: message }, { status: 500 });
  }
}

async function findParticipant(scannedValue: string) {
  const supabase = createSupabaseServerClient();
  const selectFields = "id,name,email,college,participant_id";

  const qrLookup = await supabase
    .from("participants")
    .select(selectFields)
    .eq("qr_token", scannedValue)
    .maybeSingle<ParticipantRow>();

  if (qrLookup.error || qrLookup.data) {
    return { participant: qrLookup.data, error: qrLookup.error };
  }

  const idLookup = await supabase
    .from("participants")
    .select(selectFields)
    .eq("participant_id", scannedValue)
    .maybeSingle<ParticipantRow>();

  return { participant: idLookup.data, error: idLookup.error };
}

function getNextAttendanceStatus(scanCount: number): AttendanceStatus {
  if (scanCount === 0) return "CHECK_IN";
  if (scanCount === 1) return "CHECK_OUT";
  return "ALREADY_CHECKED_OUT";
}

function createAttendanceResult({
  status,
  participant,
  scannedAt,
  dayNumber,
}: {
  status: AttendanceStatus;
  participant: ParticipantRow;
  scannedAt: Date;
  dayNumber: number;
}): AttendanceScanResult {
  return {
    ok: status === "CHECK_IN" || status === "CHECK_OUT",
    message: getStatusMessage(status),
    status,
    scannedAt: scannedAt.toISOString(),
    dayNumber,
    participant: mapParticipant(participant),
  };
}

function createInvalidQrResult(
  scannedAt = new Date(),
  dayNumber = getEventDayNumber(scannedAt)
): AttendanceScanResult {
  return {
    ok: false,
    message: "Invalid QR Code",
    status: "INVALID_QR",
    scannedAt: scannedAt.toISOString(),
    dayNumber,
    participant: null,
  };
}

function getStatusMessage(status: AttendanceStatus): AttendanceScanResult["message"] {
  switch (status) {
    case "CHECK_IN":
      return "Checked In Successfully";
    case "CHECK_OUT":
      return "Checked Out Successfully";
    case "ALREADY_CHECKED_OUT":
      return "Already Checked Out";
    case "INVALID_QR":
      return "Invalid QR Code";
  }
}

function mapParticipant(participant: ParticipantRow): ParticipantDetails {
  return {
    id: participant.id,
    participantId: participant.participant_id ?? participant.id,
    name: participant.name ?? "Unnamed Participant",
    email: participant.email ?? "Not available",
    college: participant.college ?? "Not available",
  };
}

function getLocalDayRange(date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(startOfDay.getDate() + 1);

  return { startOfDay, endOfDay };
}

function getEventDayNumber(date: Date) {
  const configuredDay = Number(process.env.EVENT_DAY_NUMBER);

  if (Number.isInteger(configuredDay) && configuredDay > 0) {
    return configuredDay;
  }

  const eventStartDate = process.env.EVENT_START_DATE;
  if (eventStartDate) {
    const startDate = new Date(`${eventStartDate}T00:00:00`);
    if (!Number.isNaN(startDate.getTime())) {
      const start = getLocalDayRange(startDate).startOfDay.getTime();
      const current = getLocalDayRange(date).startOfDay.getTime();
      return Math.max(1, Math.floor((current - start) / 86_400_000) + 1);
    }
  }

  return date.getDate();
}

function getRequestedDayNumber(value: unknown, fallbackDate: Date) {
  const dayNumber =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;

  if (Number.isInteger(dayNumber) && dayNumber >= 1 && dayNumber <= 3) {
    return dayNumber;
  }

  return getEventDayNumber(fallbackDate);
}
