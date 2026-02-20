import { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef, type ReactNode } from "react";
import type { Order, OrderStatus, OrderCategory } from "@/hooks/useOrders";
import { menuItems } from "@/data/menuData";

// --- Order generator helpers ---

const tableNames = Array.from({ length: 15 }, (_, i) => `Table ${i + 1}`);
const sources = ["DoorDash", "UberEats", "GrubHub"];
const customerNames = ["Sarah M.", "Mike D.", "Lisa K.", "Tom R.", "Anna P.", "James W.", "Nina L.", "Carlos F.", "Emily H.", "David S."];
const noteOptions: Record<string, string[]> = {
  grill: ["Medium-rare", "Well-done", "Medium", "Rare", "No sauce", "Extra cheese", "No onions", "Gluten-free"],
  drinks: ["Extra ice", "No sugar", "Oat milk", "Double shot"],
  desserts: ["No nuts", "Extra whipped cream", "Warm"],
  salads: ["No croutons", "Extra dressing", "Gluten-free"],
};

let orderCounter = 1044;
let itemCounter = 1000;

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateOrder(): Order {
  const category: OrderCategory = randomPick(["grill", "drinks", "desserts", "salads"]);
  const categoryItems = menuItems.filter(m => m.category === category);
  const itemCount = randomInt(1, 3);
  const items = Array.from({ length: itemCount }, () => {
    const menu = randomPick(categoryItems);
    const hasNote = Math.random() > 0.6;
    itemCounter++;
    return {
      id: `gen-${itemCounter}`,
      name: menu.name,
      quantity: randomInt(1, 4),
      prepTime: menu.prepTime,
      notes: hasNote ? [randomPick(noteOptions[category])] : undefined,
      completed: false,
    };
  });

  const totalPrice = items.reduce((sum, it) => {
    const menuItem = menuItems.find(m => m.name === it.name);
    return sum + (menuItem?.price ?? 10) * it.quantity;
  }, 0);

  orderCounter++;
  const locationType = randomInt(1, 3);
  const tableNum = randomInt(1, 15);

  return {
    id: crypto.randomUUID(),
    orderNumber: orderCounter,
    ...(locationType === 1
      ? { table: tableNames[tableNum - 1], tableNumber: tableNum }
      : locationType === 2
      ? { customerName: randomPick(customerNames) }
      : { source: `${randomPick(sources)} #${randomInt(100, 999)}` }),
    status: "new" as OrderStatus,
    isRush: Math.random() > 0.75,
    category,
    items,
    createdAt: new Date(),
    elapsedMinutes: 0,
    totalPrice: Math.round(totalPrice * 100) / 100,
  };
}

// Start with just a few orders
const initialOrders: Order[] = Array.from({ length: 3 }, () => generateOrder());

// --- Context ---

interface OrdersContextValue {
  orders: Order[];
  activeOrders: Order[];
  completedOrders: Order[];
  stats: {
    totalIncome: number;
    avgPrep: string;
    completed: number;
    active: number;
    delayed: number;
    peak: string;
    efficiency: number;
  };
  categoryCounts: Record<string, number>;
  advanceOrder: (id: string) => void;
  completeOrder: (id: string) => void;
  toggleItemComplete: (orderId: string, itemId: string) => void;
  addOrder: (order: Omit<Order, "id">) => void;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children, onNewOrder }: { children: ReactNode; onNewOrder?: () => void }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onNewOrderRef = useRef(onNewOrder);
  onNewOrderRef.current = onNewOrder;

  // Auto-generate orders every 5–10 seconds
  useEffect(() => {
    function scheduleNext() {
      const delay = randomInt(5000, 10000);
      timerRef.current = setTimeout(() => {
        setOrders(prev => [...prev, generateOrder()]);
        onNewOrderRef.current?.();
        scheduleNext();
      }, delay);
    }
    scheduleNext();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Tick elapsed minutes every 60s
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prev =>
        prev.map(o =>
          o.status !== "completed"
            ? { ...o, elapsedMinutes: o.elapsedMinutes + 1 }
            : o
        )
      );
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const markCompleted = useCallback((order: Order) => {
    setCompletedCount(c => c + 1);
    setTotalIncome(inc => inc + order.totalPrice);
  }, []);

  const advanceOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      const nextStatus: Record<string, OrderStatus> = {
        new: "preparing",
        delayed: "preparing",
        preparing: "ready",
        ready: "completed",
      };
      const newStatus = nextStatus[order.status] || order.status;
      if (newStatus === "completed" && order.status !== "completed") {
        setTimeout(() => markCompleted(order), 0);
      }
      return { ...order, status: newStatus };
    }));
  }, [markCompleted]);

  const completeOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      if (order.status !== "completed") {
        setTimeout(() => markCompleted(order), 0);
      }
      return { ...order, status: "completed" as OrderStatus };
    }));
  }, [markCompleted]);

  const toggleItemComplete = useCallback((orderId: string, itemId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      return {
        ...order,
        items: order.items.map(item =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        ),
      };
    }));
  }, []);

  const addOrder = useCallback((newOrder: Omit<Order, "id">) => {
    setOrders(prev => [...prev, { ...newOrder, id: crypto.randomUUID() }]);
  }, []);

  const activeOrders = useMemo(() => orders.filter(o => o.status !== "completed"), [orders]);
  const completedOrders = useMemo(() => orders.filter(o => o.status === "completed"), [orders]);
  const delayedCount = useMemo(() => orders.filter(o => o.status === "delayed").length, [orders]);

  const stats = useMemo(() => ({
    totalIncome,
    avgPrep: "11.4m",
    completed: completedCount,
    active: activeOrders.length,
    delayed: delayedCount,
    peak: "12:00 PM",
    efficiency: 92,
  }), [totalIncome, completedCount, activeOrders.length, delayedCount]);

  const categoryCounts = useMemo(() => ({
    all: activeOrders.length,
    grill: activeOrders.filter(o => o.category === "grill").length,
    drinks: activeOrders.filter(o => o.category === "drinks").length,
    desserts: activeOrders.filter(o => o.category === "desserts").length,
    salads: activeOrders.filter(o => o.category === "salads").length,
  }), [activeOrders]);

  return (
    <OrdersContext.Provider value={{ orders, activeOrders, completedOrders, stats, categoryCounts, advanceOrder, completeOrder, toggleItemComplete, addOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrdersContext() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrdersContext must be used within OrdersProvider");
  return ctx;
}
