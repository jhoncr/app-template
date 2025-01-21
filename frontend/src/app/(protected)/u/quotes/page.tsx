"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Quote } from "@/lib/custom_types";
import { Plus, Trash } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { QuoteForm } from "@/components/ui/quote-form";
import { useToolbar } from "@/app/(protected)/u/nav_tools";
import { httpsCallable, getFunctions } from "firebase/functions";

const QuotesPage = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const { setTools } = useToolbar();
  const [editQuote, setEditQuote] = useState<Quote | null>(null);

  useEffect(() => {
    setTools(
      <div className="flex justify-end items-center space-x-2">
        <Dialog
          // open={!!editQuote}
          onOpenChange={(open) => {
            console.log("onOpenChange", open);
            if (!open) setEditQuote(null);
          }}
        >
          <DialogTrigger asChild>
            <Button variant={"outline"} size={"sm"}>
              <Plus className="w-4 h-4 mr-2" /> Add Quote
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editQuote ? "Edit Quote" : "Add Quote"}
              </DialogTitle>
              <DialogDescription>
                {" "}
                {editQuote
                  ? "Edit an existing quote"
                  : "Create a new quote for a client"}{" "}
              </DialogDescription>
            </DialogHeader>
            <QuoteForm
              defaultValues={editQuote || undefined}
              onSave={editQuote ? handleUpdateQuote : handleCreateQuote}
            />
          </DialogContent>
        </Dialog>
      </div>
    );

    fetchQuotes();
  }, [setTools, editQuote]);

  const fetchQuotes = async () => {
    const getQuotesFn = httpsCallable(getFunctions(), "getQuotes", {
      limitedUseAppCheckTokens: true,
    });
    try {
      const response = await getQuotesFn();
      if (response.data && response.data.result === "ok") {
        setQuotes(response.data.quotes);
      }
    } catch (error) {
      console.error("Error fetching quotes", error);
    }
  };

  const handleCreateQuote = async (newQuote: Omit<Quote, "id">) => {
    console.log("handleCreateQuote", newQuote);
    const createQuoteFn = httpsCallable(getFunctions(), "createQuote", {
      limitedUseAppCheckTokens: true,
    });

    try {
      const response = await createQuoteFn(newQuote);
      if (response.data && response.data.result === "ok") {
        fetchQuotes();
      } else {
        console.log("Error creating quote", response);
      }
    } catch (error) {
      console.error("Error creating quote", error);
    }
  };
  const handleUpdateQuote = async (quote: Quote) => {
    console.log("handleUpdateQuote", quote);
    const updateQuoteFn = httpsCallable(getFunctions(), "updateQuote", {
      limitedUseAppCheckTokens: true,
    });

    try {
      const response = await updateQuoteFn(quote);
      if (response.data && response.data.result === "ok") {
        setEditQuote(null);
        fetchQuotes();
      } else {
        console.error("Error updating quote", response);
      }
    } catch (error) {
      console.error("Error updating quote", error);
    }
  };
  const handleDeleteQuote = async (quoteId: string) => {
    const deleteQuoteFn = httpsCallable(getFunctions(), "deleteQuote", {
      limitedUseAppCheckTokens: true,
    });
    try {
      const response = await deleteQuoteFn({ id: quoteId });
      if (response.data && response.data.result === "ok") {
        fetchQuotes();
      } else {
        console.error("Error deleting quote", response);
      }
    } catch (error) {
      console.error("Error deleting quote", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Quotes</h1>

      <Table>
        <TableCaption>A list of your Quotes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Client Id</TableHead>
            <TableHead>Labor Type</TableHead>
            <TableHead>Labor Value</TableHead>
            <TableHead>Shipping</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotes.map((quote) => (
            <TableRow key={quote.id}>
              <TableCell>{quote.clientId}</TableCell>
              <TableCell>{quote.laborCostType}</TableCell>
              <TableCell>{quote.laborCostValue}</TableCell>
              <TableCell>{quote.shippingCost}</TableCell>
              <TableCell>{quote.status}</TableCell>
              <TableCell className="flex justify-center space-x-2">
                <Button
                  size={"icon"}
                  variant="outline"
                  onClick={() => setEditQuote(quote)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  size={"icon"}
                  variant="destructive"
                  onClick={() => handleDeleteQuote(quote.id || "")}
                >
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default QuotesPage;
