import { z } from "zod";

export const TransactionSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(2, "minimum is 2 character")
    .max(244, "maximum 244 character"),
  amount: z.number().int().positive("Amount must be greater than 0"),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.enum(["Food", "Transportation", "Salary", "Holiday", "etc"]),
  date: z.string(),
});

export const CreateTransactionSchema = TransactionSchema.omit({ id: true });

export type Transaction = z.infer<typeof TransactionSchema>;
export type CreateTransactionDTO = Omit<Transaction, "id">;
