import { z } from "zod";

export const createPackageSchema = z.object({
  senderName: z
    .string()
    .min(1, { message: "El nombre del remitente es requerido" })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(150, { message: "El nombre no puede superar 150 caracteres" }),
  senderPhone: z
    .string()
    .min(1, { message: "El teléfono del remitente es requerido" })
    .regex(/^\+?[0-9]{7,15}$/, { message: "Teléfono inválido (de 7 a 15 dígitos)" })
    .max(20, { message: "El teléfono no puede superar 20 caracteres" }),
  receiverName: z
    .string()
    .min(1, { message: "El nombre del destinatario es requerido" })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(150, { message: "El nombre no puede superar 150 caracteres" }),
  receiverPhone: z
    .string()
    .min(1, { message: "El teléfono del destinatario es requerido" })
    .regex(/^\+?[0-9]{7,15}$/, { message: "Teléfono inválido (de 7 a 15 dígitos)" })
    .max(20, { message: "El teléfono no puede superar 20 caracteres" }),
  destinationAddress: z
    .string()
    .min(1, { message: "La dirección de destino es requerida" })
    .max(1000, { message: "La dirección no puede superar 1000 caracteres" }),
  destinationCity: z
    .string()
    .min(1, { message: "La ciudad de destino es requerida" })
    .max(100, { message: "La ciudad no puede superar 100 caracteres" }),
  weightKg: z
    .string()
    .min(1, { message: "El peso es requerido" })
    .refine((val) => {
      const weight = Number(val);
      return Number.isFinite(weight) && weight > 0 && /^\d{1,4}(?:\.\d{1,2})?$/.test(val);
    }, {
      message: "El peso debe ser mayor a 0 y tener máximo 4 enteros y 2 decimales",
    }),
  description: z.string().max(2000, { message: "La descripción no puede superar 2000 caracteres" }).optional(),
});

export type CreatePackageInput = z.infer<typeof createPackageSchema>;
