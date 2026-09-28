import { NextRequest, NextResponse } from "next/server";
import { checkCredentials, createSessionCookie, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const admin = checkCredentials(username, password);
  if (!admin) {
    return NextResponse.json({ error: "الاسم أو كلمة المرور غير صحيحة" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true, name: admin.name, role: admin.role });
  res.cookies.set(SESSION_COOKIE_NAME, await createSessionCookie(admin.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE_NAME);
  return res;
}
