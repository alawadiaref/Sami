import { NextRequest, NextResponse } from "next/server";
import { deleteAdmin, updateAdminPermissions } from "@/lib/admins";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin(req, "team");
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const { permissions } = await req.json();
  const admin = updateAdminPermissions(id, permissions ?? []);
  if (!admin) return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  const { password: _password, ...safe } = admin;
  return NextResponse.json(safe);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin(req, "team");
  if (unauthorized) return unauthorized;

  const { id } = await params;
  deleteAdmin(id);
  return NextResponse.json({ ok: true });
}
