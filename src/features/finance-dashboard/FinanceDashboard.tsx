"use client";

import { DashboardData } from "@/services/transaction.service";
import { useTransactions } from "@/hooks/useTransactions";
import { KpiCards } from "./components/KpiCards";
import { ExpenseChart } from "./components/ExpenseChart";
import { TransactionForm } from "./components/TransactionForm";
import { TransactionTable } from "./components/TransactionTable";

interface FinanceDashboardProps {
  initialData: DashboardData;
}

export function FinanceDashboard({ initialData }: FinanceDashboardProps) {
  const { data, isLoading, error, addTransaction, deleteTransaction } =
    useTransactions(initialData);

  return (
    <main className="container mx-auto max-w-6xl py-8 px-4 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Personal Finance Tracker
          </h1>
          <p className="text-sm text-muted-foreground">
            Pantau pemasukan, pengeluaran, dan alokasi bujet harian Anda.
          </p>
        </div>
        <TransactionForm onSubmitTransaction={addTransaction} />
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <KpiCards summary={data.summary} />

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-3">
          <ExpenseChart chartData={data.chartData} />
        </div>
        <div className="lg:col-span-4">
          <TransactionTable
            transactions={data.transactions}
            isLoading={isLoading}
            onDeleteTransaction={deleteTransaction}
          />
        </div>
      </div>
    </main>
  );
}
