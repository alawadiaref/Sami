import { requirePagePermission } from "@/lib/require-page-permission";
import ProductsClient from "./ProductsClient";

export default async function Page() {
  await requirePagePermission("products");
  return <ProductsClient />;
}
