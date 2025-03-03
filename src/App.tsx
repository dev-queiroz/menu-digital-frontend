import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Reservations from "./pages/Reservations";
import StaffDashboard from "./pages/StaffDashboard";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Header />
          <main className="container mt-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/staff" element={<StaffDashboard />} />
              <Route path="*" element={<h1>404 - Page Not Found</h1>} />
            </Routes>
          </main>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
