import { motion } from "motion/react";
import { usePopUpStore } from "../../stores/popUpStore";

const Alert = () => {
  const { removeAlert, confirm } = usePopUpStore();
  const alert = usePopUpStore((state) => state.alert);
  const alertText = usePopUpStore((state) => state.alertText);
  const confirmation = usePopUpStore((state) => state.confirmation);

  return (
    <motion.div
      initial={{ visibility: "hidden" }}
      animate={{ visibility: alert ? "visible" : "hidden" }}
      className="z-1000 fixed top-0 flex justify-center items-center h-screen w-full bg-black/25 overflow-hidden"
      aria-modal="true"
      role="dialog"
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: alert ? 1 : 0,
          opacity: alert ? 1 : 0,
        }}
        className="flex flex-col gap-4 px-6 justify-center items-center bg-[#0e1113] sm:w-125 h-fit py-4 w-80 rounded-lg"
      >
        <p className="sm:text-[1.5rem]">{alertText}</p>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => removeAlert()}
            className="bg-[#ff2100] px-4 py-2 rounded-full"
          >
            Continue
          </button>
          {confirmation && (
            <button
              onClick={() => {
                removeAlert(false);
                confirm();
              }}
              className="border border-[#ff2100] px-4 py-2 rounded-full"
            >
              Cancel
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Alert;
