import { motion } from "motion/react";

const ReservationRules = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mt-12 text-center"
    >
      <div className="bg-[#181b1e] rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">
          Reservation Policy
        </h3>
        <div className="text-gray-300 space-y-2">
          <p>• Reservations must be made at least 2 hours in advance</p>
          <p>• Maximum table reservation is 4 tables with 6 chairs each</p>
          <p>• Whole restaurant bookings require 24-hour notice</p>
          <p>
            • Cancellations must be made at least 1 hour before reservation time
          </p>
          <p>
            • We'll contact you within 30 minutes to confirm your reservation
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ReservationRules;
