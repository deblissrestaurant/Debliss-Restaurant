import { BsHeartFill, BsStars } from "react-icons/bs";
import { GiThreeFriends } from "react-icons/gi";
import { TbTargetArrow } from "react-icons/tb";
import Header from "../components/general/Header";
import { FaAward, FaHeartbeat, FaHome } from "react-icons/fa";
import { IoRestaurant } from "react-icons/io5";
import { FaPeopleRoof } from "react-icons/fa6";
import { NavLink } from "react-router";
import Footer from "../components/general/Footer";
import { motion } from "motion/react";
import AnimatedCounter from "../components/general/AnimatedCounter";

const About = () => {
  const parent = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const child = {
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-[#0e1113] overflow-hidden">
      <Header />

      {/* Hero Section */}
      <div className="relative">
        <div className="bg-gradient-to-r pt-20 from-[#ff1200] to-[#d81b00] text-white pb-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              About De Bliss Food Hub
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              From Mrs. Esther's kitchen to your table
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Our Story Section */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "linear" }}
                className="text-3xl font-bold text-white mb-6"
              >
                Mrs. Esther Wunu's Story
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "linear" }}
                className="text-gray-300 mb-4 leading-relaxed"
              >
                What started as a simple hobby for Mrs. Esther Wunu has
                blossomed into something beautiful. Cooking has always been her
                passion – a way to express creativity, show love, and bring
                people together around the table. It wasn't until her friends
                began encouraging her to turn this passion into something more
                that she realized she had a gift worth sharing.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "linear" }}
                className="text-gray-300 mb-4 leading-relaxed"
              >
                Mrs. Esther's husband has been her greatest inspiration and
                biggest supporter. He believed in her culinary skills so much
                that he would invite his friends over every weekend, proudly
                telling them they were about to experience his wife's delicious
                meals. Those weekend gatherings became legendary among their
                circle – filled with laughter, great conversations, and
                unforgettable food.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "linear" }}
                className="text-gray-300 leading-relaxed"
              >
                Watching the joy on people's faces as they savored each bite,
                seeing friendships strengthen over shared meals, and hearing the
                countless suggestions to "open a restaurant" – that's when De
                Bliss was born. This restaurant is the culmination of Mrs.
                Esther Wunu's love, her friends' encouragement, and a dream
                nurtured by the most important people in her life.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "linear" }}
              className="bg-[#181c1f] rounded-lg border border-gray-600 p-8 h-full flex justify-center items-center"
            >
              <div className="text-center">
                <div className="bg-[#ff1200] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">
                    <BsHeartFill />
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Cooked with Love
                </h3>
                <p className="text-gray-300">
                  Every dish carries the same love and care that Mrs. Esther
                  started in her family kitchen.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Journey Section */}
        <div className="bg-[#181c1f] rounded-lg border border-gray-600 p-8 mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Mrs. Esther's Journey
          </h2>
          <motion.div
            variants={parent}
            initial="hidden"
            whileInView="visible"
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div variants={child} className="text-center">
              <div className="bg-[#ff1200] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">
                  <FaHome />
                </span>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">
                It Started at Home
              </h4>
              <p className="text-gray-300">
                Weekend gatherings with friends, Mrs. Esther experimenting with
                recipes, and creating memorable dining experiences in her own
                kitchen.
              </p>
            </motion.div>

            <motion.div variants={child} className="text-center">
              <div className="bg-[#ff1200] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">
                  <GiThreeFriends />
                </span>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">
                Friends Believed
              </h4>
              <p className="text-gray-300">
                The constant encouragement from friends who experienced Mrs.
                Esther's cooking gave her the confidence to dream bigger.
              </p>
            </motion.div>

            <motion.div variants={child} className="text-center">
              <div className="bg-[#ff1200] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">
                  <IoRestaurant />
                </span>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">
                De Bliss Was Born
              </h4>
              <p className="text-gray-300">
                With her husband's unwavering support and friends'
                encouragement, Mrs. Esther turned passion into purpose.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Mission & Vision */}
        <motion.div
          variants={parent}
          initial="hidden"
          whileInView="visible"
          className="grid md:grid-cols-2 gap-8 mb-16"
        >
          <motion.div
            variants={child}
            className="bg-[#181c1f] rounded-lg border border-gray-600 p-8"
          >
            <div className="flex items-center mb-4">
              <div className="bg-[#ff1200] w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                <span className="text-xl">
                  <TbTargetArrow />
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white">Our Mission</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              To recreate the warmth and joy of Mrs. Esther's weekend gatherings
              for every customer. We're committed to serving meals that don't
              just satisfy hunger, but create connections, spark conversations,
              and make every dining experience feel like you're sharing a meal
              with family.
            </p>
          </motion.div>

          <motion.div
            variants={child}
            className="bg-[#181c1f] rounded-lg border border-gray-600 p-8"
          >
            <div className="flex items-center mb-4">
              <div className="bg-[#ff1200] w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                <span className="text-xl">
                  <BsStars />
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white">Our Vision</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              To become a place where food brings people together, just like it
              did in Mrs. Esther's home. We envision De Bliss as more than a
              restaurant – it's a community hub where every meal is prepared
              with the same love and attention that made her weekend gatherings
              special.
            </p>
          </motion.div>
        </motion.div>

        {/* Values Section */}
        <div className="mb-16 ">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            What Drives Us
          </h2>
          <motion.div
            variants={parent}
            initial="hidden"
            whileInView="visible"
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div variants={child} className="text-center ">
              <div className="bg-[#181c1f] h-full flex flex-col rounded-lg border border-gray-600 p-6 hover:border-[#ff1200] transition-colors ">
                <div className="bg-[#ff1200] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">
                    <FaHeartbeat />
                  </span>
                </div>
                <h4 className="text-xl font-bold text-white mb-3">
                  Love & Passion
                </h4>
                <p className="text-gray-300">
                  Every recipe is crafted with the same love that started Mrs.
                  Esther's journey. Cooking isn't just our profession – it's our
                  passion.
                </p>
              </div>
            </motion.div>

            <motion.div variants={child} className="text-center">
              <div className="bg-[#181c1f] h-full flex flex-col rounded-lg border border-gray-600 p-6 hover:border-[#ff1200] transition-colors ">
                <div className="bg-[#ff1200] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">
                    <FaPeopleRoof />
                  </span>
                </div>
                <h4 className="text-xl font-bold text-white mb-3">Community</h4>
                <p className="text-gray-300">
                  Inspired by the friendships forged over Mrs. Esther's dining
                  table, we believe food has the power to bring people together.
                </p>
              </div>
            </motion.div>

            <motion.div variants={child} className="text-center">
              <div className="bg-[#181c1f] h-full flex flex-col rounded-lg border border-gray-600 p-6 hover:border-[#ff1200] transition-colors ">
                <div className="bg-[#ff1200] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">
                    <FaAward />
                  </span>
                </div>
                <h4 className="text-xl font-bold text-white mb-3">
                  Excellence
                </h4>
                <p className="text-gray-300">
                  From hobby to profession, we maintain the same attention to
                  detail and quality that made Mrs. Esther's weekend meals
                  unforgettable.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <div className="bg-[#181c1f] rounded-lg border border-gray-600 p-8 mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Our Growing Family
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#ff1200] mb-2">
                <AnimatedCounter from={0} to={500} suffix="+" />
              </div>
              <p className="text-gray-300">Weekend Guests Served</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#ff1200] mb-2">
                <AnimatedCounter from={0} to={10} suffix="K+" />
              </div>
              <p className="text-gray-300">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#ff1200] mb-2">
                <AnimatedCounter from={0} to={50} suffix="+" />
              </div>
              <p className="text-gray-300">Signature Recipes</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#ff1200] mb-2">
                <AnimatedCounter from={0} to={10000} infinite={true} />
              </div>
              <p className="text-gray-300">Love in Every Dish</p>
            </div>
          </div>
        </div>

        {/* Personal Touch Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            The Heart Behind De Bliss
          </h2>
          <div className="gap-8">
            <div className="bg-[#181c1f] rounded-lg border border-gray-600 p-6 text-center">

              <h4 className="text-xl font-bold text-white mb-2">
                Mrs. Esther Wunu
              </h4>
              <p className="text-[#ff1200] mb-3">Chef & Founder</p>
              <p className="text-gray-300 text-sm">
                What began as a hobby has become a calling. Mrs. Esther's
                passion for cooking transformed weekend gatherings into a dream
                restaurant that serves love on every plate.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="border border-[#ff1200] rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join Our Extended Family
          </h2>
          <p className="text-xl text-white mb-6 opacity-90">
            Experience the same warmth and delicious flavors that started Mrs.
            Esther's journey
          </p>
          <NavLink
            onClick={() => {
              window.scrollTo(0, 0);
            }}
            to="/menu"
          >
            <button className="bg-[#ff1200] px-8 py-3 rounded-lg font-bold">
              Order Your First Meal
            </button>
          </NavLink>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
