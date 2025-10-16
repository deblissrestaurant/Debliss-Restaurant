import { Helmet } from "react-helmet";
import Header from "../components/general/Header";
import CartContent from "../components/cart/CartContent";
import Footer from "../components/general/Footer";
import { useLocationEffects } from "../hooks";

const Cart = () => {
  useLocationEffects();

  return (
    <div>
      <Helmet>
        <title>Cart | DE BLISS"</title>
        <meta name="cart" content="Your Cart" />
      </Helmet>
      <Header />
      <CartContent />
      <Footer />
    </div>
  );
};

export default Cart;
