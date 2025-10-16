import { Helmet } from "react-helmet";
import Header from "../components/general/Header";
import OrderContent from "../components/order/OrderContent";
import Footer from "../components/general/Footer";

const Orders = () => {
  return (
    <div>
      <Helmet>
        <title>Orders | DE BLISS</title>
        <meta name="orders" content="Your orders" />
      </Helmet>
      <Header />
      <OrderContent />
      <Footer />
    </div>
  );
};

export default Orders;
