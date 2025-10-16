import { NavLink } from "react-router";

const Reservation = () => {
  return (
    <div className="bg-[url(/assets/images/unnamed.jpg)] h-[50vh] bg-bottom bg-no-repeat bg-cover mt-20">
      <div className="w-full h-full bg-black/40 flex flex-col justify-center px-8 gap-6 items-center">
        <h1 className="sm:text-6xl text-5xl font-bold">Want to make a reservation?</h1>
        <NavLink
          onClick={() => {
            window.scrollTo(0, 0);
          }}
          to="/reservation"
          className="hidden sm:block"
        >
          <button className="px-4 py-2 rounded-lg text-2xl bg-[#000000]  border border-[#ff2100] cursor-pointer">
            Click here
          </button>
        </NavLink>
        <NavLink
          onClick={() => {
            window.scrollTo(0, 0);
          }}
          to="/reservation"
          className="block sm:hidden"
        >
          <button className="px-4 py-2 rounded-lg text-2xl bg-[#000000]  border border-[#ff2100] cursor-pointer">
            Tap here
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default Reservation;
