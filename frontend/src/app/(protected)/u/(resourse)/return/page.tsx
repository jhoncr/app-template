"use client";
import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const SuccessPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const session_id = searchParams.get("session_id");

  useEffect(() => {
    if (session_id) {
      // Handle the session_id, e.g., fetch session details from the server
      console.log(`Session ID: ${session_id}`);
    }
  }, [session_id]);

  const handleGoBack = () => {
    router.push("/u"); // Redirect to home or any other page
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Payment Successful!</h1>
      <p>Thank you for your purchase. Your payment was successful.</p>
      {session_id && <p>Session ID: {session_id}</p>}
      <button
        onClick={handleGoBack}
        style={{ padding: "10px 20px", marginTop: "20px" }}
      >
        Go to Home
      </button>
    </div>
  );
};

export default SuccessPage;
