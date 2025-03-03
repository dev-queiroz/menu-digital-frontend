import React, { useState } from "react";
import { Container, Card, Alert } from "react-bootstrap";
import ReservationForm from "../components/ReservationForm"; // Importação correta
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { createReservation } from "../api/reservationApi";
import { Reservation } from "../types";

const Reservations: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleReservationSubmit = async (
    date: string,
    time: string,
    numberOfPeople: number
  ) => {
    try {
      setError(null);
      setSuccess(null);
      const reservation: Reservation = await createReservation(
        date,
        time,
        numberOfPeople
      );
      setSuccess(`Reservation #${reservation.id} created successfully!`);
    } catch (err: any) {
      setError(
        err.message || "Failed to create reservation. Please try again."
      );
      console.error("Reservation error:", err);
    }
  };

  return (
    <Container className="my-4">
      <h1>Make a Reservation</h1>
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Card className="mt-3" style={{ maxWidth: "400px" }}>
        <Card.Body>
          <ReservationForm onSubmit={handleReservationSubmit} />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Reservations;
