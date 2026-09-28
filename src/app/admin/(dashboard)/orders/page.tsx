import { requirePagePermission } from "@/lib/require-page-permission";
import OrdersClient from "./OrdersClient";

export default async function Page() {
  await requirePagePermission("orders");
  return <OrdersClient />;
}
