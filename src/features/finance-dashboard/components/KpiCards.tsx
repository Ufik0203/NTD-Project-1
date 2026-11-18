import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import { DashboardSummary } from "@/services/transaction.service";

const formatIDR = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

export function KpiCards({ summary }: { summary: DashboardSummary }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Saldo
          </CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatIDR(summary.balance)}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Selisih pemasukan & pengeluaran
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Pemasukan
          </CardTitle>
          <ArrowUpRight className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">
            +{formatIDR(summary.totalIncome)}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Akumulasi dana masuk
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Pengeluaran
          </CardTitle>
          <ArrowDownRight className="h-4 w-4 text-rose-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rose-600">
            -{formatIDR(summary.totalExpense)}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Akumulasi dana keluar
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
