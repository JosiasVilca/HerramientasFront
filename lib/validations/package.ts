import { z } from "zod";

export const createPackageSchema = z.object({
  senderName: z
    .string()
    .min(1, { message: "El nombre del remitente es requerido" })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  senderPhone: z
    .string()
    .min(1, { message: "El teléfono del remitente es requerido" })
    .regex(/^\+?[0-9]{7,15}$/, { message: "Teléfono inválido (de 7 a 15 dígitos)" }),
  receiverName: z
    .string()
    .min(1, { message: "El nombre del destinatario es requerido" })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  receiverPhone: z
    .string()
    .min(1, { message: "El teléfono del destinatario es requerido" })
    .regex(/^\+?[0-9]{7,15}$/, { message: "Teléfono inválido (de 7 a 15 dígitos)" }),
  destinationAddress: z
    .string()
    .min(1, { message: "La dirección de destino es requerida" }),
  destinationCity: z
    .string()
    .min(1, { message: "La ciudad de destino es requerida" }),
  weightKg: z
    .string()
    .min(1, { message: "El peso es requerido" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "El peso debe ser un número mayor a 0 kg",
    }),
  description: z.string().optional(),
});

export type CreatePackageInput = z.infer<typeof createPackageSchema>;
