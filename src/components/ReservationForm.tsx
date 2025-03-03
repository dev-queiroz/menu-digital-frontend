import React, { FormEvent, useState } from "react";
import { Form, Button } from "react-bootstrap";

interface ReservationFormProps {
  onSubmit: (date: string, time: string, numberOfPeople: number) => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ onSubmit }) => {
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [numberOfPeople, setNumberOfPeople] = useState<number>(1);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(date, time, numberOfPeople);
    setDate("");
    setTime("");
    setNumberOfPeople(1);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Time</Form.Label>
        <Form.Control
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Number of People</Form.Label>
        <Form.Control
          type="number"
          min="1"
          value={numberOfPeople}
          onChange={(e) => setNumberOfPeople(parseInt(e.target.value, 10) || 1)}
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Make Reservation
      </Button>
    </Form>
  );
};

export default ReservationForm;
