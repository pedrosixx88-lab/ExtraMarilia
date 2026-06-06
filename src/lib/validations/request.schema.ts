import { z } from "zod";

export const requestSchema = z.object({
  nome: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo")
    .trim(),

  whatsapp: z
    .string()
    .min(1, "WhatsApp é obrigatório")
    .refine((val) => {
      const digits = val.replace(/\D/g, "");
      return digits.length === 10 || digits.length === 11;
    }, "WhatsApp inválido — use o formato (14) 99999-9999"),

  email: z
    .string()
    .email("E-mail inválido")
    .optional()
    .or(z.literal("")),

  descricao: z
    .string()
    .min(20, "Descreva melhor o que você precisa (mínimo 20 caracteres)")
    .max(1000, "Descrição muito longa (máximo 1000 caracteres)")
    .trim(),

  category_id: z
    .string()
    .uuid("Selecione uma categoria válida"),

  bairro_id: z
    .string()
    .uuid("Selecione um bairro válido"),

  urgente: z.boolean(),
});

export type RequestFormData = z.infer<typeof requestSchema>;

export const requestApiSchema = requestSchema.extend({
  whatsapp: z.string().refine((val) => {
    const digits = val.replace(/\D/g, "");
    return digits.length === 10 || digits.length === 11;
  }, "WhatsApp inválido"),
});
