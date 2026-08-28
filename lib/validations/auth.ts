import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "El correo electrónico es requerido" })
    .email({ message: "Formato de correo electrónico inválido" }),
  password: z
    .string()
    .min(1, { message: "La contraseña es requerida" })
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, { message: "El nombre completo es requerido" })
      .min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
    email: z
      .string()
      .min(1, { message: "El correo electrónico es requerido" })
      .email({ message: "Formato de correo electrónico inválido" }),
    phone: z
      .string()
      .min(1, { message: "El número de teléfono es requerido" })
      .regex(/^\+?[0-9]{7,15}$/, {
        message: "El teléfono debe contener entre 7 y 15 dígitos numéricos",
      }),
    role: z.enum(["CLIENTE", "REPARTIDOR", "ADMIN"]),
    password: z
      .string()
      .min(1, { message: "La contraseña es requerida" })
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirmar la contraseña es requerido" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "El correo electrónico es requerido" })
    .email({ message: "Formato de correo electrónico inválido" }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
