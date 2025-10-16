import { Route, Routes } from "react-router";
import Home from "./routes/Home";
import Menu from "./routes/Menu";
import Cart from "./routes/Cart";
import Orders from "./routes/Orders";
import CurrentReservations from "./routes/CurrentReservations";
import AdminOrders from "./admin/AdminOrders";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import AdminMenuItems from "./admin/AdminMenuItems";
import AdminAccompaniments from "./admin/AdminAccompaniments";
import CreateRole from "./admin/CreateRole";
import RiderDashboard from "./routes/RiderDashboard";
import { useUserStore } from "./stores/userStore";
import { usePopUpEffects, useUserEffects } from "./hooks";
import About from "./routes/About";
import Reservation from "./routes/Reservation";
import AdminReservations from "./admin/AdminReservations";
import Alert from "./components/general/Alert";

const App = () => {
  const user = useUserStore((state) => state.user);

  usePopUpEffects();
  useUserEffects();

  return (
    <>
      <Alert />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/current-reservations" element={<CurrentReservations />} />
        <Route path="/reservation" element={<Reservation />} />
        {user && user?.role === "admin" && (
          <Route path="/admin">
            <Route index element={<AdminOrders />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="menu" element={<AdminMenuItems />} />
            <Route path="accompaniments" element={<AdminAccompaniments />} />
            <Route path="roles" element={<CreateRole />} />
            <Route path="reservations" element={<AdminReservations />} />
          </Route>
        )}
        <Route path="/auth">
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>
        <Route path="/rider" element={<RiderDashboard />} />
      </Routes>
    </>
  );
};

export default App;
