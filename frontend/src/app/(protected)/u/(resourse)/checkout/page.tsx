"use client";
import React, { useState, useEffect } from "react";
import {
  Elements,
  useElements,
  useStripe,
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
// import { createCheckoutSession } from "@/lib/cart";
import { loadStripe } from "@stripe/stripe-js";
import { httpsCallable } from "firebase/functions";
import { getFunctions } from "firebase/functions";
import { useAuth } from "@/lib/auth_handler";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
).catch((e) => {
  console.error("something went wrong with stripePromise", e);
  return null;
});

export default function CheckoutPage() {
  const [options, setOptions] = useState<{
    clientSecret: string | null;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { authUser, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !authUser) {
      console.log("User not logged in yet");
      return;
    }
    console.log("User logged in", authUser);
    createCheckoutSession()
      .then((checkoutSession) => {
        setOptions({
          clientSecret: checkoutSession.clientSecret,
        });
      })
      .catch((e) => {
        console.error("something went wrong with checkoutSession", e);
        setError("something went wrong with checkoutSession");
      });
  }, [loading]);

  return (
    <div id="checkout-page">
      {(options && (
        <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )) || (
        <div>
          <h1>Checkout</h1>
          {error && <p>{error}</p>}
        </div>
      )}
    </div>
  );
}

export const createCheckoutSession = async () => {
  const fname = "createCheckoutSessionFn";
  console.log(`calling ${fname}`);
  const f = getFunctions();
  console.log("f", f);
  const createCheckoutSession = httpsCallable(
    getFunctions(),
    // functions,
    fname,
    {
      limitedUseAppCheckTokens: true,
    }
  );
  const response = await createCheckoutSession({
    productId: "prod_QsM6wnVT1E2mMX",
    priceId: "price_1Q0bNtP7mQHPx44F4nW2i1K8",
  });
  console.log("response", response);
  // response should have a url and a clientSecret
  return response && (response.data as any);
};
