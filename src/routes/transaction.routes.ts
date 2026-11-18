import { TransactionController } from "@/controller/transaction.controller";
import { NextResponse } from "next/server";

export const TransactionRoutes = {
  handleGet: async () => {
    try {
      const data = await TransactionController.getDashboardData();
      return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error server";
      return NextResponse.json(
        { success: false, error: message },
        { status: 500 },
      );
    }
  },

  handlePost: async (req: Request) => {
    try {
      const body = await req.json();
      const created = await TransactionController.createTransaction(body);
      return NextResponse.json(
        { success: true, data: created },
        { status: 200 },
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid input";
      return NextResponse.json(
        { success: false, error: message },
        { status: 400 },
      );
    }
  },

  handleDelete: async (req: Request) => {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");
      await TransactionController.deleteTransaction(id);
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete transaction";
      return NextResponse.json(
        { success: false, error: message },
        { status: 400 },
      );
    }
  },
};
