import { NextRequest, NextResponse } from "next/server";
import { getAdmins, createAdmin, usernameTaken } from "@/lib/admins";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const unauthorized = await requireAdmin(req, "team");
  if (unauthorized) return unauthorized;

  const admins = getAdmins().map(({ password: _password, ...rest }) => rest);
  return NextResponse.json(admins);
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin(req, "team");
  if (unauthorized) return unauthorized;

  const body = await req.json();
  if (!body.name || !body.username || !body.password) {
    return NextResponse.json({ error: "الاسم واسم المستخدم وكلمة المرور مطلوبة" }, { status: 400 });
  }
  if (usernameTaken(body.username)) {
    return NextResponse.json({ error: "اسم المستخدم هذا مستخدم بالفعل" }, { status: 409 });
  }
  const admin = createAdmin({
    name: body.name,
    username: body.username,
    password: body.password,
    role: "admin",
    permissions: Array.isArray(body.permissions) ? body.permissions : [],
  });
  const { password: _password, ...safe } = admin;
  return NextResponse.json(safe, { status: 201 });
}
