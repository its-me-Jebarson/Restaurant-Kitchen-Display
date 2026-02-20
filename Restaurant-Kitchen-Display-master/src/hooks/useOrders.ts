import { useState, useCallback, useMemo } from "react";

export type OrderStatus = "new" | "preparing" | "ready" | "completed" | "delayed";
export type OrderCategory = "grill" | "drinks" | "desserts" | "salads";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  prepTime: number;
  notes?: string[];
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: number;
  table?: string;
  tableNumber?: number;
  customerName?: string;
  source?: string;
  status: OrderStatus;
  isRush: boolean;
  category: OrderCategory;
  items: OrderItem[];
  createdAt: Date;
  elapsedMinutes: number;
  totalPrice: number;
}
