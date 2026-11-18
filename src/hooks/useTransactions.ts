import { CreateTransactionDTO } from "@/model/transaction.model";
import { DashboardData } from "@/services/transaction.service";
import { useCallback, useState } from "react";

export function useTransactions(initialData: DashboardData) {
  const [data, setData] = useState<DashboardData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/transactions", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to load data");
      }
      setData(json.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTransaction = useCallback(
    async (payload: CreateTransactionDTO) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || "Failed to add transaction");
        }
        await refetch();
        return { success: true };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to save";
        setError(message);
        return { success: false, error: message };
      } finally {
        setIsLoading(false);
      }
    },
    [refetch],
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/transactions?id=${id}`, {
          method: "DELETE",
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || "Failed to delete transaction");
        }
        await refetch();
        return { success: true };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to delete";
        setError(message);
        return { success: false, error: message };
      } finally {
        setIsLoading(false);
      }
    },
    [refetch],
  );

  return { data, isLoading, error, refetch, addTransaction, deleteTransaction };
}
