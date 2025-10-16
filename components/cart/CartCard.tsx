import { BiMinus, BiPlus, BiTrash } from "react-icons/bi";
import { useCartStore } from "../../stores/cartStore";
import type { Accompaniment } from "../../Interfaces/Interfaces";

const CartCard = ({
  name,
  description,
  price,
  quantity,
  id,
  accompaniments,
  specialNote,
}: {
  name: string;
  description: string;
  price: string;
  quantity: number;
  id: string;
  accompaniments: Accompaniment[] | undefined;
  specialNote?: string;
}) => {
  const { updateQuantity, removeFromCart } = useCartStore();

  return (
    <div className="bg-[#181c1f] flex items-center justify-between gap-4 rounded-lg p-3 sm:p-4 border border-gray-600">
      <div className="flex items-center gap-4 ">
        <div>
          <p className="">
            {name}{" "}
            {accompaniments && (
              <span>
                with{" "}
                {accompaniments.map((accompaniment) => (
                  <span key={accompaniment._id}>
                    {accompaniment.name}
                    {accompaniment !==
                      accompaniments[accompaniments.length - 1] &&
                      accompaniments.length > 1 &&
                      ", "}
                  </span>
                ))}
              </span>
            )}
          </p>
          <p
            className="text-gray-400 overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </p>
          {specialNote && (
            <p className="text-yellow-400 text-sm italic">
              Note: {specialNote}
            </p>
          )}
          <p className="text-[0.825rem]">Price: GH₵{price}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex py-0.5 justify-center items-center w-fit px-2 border border-gray-500 rounded-lg">
          <button
            onClick={() =>
              quantity > 1
                ? updateQuantity(id, quantity - 1)
                : removeFromCart(id)
            }
          >
            <BiMinus />
          </button>
          <input
            type="number"
            min={1}
            className="w-8 h-8 text-center rounded flex items-center justify-center appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-0"
            value={quantity}
            readOnly
          />
          <button onClick={() => updateQuantity(id, quantity + 1)}>
            <BiPlus />
          </button>
        </div>
        <button onClick={() => removeFromCart(id)} className=" cursor-pointer">
          <BiTrash />
        </button>
      </div>
    </div>
  );
};

export default CartCard;
