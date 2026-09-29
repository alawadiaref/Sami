import { NextRequest, NextResponse } from "next/server";
import { getCustomerFromToken, CUSTOMER_SESSION_COOKIE_NAME } from "@/lib/customer-auth";
import { toSafeCustomer } from "@/lib/customers-types";

export async function GET(req: NextRequest) {
  const customer = await getCustomerFromToken(req.cookies.get(CUSTOMER_SESSION_COOKIE_NAME)?.value);
  if (!customer) return NextResponse.json({ customer: null });
  return NextResponse.json({ customer: toSafeCustomer(customer) });
}
