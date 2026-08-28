"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, Save } from "lucide-react";
import { createPackageSchema, CreatePackageInput } from "@/lib/validations/package";
import { packageService } from "@/services/package.service";
import { PackageItem } from "@/types/package";

interface CreatePackageDialogProps {
  onSuccess: (newPkg: PackageItem) => void;
}

export default function CreatePackageDialog({ onSuccess }: CreatePackageDialogProps) {
  const [open, setOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePackageInput>({
    resolver: zodResolver(createPackageSchema),
    defaultValues: {
      senderName: "",
      senderPhone: "",
      receiverName: "",
      receiverPhone: "",
      destinationAddress: "",
      destinationCity: "",
      weightKg: "",
      description: "",
    },
  });

  const onSubmit = async (data: CreatePackageInput) => {
    setErrorMsg(null);
    try {
      const newPkg = await packageService.create({
        senderName: data.senderName,
        senderPhone: data.senderPhone,
        receiverName: data.receiverName,
        receiverPhone: data.receiverPhone,
        destinationAddress: data.destinationAddress,
        destinationCity: data.destinationCity,
        weightKg: Number(data.weightKg),
        description: data.description,
      });
      onSuccess(newPkg);
      reset();
      setOpen(false);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error al registrar el paquete.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) {
        reset();
        setErrorMsg(null);
      }
    }}>
      <DialogTrigger render={<Button className="h-10 px-4 rounded-lg font-semibold active:scale-[0.98] transition-transform cursor-pointer bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm flex items-center gap-2" />}>
        <Plus className="w-4 h-4" />
        <span>Nuevo Paquete</span>
      </DialogTrigger>
      
      <DialogContent className="max-w-xl w-[95vw] rounded-2xl max-h-[90vh] overflow-y-auto border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Registrar Nuevo Envío
          </DialogTitle>
          <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-xs">
            Ingresa los detalles del remitente y destinatario para generar la guía de envío de SwiftLogix.
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-red-600 text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          
          {/* Remitente Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Detalles del Remitente</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="senderName" className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold">
                  Nombre Completo
                </Label>
                <Input
                  id="senderName"
                  placeholder="Ej: Distribuidora Andina"
                  className={errors.senderName ? "border-red-500" : ""}
                  {...register("senderName")}
                />
                {errors.senderName && (
                  <p className="text-red-500 text-[10px] font-semibold">{errors.senderName.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="senderPhone" className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold">
                  Teléfono
                </Label>
                <Input
                  id="senderPhone"
                  placeholder="Ej: +51987654321"
                  className={errors.senderPhone ? "border-red-500" : ""}
                  {...register("senderPhone")}
                />
                {errors.senderPhone && (
                  <p className="text-red-500 text-[10px] font-semibold">{errors.senderPhone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Destinatario Section */}
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Detalles del Destinatario</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="receiverName" className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold">
                  Nombre Completo
                </Label>
                <Input
                  id="receiverName"
                  placeholder="Ej: María Rojas"
                  className={errors.receiverName ? "border-red-500" : ""}
                  {...register("receiverName")}
                />
                {errors.receiverName && (
                  <p className="text-red-500 text-[10px] font-semibold">{errors.receiverName.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="receiverPhone" className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold">
                  Teléfono
                </Label>
                <Input
                  id="receiverPhone"
                  placeholder="Ej: +51977889900"
                  className={errors.receiverPhone ? "border-red-500" : ""}
                  {...register("receiverPhone")}
                />
                {errors.receiverPhone && (
                  <p className="text-red-500 text-[10px] font-semibold">{errors.receiverPhone.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="destinationCity" className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold">
                  Ciudad de Destino
                </Label>
                <Input
                  id="destinationCity"
                  placeholder="Ej: Arequipa"
                  className={errors.destinationCity ? "border-red-500" : ""}
                  {...register("destinationCity")}
                />
                {errors.destinationCity && (
                  <p className="text-red-500 text-[10px] font-semibold">{errors.destinationCity.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="destinationAddress" className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold">
                  Dirección
                </Label>
                <Input
                  id="destinationAddress"
                  placeholder="Ej: Calle Los Claveles 123"
                  className={errors.destinationAddress ? "border-red-500" : ""}
                  {...register("destinationAddress")}
                />
                {errors.destinationAddress && (
                  <p className="text-red-500 text-[10px] font-semibold">{errors.destinationAddress.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Características Section */}
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Características del Envío</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5 sm:col-span-1">
                <Label htmlFor="weightKg" className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold">
                  Peso (Kg)
                </Label>
                <Input
                  id="weightKg"
                  type="number"
                  step="0.1"
                  placeholder="Ej: 3.5"
                  className={errors.weightKg ? "border-red-500" : ""}
                  {...register("weightKg")}
                />
                {errors.weightKg && (
                  <p className="text-red-500 text-[10px] font-semibold">{errors.weightKg.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="description" className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold">
                  Descripción del Contenido
                </Label>
                <Input
                  id="description"
                  placeholder="Ej: Ropa, repuestos, etc."
                  {...register("description")}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer bg-primary hover:bg-primary/95 text-primary-foreground shadow-md flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Generar Guía</span>
                </>
              )}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}
