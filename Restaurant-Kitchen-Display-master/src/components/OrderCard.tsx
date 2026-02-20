import { Clock, AlertTriangle, ChevronRight, CheckCircle2, DollarSign } from "lucide-react";
import type { Order } from "@/hooks/useOrders";
import { foodImages } from "@/data/menuData";
import { useSound } from "@/hooks/useSound";

interface OrderCardProps {
  order: Order;
  onAdvance: (id: string) => void;
  onComplete: (id: string) => void;
  onToggleItem: (orderId: string, itemId: string) => void;
}

const statusConfig = {
  delayed: { label: "DELAYED", textClass: "text-kds-delayed", borderClass: "border-kds-border-delayed", bgClass: "bg-kds-delayed/5" },
  new: { label: "NEW", textClass: "text-kds-new", borderClass: "border-kds-border-new", bgClass: "bg-kds-new/5" },
  preparing: { label: "PREPARING", textClass: "text-kds-warning", borderClass: "border-kds-warning/30", bgClass: "bg-kds-warning/5" },
  ready: { label: "READY", textClass: "text-kds-ready", borderClass: "border-kds-border-ready", bgClass: "bg-kds-ready/5" },
  completed: { label: "COMPLETED", textClass: "text-kds-ready", borderClass: "border-kds-border-ready", bgClass: "bg-kds-ready/5" },
};

const actionLabels: Record<string, string> = {
  new: "Advance to Preparing",
  delayed: "Advance to Preparing",
  preparing: "Mark as Ready",
  ready: "COMPLETED",
};

export function OrderCard({ order, onAdvance, onComplete, onToggleItem }: OrderCardProps) {
  const config = statusConfig[order.status];
  const { playClick } = useSound();

  const handleAction = () => {
    playClick();
    if (order.status === "ready") {
      onComplete(order.id);
    } else {
      onAdvance(order.id);
    }
  };

  const handleToggle = (itemId: string) => {
    playClick();
    onToggleItem(order.id, itemId);
  };

  const location = order.table
    ? `🍴 ${order.table} T${order.tableNumber}`
    : order.customerName
    ? `👤 ${order.customerName}`
    : order.source
    ? `🚗 ${order.source}`
    : "";

  return (
    <div className={`flex flex-col rounded-2xl border-2 ${config.borderClass} ${config.bgClass} bg-card p-5 transition-all hover:shadow-glow hover:-translate-y-0.5`}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xl font-bold text-foreground">#{order.orderNumber}</span>
          {order.isRush && (
            <span className="flex items-center gap-1 rounded-full bg-kds-delayed/20 px-2.5 py-1 text-xs font-bold text-kds-delayed animate-pulse-glow">
              <AlertTriangle className="h-3 w-3" /> RUSH
            </span>
          )}
        </div>
        <span className={`text-sm font-bold tracking-wide ${config.textClass}`}>{config.label}</span>
      </div>

      {/* Location & Timer */}
      <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
        <span className="font-medium">{location}</span>
        <span className="flex items-center gap-1.5 font-mono bg-secondary rounded-lg px-2.5 py-1">
          <Clock className="h-3.5 w-3.5" /> {order.elapsedMinutes}:45
        </span>
      </div>

      {/* Items */}
      <div className="mb-4 flex-1 space-y-3">
        {order.items.map(item => {
          const img = foodImages[item.name];
          return (
            <div key={item.id} className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <button
                  onClick={() => handleToggle(item.id)}
                  className={`mt-0.5 h-5 w-5 rounded-md border-2 transition-colors flex-shrink-0 flex items-center justify-center ${
                    item.completed ? "border-kds-ready bg-kds-ready/20" : "border-muted-foreground/30 hover:border-accent"
                  }`}
                >
                  {item.completed && <CheckCircle2 className="h-4 w-4 text-kds-ready" />}
                </button>
                {img && (
                  <img src={img} alt={item.name} className="h-10 w-10 rounded-lg object-cover flex-shrink-0 ring-1 ring-border" />
                )}
                <div>
                  <span className={`text-sm font-medium ${item.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {item.quantity}× {item.name}
                  </span>
                  {item.notes?.map((note, i) => (
                    <p key={i} className="text-xs text-kds-warning italic mt-0.5">⚡ {note}</p>
                  ))}
                </div>
              </div>
              <span className="text-xs text-muted-foreground font-mono whitespace-nowrap bg-secondary rounded-md px-2 py-0.5">{item.prepTime}m</span>
            </div>
          );
        })}
      </div>

      {/* Price */}
      <div className="mb-4 flex items-center justify-end gap-1 text-base font-bold text-kds-income">
        <DollarSign className="h-4 w-4" />
        {order.totalPrice.toFixed(2)}
      </div>

      {/* Action Button */}
      {order.status !== "completed" && (
        <button
          onClick={handleAction}
          className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-semibold transition-all ${
            order.status === "ready"
              ? "gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
              : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          {order.status === "ready" && <CheckCircle2 className="h-4 w-4" />}
          {actionLabels[order.status]}
          {order.status !== "ready" && <ChevronRight className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}
