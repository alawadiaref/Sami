import { NextRequest, NextResponse } from "next/server";
import { checkCustomerCredentials, createCustomerSessionCookie, CUSTOMER_SESSION_COOKIE_NAME } from "@/lib/customer-auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const customer = checkCustomerCredentials(email, password);
  if (!customer) {
    return NextResponse.json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true, name: customer.name });
  res.cookies.set(CUSTOMER_SESSION_COOKIE_NAME, await createCustomerSessionCookie(customer.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(CUSTOMER_SESSION_COOKIE_NAME);
  return res;
}
