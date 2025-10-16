import { motion } from "motion/react";
import Footer from "../components/general/Footer";
import Header from "../components/general/Header";
import ReservationFrom from "../components/reservation/ReservationFrom";
import ReservationRules from "../components/reservation/ReservationRules";

const Reservation = () => {
  return (
    <div className="min-h-screen bg-[#0e1113]">
      <Header />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl sm:text-6xl font-bold text-[#ff2100] mb-4">
              MAKE A RESERVATION
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Reserve your perfect dining experience at De Bliss Food Hub.
              Choose your preferred setup and let us create an unforgettable
              meal for you.
            </p>
          </motion.div>

          <ReservationFrom />

          <ReservationRules />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Reservation;
