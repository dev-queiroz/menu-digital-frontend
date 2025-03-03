import React from "react";
import { Card, ListGroup, Button } from "react-bootstrap";
import { CartItem } from "../types";

interface OrderSummaryProps {
  items: CartItem[];
  onRemove: (variantId: number) => void;
  onUpdateQuantity: (variantId: number, quantity: number) => void;
  total: number;
  showCheckout?: boolean;
  onCheckout?: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  onRemove,
  onUpdateQuantity,
  total,
  showCheckout = false,
  onCheckout,
}) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Order Summary</Card.Title>
        {items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ListGroup variant="flush">
              {items.map((item) => (
                <ListGroup.Item key={item.variant.id}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      {item.variant.name} (
                      {(item.variant.price / 100).toFixed(2)})
                      <br />
                      Quantity:
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          onUpdateQuantity(
                            item.variant.id,
                            parseInt(e.target.value, 10) || 1
                          )
                        }
                        style={{ width: "60px", marginLeft: "5px" }}
                      />
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onRemove(item.variant.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <hr />
            <div className="d-flex justify-content-between">
              <strong>Total:</strong>
              <strong>${(total / 100).toFixed(2)}</strong>
            </div>
            {showCheckout && onCheckout && (
              <Button
                variant="success"
                className="mt-3 w-100"
                onClick={onCheckout}
              >
                Proceed to Checkout
              </Button>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default OrderSummary;
