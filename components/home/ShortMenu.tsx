import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import type { MenuItem } from "../../Interfaces/Interfaces";
import { apiUrl } from "../../config/constants";

const ShortMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const getItems = async () => {
      const res = await fetch(apiUrl("menu"));
      const data: MenuItem[] = await res.json();
      // Get 5 random items
      const shuffled = data
        .filter(({ category }) => category !== "EXTRA ZONE")
        .sort(() => 0.5 - Math.random());
      setMenuItems(shuffled.slice(0, 5));
    };
    getItems();
  }, []);

  useEffect(() => {
    console.log(menuItems);
  }, [menuItems]);

  return (
    <section
      className="px-4 sm:px-8 flex flex-col gap-2 pt-12 sm:pt-20"
      id="menu"
    >
      <h1 className="text-2xl sm:text-3xl font-bold">Explore Our Menu</h1>
      <p className="text-sm sm:text-base text-gray-300">
        Signature dishes for every taste - from classic recipies to bold
        culinary experiments
      </p>
      <NavLink
        onClick={() => {
          window.scrollTo(0, 0);
        }}
        to="/menu"
      >
        <button className="px-4 py-2 mb-4 sm:mb-2 rounded-lg border border-[#ff1200] w-fit cursor-pointer text-sm sm:text-base hover:bg-[#ff1200] transition">
          View more
        </button>
      </NavLink>
      {menuItems.length > 0 && (
        <NavLink
          onClick={() => {
            window.scrollTo(0, 0);
          }}
          to="/menu"
        >
          <div className="min-h-screen sm:h-screen flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Mobile: Single column layout */}
            <div className="flex sm:hidden flex-col gap-3">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="w-full h-48 bg-gray-400 overflow-hidden relative rounded-lg"
                >
                  <div className="w-full h-full">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 w-full text-right bg-gradient-to-t from-[#464646] to-transparent p-2">
                    <p className="text-sm">
                      {item.name} -{" "}
                      <span className="text-[#ff1200] font-bold">
                        GH₵{item.price}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Bento grid layout */}
            <div className="hidden sm:flex w-2/3 flex-col gap-4">
              <div className="w-full h-2/3 bg-gray-400 overflow-hidden relative rounded-lg">
                <div className="w-full h-full">
                  <img
                    src={menuItems[0].image}
                    alt={menuItems[0].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 w-full text-right bg-gradient-to-t from-[#464646] to-transparent p-2">
                  <p>
                    {menuItems[0].name} -{" "}
                    <span className="text-[#ff1200] font-bold">
                      GH₵{menuItems[0].price}
                    </span>
                  </p>
                </div>
              </div>
              <div className="h-1/3 flex gap-4">
                <div className="bg-gray-400 overflow-hidden relative rounded-lg h-full w-1/2">
                  <div className="w-full h-full">
                    <img
                      src={menuItems[1].image}
                      alt={menuItems[1].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 w-full text-right bg-gradient-to-t from-[#464646] to-transparent p-2">
                    <p>
                      {menuItems[1].name} -{" "}
                      <span className="text-[#ff1200] font-bold">
                        GH₵{menuItems[1].price}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="bg-gray-400 overflow-hidden relative rounded-lg h-full w-1/2">
                  <div className="w-full h-full">
                    <img
                      src={menuItems[2].image}
                      alt={menuItems[2].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 w-full text-right bg-gradient-to-t from-[#464646] to-transparent p-2">
                    <p>
                      {menuItems[2].name} -{" "}
                      <span className="text-[#ff1200] font-bold">
                        GH₵{menuItems[2].price}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex w-1/3 flex-col gap-4">
              <div className="w-full h-1/2 bg-gray-400 overflow-hidden relative rounded-lg">
                <div className="w-full h-full">
                  <img
                    src={menuItems[3].image}
                    alt={menuItems[3].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 w-full text-right bg-gradient-to-t from-[#464646] to-transparent p-2">
                  <p>
                    {menuItems[3].name} -{" "}
                    <span className="text-[#ff1200] font-bold">
                      GH₵{menuItems[3].price}
                    </span>
                  </p>
                </div>
              </div>
              <div className="w-full h-1/2 bg-gray-400 overflow-hidden relative rounded-lg">
                <div className="w-full h-full">
                  <img
                    src={menuItems[4].image}
                    alt={menuItems[4].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 w-full text-right bg-gradient-to-t from-[#464646] to-transparent p-2">
                  <p>
                    {menuItems[4].name} -{" "}
                    <span className="text-[#ff1200] font-bold">
                      GH₵{menuItems[4].price}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </NavLink>
      )}
    </section>
  );
};

export default ShortMenu;
