import { requirePagePermission } from "@/lib/require-page-permission";
import ContentClient from "./ContentClient";

export default async function Page() {
  await requirePagePermission("content");
  return <ContentClient />;
}
