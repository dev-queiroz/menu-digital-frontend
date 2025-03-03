import React, { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { MenuItem, MenuVariant } from "../types";

interface MenuItemCardProps {
  item: MenuItem;
  variants: MenuVariant[];
  onAddToCart: (variant: MenuVariant, quantity: number) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  variants,
  onAddToCart,
}) => {
  const [selectedVariantId, setSelectedVariantId] = useState<number>(
    variants[0]?.id || 0
  );
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddToCart = () => {
    const variant = variants.find((v) => v.id === selectedVariantId);
    if (variant) {
      onAddToCart(variant, quantity);
      setQuantity(1); // Resetar quantidade após adicionar
    }
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{item.name}</Card.Title>
        <Card.Text>{item.description}</Card.Text>
        <Form.Group className="mb-2">
          <Form.Label>Variant</Form.Label>
          <Form.Select
            value={selectedVariantId}
            onChange={(e) => setSelectedVariantId(parseInt(e.target.value, 10))}
          >
            {variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.name} - ${(variant.price / 100).toFixed(2)}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
};

export default MenuItemCard;
