import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "El correo y la contraseña son obligatorios." },
        { status: 400 }
      );
    }

    const emailClean = email.trim().toLowerCase();

    // Query user and joined role from Insforge PostgreSQL
    const users = await query(
      `SELECT u.id, u.full_name, u.email, u.password_hash, u.phone, u.avatar_url, u.is_enabled,
              COALESCE(r.name, 'ROLE_CLIENTE') as role_name
       FROM auth_schema.users u
       LEFT JOIN auth_schema.user_roles ur ON u.id = ur.user_id
       LEFT JOIN auth_schema.roles r ON ur.role_id = r.id
       WHERE LOWER(u.email) = $1
       LIMIT 1`,
      [emailClean]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { message: "Credenciales inválidas. Correo no encontrado." },
        { status: 401 }
      );
    }

    const dbUser = users[0];

    if (!dbUser.is_enabled) {
      return NextResponse.json(
        { message: "Tu cuenta se encuentra deshabilitada. Contacta al soporte." },
        { status: 403 }
      );
    }

    // Verify password hash
    const isPasswordValid = await bcrypt.compare(password, dbUser.password_hash || "");
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Credenciales inválidas. Contraseña incorrecta." },
        { status: 401 }
      );
    }

    const roleClean = dbUser.role_name.replace("ROLE_", "");

    // Generate JWT Auth Token
    const tokenPayload = {
      userId: dbUser.id,
      email: dbUser.email,
      role: roleClean,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });

    const userSummary = {
      id: dbUser.id,
      fullName: dbUser.full_name,
      email: dbUser.email,
      phone: dbUser.phone,
      avatarUrl: dbUser.avatar_url,
      role: roleClean,
      provider: "LOCAL",
      enabled: dbUser.is_enabled,
    };

    return NextResponse.json({
      token,
      tokenType: "Bearer",
      user: userSummary,
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: error.message || "Error interno al autenticar con la base de datos." },
      { status: 500 }
    );
  }
}
