import { useEffect, useState, useRef, useCallback } from "react";
import FoodCard from "./FoodCard";
import { BiFilter } from "react-icons/bi";
import { motion } from "motion/react";
import { BsDot } from "react-icons/bs";
import type { MenuItem } from "../../Interfaces/Interfaces";
import { apiUrl } from "../../config/constants";

const FullMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [filter, setFilter] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState("");
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (popupRef.current && popupRef.current.contains(target)) {
        return;
      }
      if (buttonRef.current && buttonRef.current.contains(target)) {
        return;
      }
      setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick, true); // use capture phase
    return () => {
      document.removeEventListener("mousedown", handleClick, true);
    };
  }, [isOpen]);

  const fetchMenu = useCallback(async () => {
    setStatus("load menu");
    try {
      const res = await fetch(apiUrl("menu"));
      const data: MenuItem[] = await res.json();
      setMenuItems(data);
      console.log(data);

      const uniqueTypes = Array.from(
        new Set(data.map((item: MenuItem) => item.category))
      );
      setCategories(uniqueTypes);
      setUniqueCategories(uniqueTypes);
      setStatus("");
    } catch (err) {
      console.error("Failed to load menu", err);
      setStatus("error");
    }
  }, [setStatus]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const addFilter = (fil: string) => {
    if (filter.includes(fil)) {
      setFilter(filter.filter((item) => fil !== item));
    } else {
      setFilter((prev) => [...prev, fil]);
    }
  };

  useEffect(() => {
    if (filter.length > 0) {
      setUniqueCategories(filter);
    } else {
      setUniqueCategories(categories);
    }
  }, [filter, categories]);

  // Filter menu items based on search term
  const getFilteredMenuItems = (category: string) => {
    let filtered = menuItems.filter(
      (item: MenuItem) => item.category === category
    );

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (item: MenuItem) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.description &&
            item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  };

  // Get categories that have items matching the search
  const getCategoriesWithResults = () => {
    if (!searchTerm.trim()) {
      return uniqueCategories;
    }

    return uniqueCategories.filter((category) => {
      return menuItems
        .filter((item: MenuItem) => item.category === category)
        .some(
          (item: MenuItem) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.description &&
              item.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });
  };

  return (
    <div className="sm:px-30 px-4">
      <section className="flex flex-col justify-center items-center pb-4">
        <h1 className="text-4xl font-bold">Our Menu</h1>
        <p className="text-xl text-[#ff2100]">
          Delicious. Bold. Unforgettable.
        </p>
      </section>
      <section className="relative flex justify-between items-center">
        <button
          ref={buttonRef}
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-0.5 border border-gray-500 rounded-lg cursor-pointer"
        >
          <BiFilter size={25} />
        </button>
        <motion.div
          ref={popupRef}
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0,
          }}
          className="absolute overflow-hidden"
        >
          <div className="px-4 py-2 rounded-lg bg-[#242729] ">
            <div className="divide-gray-500 divide-y">
              {categories.map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <p
                    className="py-1 cursor-pointer"
                    onClick={() => addFilter(_)}
                  >
                    {_}
                  </p>
                  {filter.includes(_) && <BsDot size={20} color="#33ff00" />}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        <input
          type="text"
          className="border border-gray-400 rounded-lg py-2 px-3 w-64"
          placeholder="Search menu items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </section>
      <section className="">
        {getCategoriesWithResults().length > 0 ? (
          getCategoriesWithResults().map((category, i) => {
            const filteredItems = getFilteredMenuItems(category);
            return (
              <div className="py-4" key={i}>
                <h1 className="text-xl font-bold border-b-2 border-b-[#ff2100] pb-2 mb-8">
                  {category.toUpperCase()}
                  {searchTerm.trim() && (
                    <span className="text-sm font-normal text-gray-400 ml-2">
                      ({filteredItems.length} result
                      {filteredItems.length !== 1 ? "s" : ""})
                    </span>
                  )}
                </h1>
                <div className="grid grid-cols-1 gap-x-8 gap-y-4 lg:grid-cols-2">
                  {filteredItems.map((item: MenuItem) => (
                    <FoodCard key={item._id} menuItem={item} />
                  ))}
                </div>
              </div>
            );
          })
        ) : searchTerm.trim() ? (
          <div className="h-[65vh] flex justify-center items-center gap-2">
            <div className="flex justify-center items-center flex-col gap-4">
              <p className="text-3xl text-gray-400">No menu items found</p>
              <p className="text-xl text-gray-500">
                Try searching for "{searchTerm}" with different keywords
              </p>
              <button
                className="bg-[#ff1200] rounded-lg px-4 py-2 cursor-pointer"
                onClick={() => setSearchTerm("")}
              >
                Clear Search
              </button>
            </div>
          </div>
        ) : (
          <div className="h-[65vh] flex justify-center items-center gap-2">
            {status === "load menu" && (
              <div className="flex items-center flex-col justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    ease: "linear",
                    repeat: Infinity,
                    duration: 1,
                  }}
                  className="size-10 flex justify-center items-center border-[#ff1200] border-r-transparent rounded-full border-2"
                >
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{
                      ease: "linear",
                      repeat: Infinity,
                      duration: 0.7,
                    }}
                    className="size-8 border-[#ff1200] border-r-transparent rounded-full border-2"
                  />
                </motion.div>
                <p className="text-xl text-gray-300">Loading menu...</p>
              </div>
            )}
            {status === "error" && (
              <div className="flex justify-center items-center flex-col gap-4">
                <p className="text-3xl text-gray-400">Error loading menu</p>
                <button
                  className="bg-[#ff1200] rounded-lg px-4 py-2 cursor-pointer"
                  onClick={fetchMenu}
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default FullMenu;
