import { useState, useMemo } from "react";
import { ArrowLeft, Download, Search, CheckCircle2, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOrdersContext } from "@/contexts/OrdersContext";
import type { Order } from "@/hooks/useOrders";

function downloadCSV(orders: Order[]) {
  const headers = ["Order #", "Source", "Items", "Total Price", "Prep Time (min)", "Time", "Category"];
  const rows = orders.map(o => [
    `#${o.orderNumber}`,
    o.table || o.customerName || o.source || "N/A",
    o.items.map(i => `${i.quantity}x ${i.name}`).join("; "),
    `$${o.totalPrice.toFixed(2)}`,
    o.elapsedMinutes.toString(),
    o.createdAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    o.category,
  ]);
  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `order-history-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const { completedOrders } = useOrdersContext();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return completedOrders;
    const q = search.toLowerCase();
    return completedOrders.filter(o =>
      o.orderNumber.toString().includes(q) ||
      o.items.some(i => i.name.toLowerCase().includes(q)) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.table?.toLowerCase().includes(q) ||
      o.source?.toLowerCase().includes(q)
    );
  }, [search, completedOrders]);

  const totalRevenue = filtered.reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-4 px-6 py-4">
        <button onClick={() => navigate("/")} className="rounded-full bg-secondary p-2 text-secondary-foreground hover:bg-accent transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-foreground">Order History</h1>
          <p className="text-xs text-muted-foreground">{filtered.length} completed orders</p>
        </div>
        <button onClick={() => downloadCSV(filtered)} className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors">
          <Download className="h-4 w-4" /> Download CSV
        </button>
      </header>

      <div className="space-y-4 px-6 pb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-kds-stat-bg px-4 py-3">
              <CheckCircle2 className="h-4 w-4 text-kds-ready" />
              <div>
                <span className="font-mono text-lg font-bold text-foreground">{filtered.length}</span>
                <span className="ml-2 text-xs text-muted-foreground">Orders</span>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-kds-stat-bg px-4 py-3">
              <DollarSign className="h-4 w-4 text-kds-income" />
              <div>
                <span className="font-mono text-lg font-bold text-foreground">${totalRevenue.toFixed(2)}</span>
                <span className="ml-2 text-xs text-muted-foreground">Revenue</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search history..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="rounded-lg border border-border bg-secondary pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring w-[200px]"
            />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Order</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Source</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Items</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Prep</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Time</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Total</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No completed orders yet. Complete orders from the Kitchen Display to see them here.
                  </td>
                </tr>
              ) : (
                filtered.map(order => (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-foreground">#{order.orderNumber}</span>
                        {order.isRush && <span className="rounded-full bg-kds-delayed/20 px-2 py-0.5 text-[10px] font-bold text-kds-delayed">RUSH</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground">{order.table || order.customerName || order.source || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {order.items.map(i => `${i.quantity}× ${i.name}`).join(", ")}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground capitalize">{order.category}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-muted-foreground">{order.elapsedMinutes}m</td>
                    <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                      {order.createdAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-kds-income">${order.totalPrice.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
