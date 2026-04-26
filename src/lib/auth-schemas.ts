import { z } from "zod";

export const signUpSchema = z.object({
  firstName: z.string().trim().min(2, "Prénom trop court").max(60),
  lastName: z.string().trim().min(2, "Nom trop court").max(60),
  phone: z
    .string()
    .trim()
    .min(7, "Téléphone invalide")
    .max(20)
    .regex(/^[+0-9 ()-]+$/, "Format téléphone invalide"),
  cin: z
    .string()
    .trim()
    .min(4, "CIN trop court")
    .max(30)
    .regex(/^[A-Za-z0-9-]+$/, "CIN invalide (lettres, chiffres, tirets)"),
  email: z.string().trim().email("Email invalide").max(255),
  profession: z.string().trim().min(2, "Profession requise").max(100),
  password: z
    .string()
    .min(8, "Au moins 8 caractères")
    .max(72)
    .regex(/[A-Z]/, "Au moins une majuscule")
    .regex(/[a-z]/, "Au moins une minuscule")
    .regex(/[0-9]/, "Au moins un chiffre"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.string().trim().email("Email invalide").max(255),
  password: z.string().min(1, "Mot de passe requis").max(72),
});
