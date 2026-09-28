import { requirePagePermission } from "@/lib/require-page-permission";
import ThemeClient from "./ThemeClient";

export default async function Page() {
  await requirePagePermission("theme");
  return <ThemeClient />;
}
