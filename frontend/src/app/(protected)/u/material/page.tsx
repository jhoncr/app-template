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
import { Material } from "@/lib/custom_types";
import { Edit, Trash, Plus, Upload } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MaterialForm } from "@/components/ui/material-form";
import { useToolbar } from "@/app/(protected)/u/nav_tools";
import { httpsCallable, getFunctions } from "firebase/functions";
import { MaterialImport } from "@/components/ui/material-import";

const MaterialsPage = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const { setTools } = useToolbar();
  const [editMaterial, setEditMaterial] = useState<Material | null>(null);

  useEffect(() => {
    setTools(
      <MaterialImport
        fetchMaterials={fetchMaterials}
        setEditMaterial={setEditMaterial}
      />
    );

    fetchMaterials();
  }, [setTools, editMaterial]);

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

  const handleCreateMaterial = async (newMaterial: Omit<Material, "id">) => {
    console.log("handleCreateMaterial", newMaterial);
    const createMaterialFn = httpsCallable(getFunctions(), "createMaterial", {
      limitedUseAppCheckTokens: true,
    });

    try {
      const response = await createMaterialFn(newMaterial);
      if (response.data && response.data.result === "ok") {
        fetchMaterials();
      } else {
        console.log("Error creating material", response);
      }
    } catch (error) {
      console.error("Error creating material", error);
    }
  };

  const handleUpdateMaterial = async (material: Material) => {
    console.log("handleUpdateMaterial", material);
    const updateMaterialFn = httpsCallable(getFunctions(), "updateMaterial", {
      limitedUseAppCheckTokens: true,
    });

    try {
      const response = await updateMaterialFn(material);
      if (response.data && response.data.result === "ok") {
        setEditMaterial(null);
        fetchMaterials();
      } else {
        console.error("Error updating material", response);
      }
    } catch (error) {
      console.error("Error updating material", error);
    }
  };

  const handleDeleteMaterial = async (material: Material) => {
    const updateMaterialFn = httpsCallable(getFunctions(), "updateMaterial", {
      limitedUseAppCheckTokens: true,
    });
    try {
      const response = await updateMaterialFn({
        ...material,
        status: "deactivated",
      });
      if (response.data && response.data.result === "ok") {
        fetchMaterials();
      } else {
        console.error("Error deleting material", response);
      }
    } catch (error) {
      console.error("Error deleting material", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Materials</h1>

      <Table>
        <TableCaption>A list of your materials.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price/sqm</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material) => (
            <TableRow key={material.id}>
              <TableCell>{material.name}</TableCell>
              <TableCell>{material.description}</TableCell>
              <TableCell>{material.pricePerSqMeter}</TableCell>
              <TableCell>{material.type}</TableCell>
              <TableCell className="flex justify-center space-x-2">
                <Button
                  size={"icon"}
                  variant="outline"
                  onClick={() => setEditMaterial(material)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>

                <Button
                  size={"icon"}
                  variant="destructive"
                  onClick={() => handleDeleteMaterial(material)}
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

export default MaterialsPage;
