import React, { useEffect, useState } from "react";
import { Container, Card, ListGroup, Button, Alert } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";
import { Order } from "../types";
import { updateOrderStatus } from "../api/orderApi";
import { useOrderUpdates } from "../hooks/useRealtime";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const StaffDashboard: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get("/orders");
        setOrders(response.data.data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load orders.");
        console.error("Fetch orders error:", err);
      }
    };
    if (user?.role === "staff" || user?.role === "admin") {
      fetchOrders();
    }
  }, [user]);

  useOrderUpdates(user?.id || "", (updatedOrder: Order) => {
    setOrders((prev) => {
      const exists = prev.some((order) => order.id === updatedOrder.id);
      if (exists) {
        return prev.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        );
      }
      return [...prev, updatedOrder];
    });
  });

  const handleUpdateStatus = async (
    orderId: number,
    status: Order["status"]
  ) => {
    try {
      setError(null);
      const updatedOrder = await updateOrderStatus(orderId, status);
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? updatedOrder : order))
      );
    } catch (err: any) {
      setError(err.message || "Failed to update order status.");
      console.error("Update status error:", err);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  if (user.role !== "staff" && user.role !== "admin") {
    return (
      <Container className="my-4">
        <Alert variant="danger">Access Denied</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h1>Staff Dashboard</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Card>
        <Card.Body>
          <Card.Title>Active Orders</Card.Title>
          {orders.length === 0 ? (
            <p>No active orders.</p>
          ) : (
            <ListGroup>
              {orders.map((order) => (
                <ListGroup.Item key={order.id}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      Order #{order.id} - $
                      {(order.total_amount / 100).toFixed(2)}
                      <br />
                      Status: {order.status}
                    </div>
                    <div>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() =>
                          handleUpdateStatus(order.id, "preparing")
                        }
                        disabled={order.status !== "pending"}
                      >
                        Prepare
                      </Button>{" "}
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleUpdateStatus(order.id, "ready")}
                        disabled={order.status !== "preparing"}
                      >
                        Ready
                      </Button>{" "}
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() =>
                          handleUpdateStatus(order.id, "delivered")
                        }
                        disabled={order.status !== "ready"}
                      >
                        Deliver
                      </Button>{" "}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleUpdateStatus(order.id, "canceled")}
                        disabled={
                          order.status === "delivered" ||
                          order.status === "canceled"
                        }
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StaffDashboard;
