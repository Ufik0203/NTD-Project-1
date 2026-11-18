import { CreateTransactionSchema } from "@/model/transaction.model";
import { TransactionService } from "@/services/transaction.service";

export const TransactionController = {
  getDashboardData: async () => {
    return await TransactionService.getDashboardOverview();
  },

  createTransaction: async (payload: unknown) => {
    const validated = CreateTransactionSchema.safeParse(payload);
    if (!validated.success) {
      throw new Error(validated.error.issues[0].message);
    }
    return await TransactionService.create(validated.data);
  },

  deleteTransaction: async (id: string | null) => {
    if (!id || id.trim() === "") {
      throw new Error("Field ID transaction");
    }
    await TransactionService.delete(id);
  },
};
