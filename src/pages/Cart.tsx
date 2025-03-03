import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useCart } from "../hooks/useCart";
import OrderSummary from "../components/OrderSummary";
import { useNavigate } from "react-router-dom";

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, getTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <Container className="my-4">
      <h1>Cart</h1>
      <Row>
        <Col md={8} sm={12}>
          <OrderSummary
            items={cart}
            onRemove={removeFromCart}
            onUpdateQuantity={updateQuantity}
            total={getTotal()}
            showCheckout={cart.length > 0}
            onCheckout={handleCheckout}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
