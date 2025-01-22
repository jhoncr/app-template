"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Quote, Material } from "@/lib/custom_types";
import { useEffect, useState } from "react";
import { httpsCallable, getFunctions } from "firebase/functions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const quoteSchema = z.object({
  clientId: z
    .string()
    .min(3, { message: "Client ID must be at least 3 characters" }),
  laborCostType: z.enum(["percentage", "fixed"]),
  laborCostValue: z
    .number()
    .min(0.01, { message: "Labor value must be greater than 0" }),
  shippingCost: z
    .number()
    .min(0.01, { message: "Shipping cost must be greater than 0" }),
  status: z.enum(["pending", "sent", "accepted"]).default("pending"), // Added default value
  items: z
    .array(
      z.object({
        materialId: z.string(),
        quantity: z.number().min(0.01),
      })
    )
    .optional(),
  quoteId: z.string().optional(), // ADDED: quoteId field
});

type QuoteFormProps = {
  onSave?: (quoteId: string) => void; // Modified onSave prop to accept quoteId
  defaultValues?: Partial<Quote>;
  quoteId?: string; // ADDED: quoteId prop
};

export const QuoteForm = ({
  onSave,
  defaultValues,
  quoteId,
}: QuoteFormProps) => {
  const form = useForm<z.infer<typeof quoteSchema>>({
    resolver: zodResolver(quoteSchema),
    defaultValues: defaultValues || {
      clientId: "",
      laborCostType: "fixed",
      laborCostValue: 0,
      shippingCost: 0,
      status: "pending", // Default value is now set here as well
      items: [],
    },
  });

  const [materials, setMaterials] = useState<Material[]>([]);
  const { toast } = useToast(); // Initialize useToast
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    console.log("quote-form default values", defaultValues);
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    const getMaterialsFn = httpsCallable(getFunctions(), "getMaterials", {
      limitedUseAppCheckTokens: true,
    });
    try {
      const response = await getMaterialsFn();
      if (response.data && response.data.result === "ok") {
        setMaterials(response.data.materials);
      }
    } catch (error) {
      console.error("Error fetching materials", error);
    }
  };

  const onSubmitFn = async (values: z.infer<typeof quoteSchema>) => {
    console.log("onSubmit", values);
    const isUpdate = !!quoteId; // Determine if it's an update based on quoteId
    const actionFn = isUpdate
      ? httpsCallable(getFunctions(), "updateQuote", {
          limitedUseAppCheckTokens: true,
        })
      : httpsCallable(getFunctions(), "createQuote", {
          limitedUseAppCheckTokens: true,
        });

    try {
      const payload = isUpdate ? { ...values, id: quoteId } : values; // Include quoteId for updates
      const response = await actionFn(payload);
      if (response.data && response.data.result === "ok") {
        toast({
          title: `Quote ${isUpdate ? "Updated" : "Created"}`, // Dynamic toast title
          description: `Quote was ${
            isUpdate ? "updated" : "created"
          } successfully.`,
        });
        if (onSave) {
          onSave(response.data.quoteId || quoteId); // Pass quoteId to onSave callback
        } else {
          router.push(`/u/quotes/${response.data.quoteId || quoteId}/edit`);
        }
        form.reset();
      } else {
        toast({
          title: "Error creating Quote",
          description: response.data.message,
          variant: "destructive",
        });
        console.error(
          `Error ${isUpdate ? "updating" : "creating"} quote`,
          response
        );
      }
    } catch (error) {
      toast({
        title: "Error creating Quote",
        description: "An error occurred",
        variant: "destructive",
      });
      console.error(
        `Error ${isUpdate ? "updating" : "creating"} quote`,
        error
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitFn)} className="space-y-4">
        {/* ... other FormFields */}
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Id</FormLabel>
              <FormControl>
                <Input placeholder="Client Id" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="laborCostType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Labor Cost Type</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a labor type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="laborCostValue"
          defaultValue={defaultValues?.laborCostValue}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Labor Cost Value</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    const parsedValue = parseFloat(value) || 0;
                    field.onChange(parsedValue);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shippingCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shipping Cost</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    const parsedValue = parseFloat(value) || 0;
                    field.onChange(parsedValue);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quote Status</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="items"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Items</FormLabel>
              <FormControl>
                <ul>
                  {materials &&
                    materials.map((material, idx) => (
                      <li key={material.id}>
                        <label htmlFor={`material-${idx}`}>
                          {material.name}
                        </label>
                        <input
                          type="number"
                          id={`material-${idx}`}
                          onChange={(e) => {
                            console.log("selected", e.target.value);
                            const val = Number(e.target.value);
                            const selectedItemIndex =
                              field.value?.findIndex(
                                (item) => item.materialId === material.id
                              ) || -1;

                            if (selectedItemIndex > -1) {
                              field.onChange(
                                field.value.map((item, index) => {
                                  if (index === selectedItemIndex) {
                                    return {
                                      materialId: material.id,
                                      quantity: val,
                                    };
                                  } else {
                                    return item;
                                  }
                                })
                              );
                            } else {
                              if (val > 0) {
                                field.onChange([
                                  ...(field.value || []),
                                  {
                                    materialId: material.id,
                                    quantity: val,
                                  },
                                ]);
                              }
                            }
                          }}
                          defaultValue={
                            field.value?.find(
                              (item) => item.materialId === material.id
                            )?.quantity
                          }
                        />
                      </li>
                    ))}
                </ul>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {quoteId ? "Update Quote" : "Create Quote"}{" "}
          {/* Dynamic button text */}
        </Button>
      </form>
    </Form>
  );
};
