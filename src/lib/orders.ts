import fs from "fs";
import path from "path";
import { Order } from "./orders-types";

export type { Order, OrderStatus } from "./orders-types";

// Server-only (uses fs) — client components should import types from
// "./orders-types" instead.

const ORDERS_PATH = path.join(process.cwd(), "data", "orders.json");

export function getOrders(): Order[] {
  return JSON.parse(fs.readFileSync(ORDERS_PATH, "utf-8"));
}

export function saveOrders(orders: Order[]): void {
  fs.writeFileSync(ORDERS_PATH, JSON.stringify(orders, null, 2), "utf-8");
}

export function addOrder(order: Order): void {
  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
}

export function updateOrderStatus(id: string, status: Order["status"]): Order | undefined {
  const orders = getOrders();
  const order = orders.find((o) => o.id === id);
  if (order) {
    order.status = status;
    saveOrders(orders);
  }
  return order;
}
