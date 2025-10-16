import { useMemo, useState } from "react";
import { BiChevronDown, BiX } from "react-icons/bi";
import { useScheduleStore } from "../../stores/scheduleStore";
import { BsClock } from "react-icons/bs";

const OPEN_TIME = 10; // 10:00 AM
const CLOSE_TIME = 21; // 9:00 PM

function getTimeSlots(
  date: Date,
  startHour: number,
  endHour: number,
  intervalMinutes = 30
) {
  const slots: string[] = [];
  const slotDate = new Date(date);
  slotDate.setSeconds(0, 0);

  for (let hour = startHour; hour < endHour; hour += intervalMinutes / 60) {
    slotDate.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
    const label = slotDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    slots.push(label);
  }
  return slots;
}

function isRestaurantOpen() {
  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60;
  return currentHour >= OPEN_TIME && currentHour < CLOSE_TIME;
}

function getAvailableSlots() {
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  // If restaurant is closed, return info about when it opens
  if (!isRestaurantOpen()) {
    const currentHour = now.getHours() + now.getMinutes() / 60;

    if (currentHour < OPEN_TIME) {
      // Before opening - show today's slots starting from opening time
      return {
        date: today,
        slots: getTimeSlots(today, OPEN_TIME, CLOSE_TIME),
        isOpen: false,
        message: `Restaurant opens at ${OPEN_TIME}:00 AM. You can schedule for today or later.`,
      };
    } else {
      // After closing - show tomorrow's slots
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return {
        date: tomorrow,
        slots: getTimeSlots(tomorrow, OPEN_TIME, CLOSE_TIME),
        isOpen: false,
        message: `Restaurant is closed. Next available slots are tomorrow from ${OPEN_TIME}:00 AM to ${CLOSE_TIME}:00 PM.`,
      };
    }
  }

  // Restaurant is open - show remaining slots for today
  const nextSlot = new Date(now);
  nextSlot.setSeconds(0, 0);

  // Round up to next 30-minute slot
  if (nextSlot.getMinutes() < 30) {
    nextSlot.setMinutes(30, 0, 0);
  } else {
    nextSlot.setHours(nextSlot.getHours() + 1, 0, 0, 0);
  }

  const startHour = Math.max(
    OPEN_TIME,
    nextSlot.getHours() + nextSlot.getMinutes() / 60
  );

  // If no more slots today, show tomorrow
  if (startHour >= CLOSE_TIME) {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return {
      date: tomorrow,
      slots: getTimeSlots(tomorrow, OPEN_TIME, CLOSE_TIME),
      isOpen: true,
      message:
        "No more slots available today. Showing tomorrow's availability.",
    };
  }

  return {
    date: today,
    slots: getTimeSlots(today, startHour, CLOSE_TIME),
    isOpen: true,
    message: null,
  };
}

const SchedulePopUp = ({ action }: { action: () => void }) => {
  const { date, slots, isOpen, message } = useMemo(getAvailableSlots, []);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [localSchedule, setLocalSchedule] = useState("");

  const { setScheduledTime, clearSchedule, getScheduleString } =
    useScheduleStore();
  const currentSchedule = getScheduleString();

  const handleScheduleSelect = (timeSlot: string) => {
    setLocalSchedule(timeSlot);
    setScheduledTime(timeSlot, date);
    setDropdownOpen(false);
  };

  const handleClearSchedule = () => {
    setLocalSchedule("");
    clearSchedule();
    setDropdownOpen(false);
  };

  const handleContinue = () => {
    // If no local schedule selected but there's a stored schedule, keep it
    if (!localSchedule && !currentSchedule) {
      // No schedule selected - continue with immediate order
    }
    action();
  };

  return (
    <div className="p-6 rounded-lg bg-[#0e1113] text-[#f3f4f6] shadow-lg shadow-black/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#e5e7eb] text-lg font-semibold flex items-center gap-2">
          <BsClock className="text-[#ff1200]" />
          Schedule Delivery
        </h3>
      </div>

      {/* Restaurant Status Message */}
      {message && (
        <div
          className={`p-3 rounded-md mb-4 ${
            isOpen
              ? "bg-blue-900/20 border border-blue-700 text-blue-200"
              : "bg-yellow-900/20 border border-yellow-700 text-yellow-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <BsClock className="flex-shrink-0" />
            <span className="text-sm">{message}</span>
          </div>
        </div>
      )}

      {/* Current Schedule Display */}
      {currentSchedule && !localSchedule && (
        <div className="mb-4 p-3 bg-[#ff1200]/10 border border-[#ff1200]/30 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#cbd5e1]">Current Schedule:</p>
              <p className="text-[#ff1200] font-semibold">{currentSchedule}</p>
            </div>
            <button
              onClick={handleClearSchedule}
              className="text-gray-400 hover:text-white transition-colors"
              title="Clear schedule"
            >
              <BiX size={20} />
            </button>
          </div>
        </div>
      )}

      <div>
        <div className="mb-3">
          <strong className="text-[#cbd5e1]">
            Available for:{" "}
            {date.toLocaleDateString(undefined, {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </strong>
          <p className="text-sm text-gray-400 mt-1">
            Operating Hours: {OPEN_TIME}:00 AM - {CLOSE_TIME}:00 PM
          </p>
        </div>

        <div className="relative mt-3 w-full">
          <button
            type="button"
            className="w-full flex justify-between items-center cursor-pointer p-3 bg-[#181c1f] text-[#f3f4f6] border border-[#23272b] rounded focus:border-[#ff1200] focus:outline-none focus:ring-2 focus:ring-[#ff1200] text-left"
            onClick={() => setDropdownOpen((open) => !open)}
          >
            <span>
              {localSchedule || currentSchedule || "Order now (no scheduling)"}
            </span>
            <BiChevronDown
              size={20}
              className={`transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto bg-[#181c1f] border border-[#23272b] rounded shadow-lg">
              <div
                onClick={handleClearSchedule}
                className={`px-4 py-3 cursor-pointer hover:bg-[#ff1200] hover:text-white border-b border-[#23272b] ${
                  !localSchedule && !currentSchedule ? "bg-[#23272b]" : ""
                }`}
              >
                <div className="font-medium">Order Now</div>
                <div className="text-xs text-gray-400">
                  No scheduling - immediate preparation
                </div>
              </div>

              {slots.length > 0 ? (
                slots.map((slot) => (
                  <div
                    key={slot}
                    onClick={() => handleScheduleSelect(slot)}
                    className={`px-4 py-3 cursor-pointer hover:bg-[#ff1200] hover:text-white ${
                      localSchedule === slot ? "bg-[#23272b]" : ""
                    }`}
                  >
                    <div className="font-medium">{slot}</div>
                    <div className="text-xs text-gray-400">
                      Scheduled delivery
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-400 text-center">
                  No available time slots
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Selected Schedule Confirmation */}
      {(localSchedule || currentSchedule) && (
        <div className="mt-4 p-3 bg-green-900/20 border border-green-700 rounded-md">
          <div className="text-green-200">
            <div className="font-semibold flex items-center gap-2">
              <BsClock size={16} />
              Scheduled for:
            </div>
            <div className="text-green-100 mt-1">
              {date.toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}{" "}
              at{" "}
              {localSchedule ||
                (currentSchedule ? currentSchedule.split(" at ")[1] : "")}
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center items-center pt-6">
        <button
          onClick={handleContinue}
          className="w-full bg-[#ff1200] hover:bg-[#ff1200]/90 transition-colors py-3 px-6 rounded-lg cursor-pointer font-semibold"
        >
          {localSchedule || currentSchedule
            ? "Continue with Schedule"
            : "Continue (Order Now)"}
        </button>
      </div>
    </div>
  );
};

export default SchedulePopUp;
