import { NavLink } from "react-router";

const HeroSection = () => {
  const scrollToElement = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      <section className="h-screen bg-[url(/assets/images/HI.png)] bg-origin-border bg-center flex px-4">
        <div className="flex flex-col justify-center items-center sm:items-start sm:pl-12 w-full">
          <h1 className="text-5xl sm:text-5xl font-bold font-serif text-[#ff2100]">
            DE BLISS FOOD HUB
          </h1>
          <p className="sm:text-2xl text-xl font-bold mb-4  sm:px-0">
            Crafted with Love, Served with Joy
          </p>
          <div className="flex text-center justify-between w-full gap-4 px-4 sm:justify-start sm:px-0 sm:gap-4">
            <NavLink
              onClick={() => {
                window.scrollTo(0, 0);
              }}
              to="/menu"
            >
              <button className="w-38 py-2 rounded-lg bg-[#000000]  border border-[#ff2100] cursor-pointer">
                SEE MENU
              </button>
            </NavLink>
            <button
              onClick={() => scrollToElement("contact")}
              className="w-38 py-2 rounded-lg bg-[#000000]  border border-[#ff2100] cursor-pointer"
            >
              CONTACT US
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
