import { NextRequest, NextResponse } from "next/server";
import { createCustomer, emailTaken } from "@/lib/customers";
import { createCustomerSessionCookie, CUSTOMER_SESSION_COOKIE_NAME } from "@/lib/customer-auth";

export async function POST(req: NextRequest) {
  const { name, email, phone, password } = await req.json();

  if (!name || !email || !phone || !password) {
    return NextResponse.json({ error: "الرجاء تعبئة كل الحقول" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }, { status: 400 });
  }
  if (emailTaken(email)) {
    return NextResponse.json({ error: "هذا البريد الإلكتروني مستخدم بالفعل" }, { status: 409 });
  }

  const customer = createCustomer({ name, email, phone, password });
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
