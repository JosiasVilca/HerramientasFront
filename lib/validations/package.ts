import { z } from "zod";

const PHONE_REGEX = /^\+?[0-9][0-9\s-]{5,19}$/;

export const createPackageSchema = z.object({
  receiverName: z
    .string()
    .trim()
    .min(1, { message: "El nombre del destinatario es requerido" })
    .max(150, { message: "El nombre no puede superar 150 caracteres" }),
  receiverPhone: z
    .string()
    .trim()
    .min(1, { message: "El teléfono del destinatario es requerido" })
    .max(20, { message: "El teléfono no puede superar 20 caracteres" })
    .regex(PHONE_REGEX, { message: "Teléfono inválido (de 7 a 15 dígitos)" }),
  destinationAddress: z
    .string()
    .trim()
    .min(1, { message: "La dirección de destino es requerida" })
    .max(1000, { message: "La dirección no puede superar 1000 caracteres" }),
  destinationCity: z
    .string()
    .trim()
    .min(1, { message: "La ciudad de destino es requerida" })
    .max(100, { message: "La ciudad no puede superar 100 caracteres" }),
  weightKg: z
    .string()
    .trim()
    .min(1, { message: "El peso es requerido" })
    .refine((val) => {
      const weight = Number(val);
      return (
        Number.isFinite(weight) &&
        weight >= 0.01 &&
        weight <= 9999.99 &&
        /^\d{1,4}(?:\.\d{1,2})?$/.test(val)
      );
    }, {
      message: "El peso debe estar entre 0.01 y 9999.99 kg, con máximo 2 decimales",
    }),
});

export type CreatePackageInput = z.infer<typeof createPackageSchema>;
