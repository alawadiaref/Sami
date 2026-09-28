import { requirePagePermission } from "@/lib/require-page-permission";
import OffersClient from "./OffersClient";

export default async function Page() {
  await requirePagePermission("offers");
  return <OffersClient />;
}
