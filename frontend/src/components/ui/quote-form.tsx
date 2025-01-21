"use client";
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
  status: z.enum(["pending", "sent", "accepted"]),
  items: z
    .array(
      z.object({
        materialId: z.string(),
        quantity: z.number().min(0.01),
      })
    )
    .optional(),
});

type QuoteFormProps = {
  onSave?: (material: Quote) => void;
  defaultValues?: Partial<Quote>;
};

export const QuoteForm = ({ onSave, defaultValues }: QuoteFormProps) => {
  const form = useForm<z.infer<typeof quoteSchema>>({
    resolver: zodResolver(quoteSchema),
    defaultValues: defaultValues || {
      clientId: "",
      laborCostType: "fixed",
      laborCostValue: 0,
      shippingCost: 0,
      status: "pending",
      items: [],
    },
  });

  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
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

  const onSubmit = (values: z.infer<typeof quoteSchema>) => {
    console.log("onSubmit", values);
    if (onSave) {
      onSave(values);
    }
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Labor Cost Value</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0.00" {...field} />
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
                <Input type="number" placeholder="0.00" {...field} />
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
          Add Quote
        </Button>
      </form>
    </Form>
  );
};
