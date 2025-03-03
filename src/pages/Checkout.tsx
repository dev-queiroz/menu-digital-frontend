import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCart } from "../hooks/useCart";
import { createOrder } from "../api/orderApi";
import PaymentForm from "../components/PaymentForm";
import OrderSummary from "../components/OrderSummary";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || ""
);

const Checkout: React.FC = () => {
  const { cart, getTotal, clearCart } = useCart();
  const [orderId, setOrderId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const createOrderOnLoad = async () => {
      if (cart.length === 0) {
        navigate("/cart");
        return;
      }
      try {
        const orderItems = cart.map((item) => ({
          variant_id: item.variant.id,
          quantity: item.quantity,
        }));
        const order = await createOrder(orderItems);
        setOrderId(order.id);
      } catch (err) {
        setError("Failed to create order. Please try again.");
        console.error("Create order error:", err);
      }
    };
    if (!orderId) {
      createOrderOnLoad();
    }
  }, [cart, orderId, navigate]);

  const handlePaymentSuccess = () => {
    clearCart();
    navigate("/");
    alert("Order placed successfully!");
  };

  if (!orderId && !error) {
    return (
      <Container className="my-4">
        <h1>Creating order...</h1>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h1>Checkout</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Col md={6} sm={12}>
          <Card>
            <Card.Body>
              <Card.Title>Payment for Order #{orderId}</Card.Title>
              <Elements stripe={stripePromise}>
                <PaymentForm
                  orderId={orderId || 0} // orderId será definido pelo useEffect
                  amount={getTotal()}
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} sm={12}>
          <OrderSummary
            items={cart}
            onRemove={() => {}} // Desabilitado no checkout
            onUpdateQuantity={() => {}} // Desabilitado no checkout
            total={getTotal()}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;
