import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { KDSHeader } from "@/components/KDSHeader";
import { StatsBar } from "@/components/StatsBar";
import { CategoryTabs } from "@/components/CategoryTabs";
import { OrderCard } from "@/components/OrderCard";
import { useOrdersContext } from "@/contexts/OrdersContext";

type CategoryKey = "all" | "grill" | "drinks" | "desserts" | "salads";

const Index = () => {
  const { activeOrders, stats, categoryCounts, advanceOrder, completeOrder, toggleItemComplete } = useOrdersContext();
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const [search, setSearch] = useState("");

  const filteredOrders = useMemo(() => {
    let filtered = activeOrders;
    if (activeCategory !== "all") {
      filtered = filtered.filter(o => o.category === activeCategory);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(o =>
        o.orderNumber.toString().includes(q) ||
        o.items.some(i => i.name.toLowerCase().includes(q)) ||
        o.customerName?.toLowerCase().includes(q) ||
        o.table?.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [activeOrders, activeCategory, search]);

  return (
    <div className="min-h-screen bg-background">
      <KDSHeader />

      <div className="space-y-4 px-6 pb-6">
        <StatsBar stats={stats} />

        <div className="flex items-center justify-between gap-4">
          <CategoryTabs active={activeCategory} onSelect={setActiveCategory} counts={categoryCounts} />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="rounded-xl border border-border bg-secondary pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 w-[220px] transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onAdvance={advanceOrder}
              onComplete={completeOrder}
              onToggleItem={toggleItemComplete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
