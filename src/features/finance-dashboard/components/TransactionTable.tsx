"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction } from "@/model/transaction.model";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  onDeleteTransaction: (id: string) => Promise<{ success: boolean }>;
}

const formatIDR = (mount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(mount);

export function TransactionTable({
  transactions,
  isLoading,
  onDeleteTransaction,
}: TransactionTableProps) {
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const filtered =
    filterCategory === "ALL"
      ? transactions
      : transactions.filter((t) => t.category === filterCategory);
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await onDeleteTransaction(id);
    setDeletingId(null);
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">
          Riwayat Transaksi{" "}
          {isLoading && (
            <span className="text-xs font-normal text-muted-foreground">
              (Memuat...)
            </span>
          )}
        </CardTitle>
        <Select
          value={filterCategory}
          onValueChange={(val) => {
            if (val) setFilterCategory(val);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            <SelectItem value="Food">Food</SelectItem>
            <SelectItem value="Transportation">Transportation</SelectItem>
            <SelectItem value="Salary">Salary</SelectItem>
            <SelectItem value="Holiday">Holiday</SelectItem>
            <SelectItem value="etc">etc</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="text-right">Nominal</TableHead>
              <TableHead className="w-12.5"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  Tidak ada transaksi ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="text-xs text-muted-foreground">
                    {tx.date}
                  </TableCell>
                  <TableCell className="font-medium">{tx.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{tx.category}</Badge>
                  </TableCell>
                  <TableCell
                    className={`text-right font-semibold ${
                      tx.type === "INCOME"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {tx.type === "INCOME" ? "+" : "-"}
                    {formatIDR(tx.amount)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={deletingId === tx.id}
                      onClick={() => handleDelete(tx.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
