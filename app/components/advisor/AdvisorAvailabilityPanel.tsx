"use client";

import { useEffect, useMemo, useState } from "react";
import { BookingActions } from "./BookingActions";
import { ChatIcon, PhoneIcon, ShieldCheckIcon, VideoIcon } from "../ui/Icons";
import { api } from "../../lib/api";
import type { Advisor, AdvisorDetailSections, GlobalSections } from "../../lib/types";

type AvailabilitySlot = {
  start: string;
  end: string;
  startLabel: string;
  endLabel: string;
  durationMinutes: number;
};

type AvailabilityResponse = {
  advisorId: string;
  advisorName: string;
  timezone: string;
  displayTimezone: string;
  date: string;
  durationMinutes: number;
  stepMinutes: number;
  scheduleWindow: { from: string; to: string } | null;
  scheduleWindows?: { from: string; to: string }[];
  availableSlots: AvailabilitySlot[];
  bookedSlots: AvailabilitySlot[];
};

type Props = {
  advisorId: string;
  profile: Advisor["profile"];
  labels: NonNullable<AdvisorDetailSections["labels"]>;
  footer: NonNullable<GlobalSections["footer"]>;
};

const FALLBACK_TIMEZONES = [
  "UTC",
  "Africa/Abidjan",
  "Africa/Accra",
  "Africa/Banjul",
  "Africa/Bissau",
  "Africa/Conakry",
  "Africa/Dakar",
  "Africa/Freetown",
  "Africa/Lome",
  "Africa/Monrovia",
  "Africa/Nouakchott",
  "Africa/Ouagadougou",
  "Africa/Bangui",
  "Africa/Lagos",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Toronto",
  "Europe/London",
  "Europe/Paris",
  "Asia/Dhaka",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];

function detectTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

function supportedTimezones() {
  try {
    if (typeof Intl.supportedValuesOf === "function") {
      return Intl.supportedValuesOf("timeZone");
    }
  } catch {
    // Fall through to curated list.
  }
  return FALLBACK_TIMEZONES;
}

function dateKey(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function dateLabel(date: string, timezone: string) {
  const [year, month, day] = date.split("-").map((part) => Number.parseInt(part, 10));
  const value = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

function shortDay(date: string, timezone: string) {
  const [year, month, day] = date.split("-").map((part) => Number.parseInt(part, 10));
  const value = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return new Intl.DateTimeFormat("en-US", { timeZone: timezone, weekday: "short" }).format(value).slice(0, 2);
}

function weekdayKey(date: string, timezone: string) {
  const [year, month, day] = date.split("-").map((part) => Number.parseInt(part, 10));
  const value = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return new Intl.DateTimeFormat("en-US", { timeZone: timezone, weekday: "long" }).format(value).toLowerCase();
}

function scheduleForDate(schedule: Advisor["profile"]["weeklySchedule"], date: string, timezone: string) {
  const day = schedule?.[weekdayKey(date, timezone)];
  if (!day || day.enabled === false) return null;
  const slots = day.slots?.length ? day.slots : [{ from: day.from, to: day.to }];
  return slots.map((slot) => ({ from: slot.from || "09:00", to: slot.to || "18:00" }));
}

function dayNumber(date: string) {
  return String(Number.parseInt(date.split("-")[2] || "0", 10));
}

function addDaysInZone(base: Date, days: number, timezone: string) {
  const start = dateKey(base, timezone);
  const [year, month, day] = start.split("-").map((part) => Number.parseInt(part, 10));
  const value = new Date(Date.UTC(year, month - 1, day + days, 12, 0, 0));
  return dateKey(value, timezone);
}

function timezoneLabel(timezone: string) {
  return timezone.replace(/_/g, " ");
}

function price(value?: number) {
  return `${(value || 0).toFixed(2)} credits/min`;
}

function compactSlots(slots: AvailabilitySlot[]) {
  if (!slots.length) return [];
  const sorted = [...slots].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  const ranges: Array<{ startLabel: string; endLabel: string; end: string }> = [];

  for (const slot of sorted) {
    const last = ranges[ranges.length - 1];
    if (last && new Date(last.end).getTime() === new Date(slot.start).getTime()) {
      last.end = slot.end;
      last.endLabel = slot.endLabel;
    } else {
      ranges.push({ startLabel: slot.startLabel, endLabel: slot.endLabel, end: slot.end });
    }
  }

  return ranges.slice(0, 4);
}

export function AdvisorAvailabilityPanel({ advisorId, profile, labels, footer }: Props) {
  const detectedTimezone = useMemo(() => detectTimezone(), []);
  const [timezone, setTimezone] = useState(detectedTimezone);
  const [selectedDate, setSelectedDate] = useState(() => dateKey(new Date(), detectedTimezone));
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [fallbackSchedule, setFallbackSchedule] = useState<{ from: string; to: string }[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const timezones = useMemo(() => {
    const zones = supportedTimezones();
    return zones.includes(detectedTimezone) ? zones : [detectedTimezone, ...zones];
  }, [detectedTimezone]);

  const dateOptions = useMemo(
    () => Array.from({ length: 14 }, (_, index) => addDaysInZone(new Date(), index, timezone)),
    [timezone]
  );

  useEffect(() => {
    setSelectedDate(dateKey(new Date(), timezone));
  }, [timezone]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    api
      .get<AvailabilityResponse>(
        `/advisors/${advisorId}/availability`,
        {
          date: selectedDate,
          timezone,
          durationMinutes: 15,
        },
        { skipAuth: true }
      )
      .then((res) => {
        if (!cancelled) {
          setAvailability(res.data || null);
          setFallbackSchedule(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAvailability(null);
          setFallbackSchedule(scheduleForDate(profile.weeklySchedule, selectedDate, timezone));
          setError("");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [advisorId, selectedDate, timezone, profile.weeklySchedule]);

  const displayDate = dateLabel(selectedDate, timezone);
  const [weekday, ...restDateParts] = displayDate.split(", ");
  const restDate = restDateParts.join(", ");
  const slots = availability?.availableSlots || [];
  const groupedSlots = compactSlots(slots);
  const bookedSlots = availability?.bookedSlots || [];
  const availableToday = slots.length > 0 || !!fallbackSchedule;
  const scheduleWindows = availability?.scheduleWindows?.length
    ? availability.scheduleWindows
    : availability?.scheduleWindow
      ? [availability.scheduleWindow]
      : fallbackSchedule || [];
  const windowLabel = scheduleWindows.length
    ? scheduleWindows.map((window) => `${window.from} - ${window.to}`).join(", ")
    : "Closed";

  return (
    <div>
      <h2 className="mb-6 text-center text-2xl font-bold text-slate-950">Schedule</h2>

      <div className="grid grid-cols-7 border border-[#d6d6d6] text-center text-sm">
        {dateOptions.slice(0, 7).map((date) => (
          <div key={`${date}-label`} className="border-b border-r border-[#e4e4e4] bg-[#f3f3f3] py-2 font-bold last:border-r-0">
            {shortDay(date, timezone)}
          </div>
        ))}
        {dateOptions.map((date) => {
          const active = date === selectedDate;
          const today = date === dateKey(new Date(), timezone);
          return (
            <button
              key={date}
              type="button"
              onClick={() => setSelectedDate(date)}
              className={`border-r border-t border-[#e4e4e4] py-3 font-semibold last:border-r-0 ${
                active ? "bg-[#b8b8b8] text-slate-950" : "bg-white hover:bg-slate-50"
              }`}
            >
              <span className={today ? "inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-600 text-white" : ""}>
                {dayNumber(date)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 rounded border border-[#d6d6d6] bg-[#f8f8f8] p-3">
        <h3 className="text-center text-lg font-bold">{weekday}</h3>
        <p className="text-center text-2xl font-medium">{restDate}</p>

        <select
          className="mt-4 h-10 w-full rounded border border-[#9f9f9f] bg-white px-3 text-base"
          value={timezone}
          onChange={(event) => setTimezone(event.target.value)}
        >
          {timezones.map((zone) => (
            <option key={zone} value={zone}>
              {timezoneLabel(zone)}
            </option>
          ))}
        </select>

        <AvailabilityTable
          title="Appointment Availability"
          loading={loading}
          error={error}
          rows={groupedSlots.length ? groupedSlots : fallbackSchedule ? fallbackSchedule.map((window) => ({ startLabel: window.from, endLabel: window.to })) : []}
          emptyText={availableToday ? "" : bookedSlots.length ? "No open slots left" : "No appointment slots"}
        />

        <div className="mt-4 rounded border border-[#d6d6d6] bg-white px-3 py-2 text-sm">
          <div className={`font-bold ${availableToday ? "text-[#4b861b]" : "text-[#a92828]"}`}>
            {slots.length
              ? `${slots.length} open slots on this date`
              : fallbackSchedule
                ? "Advisor is scheduled for this date"
                : "No open slots on this date"}
          </div>
          <div className="mt-1 text-slate-600">
            Advisor schedule: {windowLabel}
            {availability?.timezone ? ` in advisor timezone (${availability.timezone})` : ""}
          </div>
        </div>

        <div className="mt-4 border-t border-[#d6d6d6] pt-4">
          <h3 className="mb-3 inline-flex items-center gap-2 font-bold text-slate-950">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1f6f91] text-xs text-white">
              Cr
            </span>
            {labels.pricing || "Pricing"}
          </h3>
          <div className="space-y-2 text-sm">
            <PriceRow icon={<ChatIcon size={15} />} label="Chat" value={price(profile.pricing?.chatPerMin)} />
            <PriceRow icon={<PhoneIcon size={15} />} label="Call" value={price(profile.pricing?.callPerMin)} />
            <PriceRow icon={<VideoIcon size={15} />} label="Video" value={price(profile.pricing?.videoPerMin)} />
          </div>
          <BookingActions
            advisorId={advisorId}
            appStoreLink={footer.appStoreLink}
            playStoreLink={footer.playStoreLink}
            bookLabel={labels.bookSession || "Book a session"}
            messageLabel={labels.sendMessage || "Send message"}
            showMessage={false}
          />
          <p className="mt-3 inline-flex w-full items-center justify-center gap-1.5 text-xs text-slate-500">
            <ShieldCheckIcon size={13} className="text-[#1f6f91]" />
            Secure booking
          </p>
        </div>
      </div>
    </div>
  );
}

function AvailabilityTable({
  title,
  rows,
  loading,
  error,
  emptyText,
}: {
  title: string;
  rows: Array<{ startLabel: string; endLabel: string }>;
  loading: boolean;
  error: string;
  emptyText: string;
}) {
  return (
    <div className="mt-5">
      <h4 className="mb-2 text-center font-bold">{title}</h4>
      <div className="border border-[#cfcfcf] bg-white">
        {loading ? (
          <div className="px-3 py-3 text-center text-sm text-slate-500">Loading...</div>
        ) : error ? (
          <div className="px-3 py-3 text-center text-sm text-[#a92828]">{error}</div>
        ) : rows.length ? (
          rows.map((row, index) => (
            <div key={`${row.startLabel}-${row.endLabel}-${index}`} className="grid grid-cols-[1fr_48px_48px] border-b border-[#d6d6d6] last:border-b-0">
              <span className="px-3 py-2 text-center font-semibold">
                {row.startLabel} - {row.endLabel}
              </span>
              <span className="grid place-items-center border-l border-[#9fb7c0]">
                <PhoneIcon size={17} className="text-slate-900" />
              </span>
              <span className="grid place-items-center">
                <ChatIcon size={17} className="text-slate-900" />
              </span>
            </div>
          ))
        ) : (
          <div className="px-3 py-3 text-center text-sm text-slate-500">{emptyText}</div>
        )}
      </div>
    </div>
  );
}

function PriceRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="inline-flex items-center gap-2 text-slate-800">
        <span className="text-[#1f6f91]">{icon}</span>
        {label}
      </span>
      <span className="font-bold">{value}</span>
    </div>
  );
}
