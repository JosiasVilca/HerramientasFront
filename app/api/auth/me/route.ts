import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { query } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Token de autorización no proporcionado." },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded: any = jwt.verify(token, JWT_SECRET);

    const users = await query(
      `SELECT u.id, u.full_name, u.email, u.phone, u.avatar_url, u.is_enabled,
              COALESCE(r.name, 'ROLE_CLIENTE') as role_name
       FROM auth_schema.users u
       LEFT JOIN auth_schema.user_roles ur ON u.id = ur.user_id
       LEFT JOIN auth_schema.roles r ON ur.role_id = r.id
       WHERE u.id = $1
       LIMIT 1`,
      [decoded.userId]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { message: "Usuario no encontrado." },
        { status: 404 }
      );
    }

    const dbUser = users[0];
    const roleClean = dbUser.role_name.replace("ROLE_", "");

    return NextResponse.json({
      id: dbUser.id,
      fullName: dbUser.full_name,
      email: dbUser.email,
      phone: dbUser.phone,
      avatarUrl: dbUser.avatar_url,
      role: roleClean,
      provider: "LOCAL",
      enabled: dbUser.is_enabled,
    });
  } catch (error: any) {
    console.error("Auth /me Error:", error);
    return NextResponse.json(
      { message: "Token de sesión inválido o expirado." },
      { status: 401 }
    );
  }
}
