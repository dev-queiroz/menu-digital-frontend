import React, { FormEvent, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button, Form } from "react-bootstrap";
import { initiatePayment, confirmPayment } from "../api/paymentApi";

interface PaymentFormProps {
  orderId: number;
  amount: number;
  onSuccess: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  orderId,
  amount,
  onSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    try {
      setError(null);
      const clientSecret = await initiatePayment(orderId, amount);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        setError(result.error.message || "Payment failed");
      } else if (result.paymentIntent?.status === "succeeded") {
        await confirmPayment(result.paymentIntent.id);
        onSuccess();
      }
    } catch (err) {
      setError("An error occurred during payment");
      console.error("Payment error:", err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Card Details</Form.Label>
        <CardElement className="form-control" />
      </Form.Group>
      {error && <p className="text-danger">{error}</p>}
      <Button
        variant="success"
        type="submit"
        disabled={!stripe}
        className="w-100"
      >
        Pay ${(amount / 100).toFixed(2)}
      </Button>
    </Form>
  );
};

export default PaymentForm;
