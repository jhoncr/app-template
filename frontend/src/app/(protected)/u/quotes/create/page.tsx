"use client";

import React from "react";
import { QuoteForm } from "@/components/ui/quote-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

const CreateQuotePage = () => {
  const router = useRouter();

  const handleQuoteCreated = (quoteId: string) => {
    // After successfully creating a quote, redirect to the quote edit page
    router.push(`/u/quotes/${quoteId}/edit`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Quote</CardTitle>
      </CardHeader>
      <CardContent>
        <QuoteForm onSave={handleQuoteCreated} />
      </CardContent>
    </Card>
  );
};

export default CreateQuotePage;
