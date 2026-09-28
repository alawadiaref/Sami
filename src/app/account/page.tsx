import { cookies } from "next/headers";
import { getCustomerFromToken, CUSTOMER_SESSION_COOKIE_NAME } from "@/lib/customer-auth";
import { getTheme } from "@/lib/theme";
import AccountClient from "./AccountClient";

export default async function AccountPage() {
  const cookieStore = await cookies();
  const customer = await getCustomerFromToken(cookieStore.get(CUSTOMER_SESSION_COOKIE_NAME)?.value);
  const theme = getTheme();

  return <AccountClient storeName={theme.storeName} initialCustomer={customer ? { name: customer.name, email: customer.email } : null} />;
}
