import React, { useEffect, useState } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { getMenuItems } from "../api/menuApi";
import MenuItemCard from "../components/MenuItemCard";
import { MenuItem, MenuVariant } from "../types";
import { useCart } from "../hooks/useCart";

const Home: React.FC = () => {
  const [menu, setMenu] = useState<{
    items: MenuItem[];
    variants: MenuVariant[];
  }>({
    items: [],
    variants: [],
  });
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getMenuItems();
        setMenu(data);
      } catch (err) {
        setError("Failed to load menu. Please try again later.");
        console.error("Fetch menu error:", err);
      }
    };
    fetchMenu();
  }, []);

  return (
    <Container>
      <h1 className="my-4">Menu</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {menu.items.length === 0 && !error ? (
        <p>No menu items available.</p>
      ) : (
        <Row>
          {menu.items.map((item) => (
            <Col key={item.id} md={4} sm={6} xs={12}>
              <MenuItemCard
                item={item}
                variants={menu.variants.filter((v) => v.item_id === item.id)}
                onAddToCart={addToCart}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Home;
