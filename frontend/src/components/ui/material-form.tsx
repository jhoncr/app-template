"use client";
import React, { useState } from "react";
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
import { Material } from "@/lib/custom_types";
import { httpsCallable, getFunctions } from "firebase/functions";
import { useToast } from "@/hooks/use-toast";

const materialSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().optional(),
  pricePerSqMeter: z
    .number()
    .min(0.0, { message: "Price must be greater than 0" }),
  type: z.enum(["granite", "flooring"]),
});

type MaterialFormProps = {
  onSave?: (material: Material) => void;
  defaultValues?: Partial<Material>;
};

export const MaterialForm = ({ onSave, defaultValues }: MaterialFormProps) => {
  const [value, setValue] = useState(0.0);

  const form = useForm<z.infer<typeof materialSchema>>({
    resolver: zodResolver(materialSchema),
    defaultValues: defaultValues || {
      name: "",
      description: "",
      pricePerSqMeter: 0,
      type: "granite",
    },
  });
  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof materialSchema>) => {
    console.log("onSubmit", values);
    const createMaterialFn = httpsCallable(getFunctions(), "createMaterial", {
      limitedUseAppCheckTokens: true,
    });

    try {
      const response = await createMaterialFn(values);
      if (response.data && response.data.result === "ok") {
        toast({
          title: "Material Created",
          description: "Material was created successfully.",
        });
        if (onSave) {
          onSave({ ...values, id: response.data.materialId });
        }
        form.reset();
      } else {
        toast({
          title: "Error creating Material",
          description: response.data.message,
          variant: "destructive",
        });
        console.error("Error creating material", response);
      }
    } catch (error) {
      toast({
        title: "Error creating Material",
        description: "An error occurred",
        variant: "destructive",
      });
      console.error("Error creating material", error);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Material Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Material Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pricePerSqMeter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price Per Square Meter</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  className="text-right w-full"
                  value={value}
                  onBlur={(e) => {
                    const v = Number(e.target.value).toFixed(2);
                    field.onChange(Number(v) || 0.0);
                    setValue(v);
                  }}
                  onChange={(e) => setValue(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="granite">Granite</SelectItem>
                    <SelectItem value="flooring">Flooring</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Add Material
        </Button>
      </form>
    </Form>
  );
};
