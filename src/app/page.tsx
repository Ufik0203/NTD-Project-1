import { Suspense } from "react";
import { TransactionService } from "@/services/transaction.service";
import { FinanceDashboard } from "@/features/finance-dashboard/FinanceDashboard";
import { connection } from "next/server";

async function DashboardLoader() {
  await connection();
  const initialData = await TransactionService.getDashboardOverview();
  return <FinanceDashboard initialData={initialData} />;
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-6xl py-8 px-4 text-sm text-muted-foreground">
          Memuat data transaksi...
        </div>
      }
    >
      <DashboardLoader />
    </Suspense>
  );
}
