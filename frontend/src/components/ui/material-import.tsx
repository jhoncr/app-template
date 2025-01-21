"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Plus } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MaterialForm } from "@/components/ui/material-form";
import { httpsCallable, getFunctions } from "firebase/functions";
import { Material } from "@/lib/custom_types";

type MaterialImportProps = {
  fetchMaterials: () => void;
  setEditMaterial: (material: Material | null) => void;
};

export const MaterialImport: React.FC<MaterialImportProps> = ({
  fetchMaterials,
  setEditMaterial,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const importMaterialsFn = httpsCallable(
      getFunctions(),
      "importMaterials",
      {
        limitedUseAppCheckTokens: true,
      }
    );
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const response = await importMaterialsFn(formData);
      if (response.data && response.data.result === "ok") {
        toast({
          title: "Materials Imported",
          description: "Materials were imported successfully.",
        });
        fetchMaterials();
      } else {
        toast({
          title: "Error Importing Materials",
          description: response.data.message,
          variant: "destructive",
        });
        console.error("Error importing materials", response);
      }
    } catch (error) {
      toast({
        title: "Error Importing Materials",
        description: "An error occurred while uploading",
        variant: "destructive",
      });
      console.error("Error importing materials", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-end items-center space-x-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"outline"} size={"sm"}>
            <Plus className="w-4 h-4 mr-2" /> Add Material
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Material</DialogTitle>
            <DialogDescription>Create a new material.</DialogDescription>
          </DialogHeader>
          <MaterialForm
            onSave={(material) => {
              console.log("onSave", material);
              fetchMaterials();
            }}
          />
        </DialogContent>
      </Dialog>
      <div>
        <Button variant={"outline"} size={"sm"}>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="csv-upload"
          />
          <label htmlFor="csv-upload" className="flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </label>
        </Button>
        {selectedFile && (
          <Button onClick={handleImport} size="sm" disabled={loading}>
            {loading ? "Loading..." : "Upload"}
          </Button>
        )}
      </div>
    </div>
  );
};
