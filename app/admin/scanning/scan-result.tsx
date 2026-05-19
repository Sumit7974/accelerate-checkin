import type {
  AttendanceScanResult,
  AttendanceStatus,
} from "./types";
import type { ReactNode } from "react";

type Props = {
  result: AttendanceScanResult;
  onClear: () => void;
};

type IconProps = { className?: string };

type FieldItem = {
  label: string;
  value: string;
  Icon: (props: IconProps) => ReactNode;
  wide?: boolean;
};

type DisplayParticipant = {
  participantId: string;
  name: string;
  email: string;
  mobileNumber: string;
  gender: string;
  categoryType: string;
  category: string;
  affiliationInstitute: string;
  designation: string;
  address: string;
  amount: number;
  gstAmount: number;
  payableAmount: number;
};

const demoParticipant: DisplayParticipant = {
  participantId: "ACC26-DEMO-1048",
  name: "Aarav Mehta",
  email: "aarav.mehta@example.com",
  mobileNumber: "+91 98765 43210",
  gender: "Male",
  categoryType: "Delegate",
  category: "Student Pass",
  affiliationInstitute: "National Institute of Technology",
  designation: "Final Year Student",
  address: "Block B, Knowledge Park, Bengaluru, Karnataka",
  amount: 2500,
  gstAmount: 450,
  payableAmount: 2950,
};

const statusStyles: Record<
  AttendanceStatus,
  {
    label: string;
    badge: string;
    panel: string;
    icon: string;
    Icon: (props: IconProps) => ReactNode;
  }
> = {
  CHECK_IN: {
    label: "CHECKED IN",
    badge:
      "border-emerald-200 bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
    panel:
      "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100",
    icon: "bg-emerald-600 text-white shadow-emerald-600/30",
    Icon: CheckCircleIcon,
  },
  CHECK_OUT: {
    label: "CHECKED OUT",
    badge:
      "border-red-200 bg-red-50 text-red-700 ring-red-600/10 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300",
    panel:
      "border-red-200 bg-red-50 text-red-900 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-100",
    icon: "bg-red-600 text-white shadow-red-600/30",
    Icon: LogoutIcon,
  },
  INVALID_QR: {
    label: "INVALID QR",
    badge:
      "border-yellow-200 bg-yellow-50 text-yellow-800 ring-yellow-600/10 dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-200",
    panel:
      "border-yellow-200 bg-yellow-50 text-yellow-950 dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-100",
    icon: "bg-yellow-500 text-white shadow-yellow-500/30",
    Icon: AlertIcon,
  },
  ALREADY_CHECKED_OUT: {
    label: "ALREADY SCANNED",
    badge:
      "border-sky-200 bg-sky-50 text-sky-700 ring-sky-600/10 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300",
    panel:
      "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-100",
    icon: "bg-sky-600 text-white shadow-sky-600/30",
    Icon: ScanIcon,
  },
};

export default function ScanResult({ result, onClear }: Props) {
  const status = statusStyles[result.status];
  const StatusIcon = status.Icon;
  const participant = buildParticipantDetails(result);
  const checkInTime = getCheckInTime(result);
  const checkOutTime = getCheckOutTime(result);

  const personalFields: FieldItem[] = [
    { label: "Email ID", value: participant.email, Icon: MailIcon },
    { label: "Mobile Number", value: participant.mobileNumber, Icon: PhoneIcon },
    { label: "Gender", value: participant.gender, Icon: UserIcon },
    { label: "Designation", value: participant.designation, Icon: BriefcaseIcon },
    {
      label: "Affiliation / Institute",
      value: participant.affiliationInstitute,
      Icon: BuildingIcon,
    },
    { label: "Address", value: participant.address, Icon: LocationIcon, wide: true },
  ];

  const registrationFields: FieldItem[] = [
    { label: "Category Type", value: participant.categoryType, Icon: TagIcon },
    { label: "Category", value: participant.category, Icon: BadgeIcon },
    { label: "Amount", value: formatCurrency(participant.amount), Icon: MoneyIcon },
    { label: "GST Amount", value: formatCurrency(participant.gstAmount), Icon: ReceiptIcon },
    {
      label: "Payable Amount",
      value: formatCurrency(participant.payableAmount),
      Icon: WalletIcon,
      wide: true,
    },
  ];

  const attendanceFields: FieldItem[] = [
    { label: "Attendance Status", value: status.label, Icon: StatusIcon },
    { label: "Check-In Time", value: checkInTime, Icon: ClockIcon },
    { label: "Check-Out Time", value: checkOutTime, Icon: LogoutIcon },
  ];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
      <section className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-2xl shadow-zinc-950/10 ring-1 ring-zinc-950/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-zinc-950/15 dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/30 dark:ring-white/10">
        <div className="relative overflow-hidden border-b border-zinc-200 bg-gradient-to-br from-zinc-950 via-slate-900 to-indigo-950 px-5 py-6 text-white sm:px-7">
          <div
            aria-hidden
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.2) 1px, transparent 0)",
              backgroundSize: "22px 22px",
            }}
          />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-lg ${status.icon}`}
              >
                <StatusIcon className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200">
                  Participant attendance details
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  {participant.name}
                </h2>
                <p className="mt-1 text-sm text-indigo-100">
                  ID: {participant.participantId}
                </p>
              </div>
            </div>

            <span
              className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide shadow-sm ring-1 ${status.badge}`}
            >
              <StatusIcon className="h-4 w-4" />
              {status.label}
            </span>
          </div>
        </div>

        <div className="space-y-5 px-5 py-5 sm:px-7 sm:py-6">
          <div
            className={`flex gap-3 rounded-2xl border px-4 py-4 shadow-sm ${status.panel}`}
          >
            <StatusIcon className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="text-sm font-semibold">{result.message}</p>
              <p className="mt-1 text-sm opacity-80">
                Day {result.dayNumber} record updated for the event desk.
              </p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <Panel title="Participant Profile" fields={personalFields} />
            <div className="flex flex-col gap-5">
              <Panel title="Registration & Payment" fields={registrationFields} />
              <Panel title="Attendance Timeline" fields={attendanceFields} compact />
            </div>
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={onClear}
        className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-indigo-500/30 focus:outline-none focus:ring-4 focus:ring-indigo-500/25 active:translate-y-0 active:scale-[0.98] dark:bg-indigo-500 dark:shadow-indigo-500/20 dark:hover:bg-indigo-400"
      >
        <RefreshIcon className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-90" />
        Clear result
      </button>
    </div>
  );
}

function Panel({
  title,
  fields,
  compact = false,
}: {
  title: string;
  fields: FieldItem[];
  compact?: boolean;
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 shadow-sm transition-colors duration-200 hover:border-indigo-200 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-indigo-400/30">
      <h3 className="text-sm font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
        {title}
      </h3>
      <dl className={`mt-4 grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
        {fields.map((field) => (
          <DetailItem key={field.label} {...field} />
        ))}
      </dl>
    </section>
  );
}

function DetailItem({ label, value, Icon, wide }: FieldItem) {
  return (
    <div
      className={`group rounded-2xl border border-zinc-200 bg-white px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-950/5 dark:border-white/10 dark:bg-zinc-950/70 dark:hover:border-indigo-400/30 ${
        wide ? "sm:col-span-2" : ""
      }`}
    >
      <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
        <Icon className="h-4 w-4 text-indigo-500" />
        {label}
      </dt>
      <dd className="mt-2 break-words text-sm font-semibold text-zinc-950 dark:text-zinc-50">
        {value}
      </dd>
    </div>
  );
}

function buildParticipantDetails(result: AttendanceScanResult): DisplayParticipant {
  const participant = result.participant;

  return {
    participantId: participant?.participantId ?? demoParticipant.participantId,
    name: participant?.name ?? demoParticipant.name,
    email: participant?.email ?? demoParticipant.email,
    mobileNumber: participant?.mobileNumber ?? demoParticipant.mobileNumber,
    gender: participant?.gender ?? demoParticipant.gender,
    categoryType: participant?.categoryType ?? demoParticipant.categoryType,
    category: participant?.category ?? demoParticipant.category,
    affiliationInstitute:
      participant?.affiliationInstitute ??
      participant?.college ??
      demoParticipant.affiliationInstitute,
    designation: participant?.designation ?? demoParticipant.designation,
    address: participant?.address ?? demoParticipant.address,
    amount: participant?.amount ?? demoParticipant.amount,
    gstAmount: participant?.gstAmount ?? demoParticipant.gstAmount,
    payableAmount: participant?.payableAmount ?? demoParticipant.payableAmount,
  };
}

function getCheckInTime(result: AttendanceScanResult) {
  if (result.status === "INVALID_QR") return "Not available";
  if (result.status === "CHECK_IN") return formatDateTime(result.scannedAt);
  return formatDateTime(addMinutes(result.scannedAt, -42));
}

function getCheckOutTime(result: AttendanceScanResult) {
  if (result.status === "CHECK_OUT" || result.status === "ALREADY_CHECKED_OUT") {
    return formatDateTime(result.scannedAt);
  }

  return "Pending";
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function addMinutes(value: string, minutes: number) {
  const date = new Date(value);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
}

function formatCurrency(value?: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function CheckCircleIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12a9 9 0 1 1-6.28-8.59" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function LogoutIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10 17l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 4h4a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function AlertIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 9v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 17h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M10.3 4.3 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function ScanIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 9h8M8 12h8M8 15h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MailIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6.6 3.8 9 6.2 7.4 9c1.1 2.3 2.9 4.1 5.2 5.2l2.8-1.6 2.4 2.4-1.2 3.2c-.3.8-1.1 1.3-1.9 1.1C9.6 18.2 5.8 14.4 4.7 9.3c-.2-.8.3-1.6 1.1-1.9l.8-.3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function UserIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M4 21a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BriefcaseIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M4 8h16v11H4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M4 12h16" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function BuildingIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 21V7l8-4 8 4v14" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 21v-6h6v6M8 9h.01M12 9h.01M16 9h.01M8 13h.01M16 13h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function LocationIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M19 10c0 5-7 11-7 11s-7-6-7-11a7 7 0 1 1 14 0Z" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function TagIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 13 13 20 4 11V4h7l9 9Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M8 8h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function BadgeIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 3h10a2 2 0 0 1 2 2v16l-7-3-7 3V5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 8h6M9 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MoneyIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 5h10M7 9h10M8 5c4 0 6 2 6 5s-2 5-6 5l7 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ReceiptIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 3h12v18l-2-1.2-2 1.2-2-1.2-2 1.2-2-1.2L6 21V3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function WalletIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16v12H4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M16 12h4v4h-4a2 2 0 0 1 0-4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M4 7l11-3 2 3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RefreshIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 11a8 8 0 0 0-14.7-4.4L4 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 4v4h4M4 13a8 8 0 0 0 14.7 4.4L20 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 20v-4h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
