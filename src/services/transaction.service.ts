import { prisma } from "@/lib/prisma";
import { Transaction, CreateTransactionDTO } from "@/model/transaction.model";

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface CategoryChartItem {
  category: string;
  amount: number;
}

export interface DashboardData {
  transactions: Transaction[];
  summary: DashboardSummary;
  chartData: CategoryChartItem[];
}

export const TransactionService = {
  findAll: async (): Promise<Transaction[]> => {
    const rows = await prisma.transaction.findMany({
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      amount: row.amount,
      type: row.type,
      category: row.category as Transaction["category"],
      date: row.date.toISOString().split("T")[0],
    }));
  },

  findById: async (id: string): Promise<Transaction | null> => {
    const row = await prisma.transaction.findUnique({
      where: { id },
    });
    if (!row) return null;
    return {
      id: row.id,
      title: row.title,
      amount: row.amount,
      type: row.type,
      category: row.category as Transaction["category"],
      date: row.date.toISOString().split("T")[0],
    };
  },

  getDashboardOverview: async (): Promise<DashboardData> => {
    const transactions = await TransactionService.findAll();
    const totalIncome = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0);
    const categoryMap = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce(
        (acc, curr) => {
          acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
          return acc;
        },
        {} as Record<string, number>,
      );
    const chartData: CategoryChartItem[] = Object.entries(categoryMap).map(
      ([category, amount]) => ({
        category,
        amount,
      }),
    );
    return {
      transactions,
      summary: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
      },
      chartData,
    };
  },

  create: async (data: CreateTransactionDTO): Promise<Transaction> => {
    if (data.category === "Salary" && data.type === "EXPENSE") {
      throw new Error("'Salary' category only for income");
    }
    const created = await prisma.transaction.create({
      data: {
        title: data.title,
        amount: data.amount,
        type: data.type,
        category: data.category,
        date: new Date(data.date),
      },
    });
    return {
      id: created.id,
      title: created.title,
      amount: created.amount,
      type: created.type,
      category: created.category as Transaction["category"],
      date: created.date.toISOString().split("T")[0],
    };
  },

  delete: async (id: string): Promise<void> => {
    const existing = await TransactionService.findById;
    if (!existing) {
      throw new Error("Transaction not found");
    }
    await prisma.transaction.delete({
      where: { id },
    });
  },
};
