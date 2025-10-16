import { FaInstagram, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <div id="contact" className="bg-black mt-10 px-8 pt-10">
      <div className="border-b-2 border-b-[#ff2100] pb-6">
        <h1 className="lg:text-3xl md:text-3xl text-2xl mb-1 font-semibold">
          Do you have any questions?
        </h1>
        <p>Contact us and we'll answer all your questions</p>
      </div>
      <div className="flex flex-col gap-10 items-start pt-5 sm:flex-row">
        <a href="https://maps.app.goo.gl/8Hc4oTDfvq8ho64P7" target="_blank">
          <img
            src="https://res.cloudinary.com/dcbkvcif1/image/upload/v1756593040/image_bxyfww.png"
            alt="googleMapLink"
          />
        </a>
        <div className="py-4">
          <div className="flex flex-col gap-6">
            <h1 className="lg:text-xl md:text-xl">Contact Info</h1>
            <a href="https://maps.app.goo.gl/8Hc4oTDfvq8ho64P7" target="_blank">
              <span className="text-[#ff2100]/85">Address:</span> Ecobank,
              Madina
            </a>
            <p>
              <span className="text-[#ff2100]/85">Phone:</span> +233 25 628 6634
            </p>
            <p>
              <span className="text-[#ff2100]/85">Email:</span>{" "}
              debliss2024@gmail.com
            </p>
          </div>
        </div>
        <div className="py-4">
          <div className="flex flex-col gap-6">
            <h1 className="lg:text-xl md:text-xl">Opening Hours</h1>
            <p>
              <span className="text-[#ff2100]/85">Mon-Fri:</span> 8:00 AM -
              10:00 PM
            </p>
            <p>
              <span className="text-[#ff2100]/85">Sat-Sun:</span> 8:00 AM - 9:00
              Pm
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-8 py-4 text-xs lg:text-base md:text-base">
        <h1 className="font-bold">De Bliss</h1>
        <p>© 2025 De Bliss Restaurant</p>
        <div className="flex gap-4 justify-center items-center">
          <a
            target="_blank"
            href="https://www.instagram.com/deblissrestaurant/"
          >
            <FaInstagram />
          </a>
          <a
            target="_blank"
            href="https://api.whatsapp.com/send?phone=233256286634"
          >
            <FaWhatsapp />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
