export type AttendanceStatus =
  | "CHECK_IN"
  | "CHECK_OUT"
  | "INVALID_QR"
  | "ALREADY_CHECKED_OUT";

export type ParticipantDetails = {
  id: string;
  participantId: string;
  name: string;
  email: string;
  college: string;
  mobileNumber?: string;
  gender?: string;
  categoryType?: string;
  category?: string;
  affiliationInstitute?: string;
  designation?: string;
  address?: string;
  amount?: number;
  gstAmount?: number;
  payableAmount?: number;
};

export type AttendanceScanResult = {
  ok: boolean;
  message:
    | "Checked In Successfully"
    | "Checked Out Successfully"
    | "Invalid QR Code"
    | "Already Checked Out";
  status: AttendanceStatus;
  scannedAt: string;
  dayNumber: number;
  participant: ParticipantDetails | null;
};
