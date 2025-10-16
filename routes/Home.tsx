import { Helmet } from "react-helmet";
import Auth from "../auth/Auth";
import Footer from "../components/general/Footer";
import Header from "../components/general/Header";
import About from "../components/home/About";
import HeroSection from "../components/home/HeroSection";
import ShortMenu from "../components/home/ShortMenu";
import Reservation from "../components/home/Reservation";
import Alert from "../components/general/Alert";

export default function Home() {

  
  return (
    <div>
      <Helmet>
        <title>DE BLISS</title>
        <meta name="home" content="Welcome to De Bliss!" />
      </Helmet>
      <Alert/>
      <Auth />
      <Header />
      <HeroSection />
      <ShortMenu />
      <Reservation/>
      <About />
      <Footer />
    </div>
  );
}
