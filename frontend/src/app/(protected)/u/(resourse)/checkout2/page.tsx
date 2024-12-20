"use client";
import React, { useState } from "react";
import {
  Elements,
  useElements,
  useStripe,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { httpsCallable } from "firebase/functions";
import { getFunctions } from "firebase/functions";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
).catch((e) => {
  console.error("something went wrong with stripePromise", e);
  return null;
});

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setMessage("Stripe.js hasn't loaded yet.");
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });

    if (error) {
      setMessage(error.message || "An unexpected error occurred.");
    } else {
      setMessage("Payment successful!");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        id="payment-element"
        className="p-4 border rounded shadow-sm"
      />
      <Button
        id="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full"
      >
        <span id="button-text">
          {isLoading ? <Spinner id="spinner" /> : "Pay now"}
        </span>
      </Button>
      {message && <Alert variant="danger">{message}</Alert>}
    </form>
  );
}

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(0);
  const [showPaymentElement, setShowPaymentElement] = useState(false);

  const handlePlusOne = () => {
    setAmount(amount + 100);
  };

  const handleMinusOne = () => {
    if (amount > 0) {
      setAmount(amount - 100);
    }
  };

  const handleNext = async () => {
    try {
      const data = await createPaymentIntent({ amount });
      console.log("createPaymentIntent data", data);
      if (data && data.clientSecret) {
        setClientSecret(data.clientSecret);
        setShowPaymentElement(true);
      } else {
        console.error("Invalid clientSecret received:", data);
      }
    } catch (e) {
      console.error("Error in createPaymentIntent", e);
    }
  };

  const handleBack = async () => {
    if (clientSecret) {
      try {
        console.log("Payment Intent cancelled");
      } catch (error) {
        console.error("Error cancelling Payment Intent:", error);
      }
    }
    setClientSecret("");
    setShowPaymentElement(false);
  };

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Card className="space-y-4 h-full">
      <CardHeader>
        <h1>Checkout</h1>
      </CardHeader>
      <CardContent>
        {clientSecret && showPaymentElement && (
          <Elements key={clientSecret} options={options} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        )}
        <div className="flex-col items-center space-y-4">
          <div className="flex items-center space-x-4 w-full justify-center">
            <Button
              onClick={handleMinusOne}
              disabled={showPaymentElement}
              variant="danger"
            >
              -
            </Button>
            <span className="text-lg font-semibold">${amount / 100}</span>
            <Button
              onClick={handlePlusOne}
              disabled={showPaymentElement}
              variant="success"
            >
              +
            </Button>
          </div>
          <Button
            onClick={showPaymentElement ? handleBack : handleNext}
            disabled={amount === 0}
            className="w-full"
          >
            {showPaymentElement ? "< Back" : "Next >"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export const createPaymentIntent = async ({ amount }: { amount: number }) => {
  const fname = "createPaymentIntent";
  console.log(`calling ${fname}`);
  const f = httpsCallable(getFunctions(), fname, {
    limitedUseAppCheckTokens: true,
  });
  const response = await f({
    amount: amount,
  });
  console.log("response", response);
  return response && (response.data as any);
};
