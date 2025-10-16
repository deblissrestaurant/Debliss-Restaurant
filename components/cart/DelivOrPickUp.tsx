import { useState } from "react";
import { FaWalking } from "react-icons/fa";
import { MdOutlineDeliveryDining } from "react-icons/md";
import { RiCalendarScheduleLine } from "react-icons/ri";
import SchedulePopUp from "./SchedulePopUp";
import { usePopUpStore } from "../../stores/popUpStore";
import { useScheduleStore } from "../../stores/scheduleStore";

const DelivOrPickUp = ({
  deliveryMethod,
  setDeliveryMethod,
}: {
  deliveryMethod: string;
  setDeliveryMethod: (method: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { addPopUp, removePopUp } = usePopUpStore();

  const schedule = useScheduleStore(state => state.scheduledTime);
  // useEffect(() => {
  //   const stored = localStorage.getItem("slot");
  //   if (stored) setSchedule(stored);
  // }, []);

  return (
    <div className="px-4">
      {isOpen && (
        <div className="fixed bg-black/25 top-0 left-0 right-0 h-screen flex justify-center items-center">
          <SchedulePopUp
            action={() => {
              setIsOpen(false);
              removePopUp();
            }}
          />
        </div>
      )}
      <h1 className="text-xl font-bold sm:pt-0 pt-6 pb-2">
        Delivery or PickUp?
      </h1>
      <div className="flex items-center gap-2 mb-2">
        <label
          className="flex items-center w-full gap-2 cursor-pointer"
          htmlFor="delivery"
        >
          <div className="w-10 h-10 flex justify-center items-center">
            <MdOutlineDeliveryDining size={35} />
          </div>
          <div>
            <p>Delivery</p>
            <p className="text-base text-gray-500">30-40 min</p>
          </div>
        </label>
        <input
          className=" appearance-none w-6 h-6 bg-[#0e1113] border-gray-500 checked:border-[#ff2100] checked:border-7 rounded-full border-3 cursor-pointer "
          type="radio"
          name="deliveryMethod"
          id="delivery"
          checked={deliveryMethod === "delivery"}
          onChange={() => setDeliveryMethod("delivery")}
        />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <label
          className="flex items-center w-full gap-2 cursor-pointer"
          htmlFor="pickUp"
        >
          <div className="w-10 h-10 flex justify-center items-center">
            <FaWalking size={30} />
          </div>
          <div>
            <p>Pick Up</p>
            <p className="text-base text-gray-500">20-30 min</p>
          </div>
        </label>
        <input
          className=" appearance-none w-6 h-6 bg-[#0e1113] border-gray-500 checked:border-[#ff2100] checked:border-7 rounded-full border-3 cursor-pointer "
          type="radio"
          name="deliveryMethod"
          id="pickup"
          checked={deliveryMethod === "pickup"}
          onChange={() => setDeliveryMethod("pickup")}
        />
      </div>
      <div className="flex items-center gap-2">
        <label
          className="flex items-center w-full gap-2 cursor-pointer"
          htmlFor="schedule"
        >
          <div className="w-10 h-10 flex justify-center items-center">
            <RiCalendarScheduleLine size={30} />
          </div>
          <div>
            <p>Schedule</p>
            <p className="text-base text-gray-500">Select a time</p>
          </div>
        </label>
        <input
          className=" appearance-none w-6 h-6 bg-[#0e1113] border-gray-500 checked:border-[#ff2100] checked:border-7 rounded-full border-3 cursor-pointer "
          type="checkbox"
          name="schedule"
          id="schedule"
          checked={schedule !== null}
          onChange={() => {
            setIsOpen(true);
            addPopUp();
          }}
        />
      </div>
    </div>
  );
};

export default DelivOrPickUp;
