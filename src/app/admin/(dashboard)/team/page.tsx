import { requirePagePermission } from "@/lib/require-page-permission";
import TeamClient from "./TeamClient";

export default async function Page() {
  await requirePagePermission("team");
  return <TeamClient />;
}
