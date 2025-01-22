// frontend/src/app/(protected)/u/quotes/[quoteId]/edit/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { QuoteForm } from "@/components/ui/quote-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParams } from "next/navigation";
import { Quote } from "@/lib/custom_types";
import { Spinner } from "@/components/ui/spinner";
import { httpsCallable, getFunctions } from "firebase/functions"; // Import getFunctions and httpsCallable
import { useToast } from "@/hooks/use-toast"; // Import useToast

const EditQuotePage = () => {
  const params = useParams();
  const quoteId = params.quoteId as string;
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast(); // Initialize useToast

  useEffect(() => {
    if (quoteId) {
      setLoading(true); // Set loading to true when starting fetch
      const getQuoteFn = httpsCallable(getFunctions(), "getQuote", {
        // Get callable function
        limitedUseAppCheckTokens: true,
      });

      getQuoteFn({ id: quoteId }) // Call the function with quoteId
        .then((result) => {
          if (result.data && (result.data as any).result === "ok") {
            setQuote((result.data as any).quote as Quote); // Set quote data from response
          } else {
            toast({
              title: "Error fetching quote",
              description:
                (result.data as any)?.message || "Could not load quote.",
              variant: "destructive",
            });
            console.error("Error fetching quote:", result);
          }
        })
        .catch((error) => {
          toast({
            title: "Error fetching quote",
            description: error.message || "An unexpected error occurred.",
            variant: "destructive",
          });
          console.error("Error fetching quote:", error);
        })
        .finally(() => {
          setLoading(false); // Set loading to false after fetch completes (success or error)
        });
    } else {
      setLoading(false); // If no quoteId in params, set loading to false
    }
  }, [quoteId, toast]); // Added toast to dependency array

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner /> <span className="ml-2">Loading Quote...</span>
      </div>
    );
  }

  if (!quote) {
    return <div>Error: Could not load quote.</div>;
  }
  const handleQuoteUpdated = () => {
    // ADDED: handleQuoteUpdated function
    toast({
      title: "Quote Updated",
      description: "Quote details saved successfully.",
    });
    // Optionally, you could redirect back to the quote list or a quote view page here
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Quote: {quote.quoteNumber || quoteId}</CardTitle>
      </CardHeader>
      <CardContent>
        <QuoteForm
          defaultValues={quote}
          quoteId={quoteId} // PASSED quoteId prop here
          onSave={handleQuoteUpdated} // PASSED onSave handler here
        />
      </CardContent>
    </Card>
  );
};

export default EditQuotePage;
