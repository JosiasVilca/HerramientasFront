import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, password, phone, role = "CLIENTE" } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { message: "Nombre completo, correo y contraseña son obligatorios." },
        { status: 400 }
      );
    }

    const emailClean = email.trim().toLowerCase();

    // Check if user already exists in Insforge PostgreSQL
    const existingUsers = await query(
      "SELECT id FROM auth_schema.users WHERE email = $1",
      [emailClean]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { message: "El correo electrónico ya se encuentra registrado." },
        { status: 400 }
      );
    }

    // Hash password with BCrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user into auth_schema.users
    const insertedUsers = await query(
      `INSERT INTO auth_schema.users (full_name, email, password_hash, phone, provider, is_enabled, is_email_verified)
       VALUES ($1, $2, $3, $4, 'LOCAL', TRUE, TRUE)
       RETURNING id, full_name, email, phone, avatar_url, is_enabled`,
      [fullName.trim(), emailClean, passwordHash, phone || null]
    );

    const newUser = insertedUsers[0];

    // Get role ID from auth_schema.roles
    const targetRoleName = `ROLE_${role.toUpperCase()}`;
    const roles = await query(
      "SELECT id, name FROM auth_schema.roles WHERE name = $1 OR name = $2 LIMIT 1",
      [targetRoleName, `ROLE_${role.toUpperCase()}`]
    );

    let roleId = 2; // Default ROLE_CLIENTE
    let roleName = "CLIENTE";

    if (roles.length > 0) {
      roleId = roles[0].id;
      roleName = roles[0].name.replace("ROLE_", "");
    }

    // Assign role in auth_schema.user_roles
    await query(
      "INSERT INTO auth_schema.user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [newUser.id, roleId]
    );

    // Generate JWT Auth Token
    const tokenPayload = {
      userId: newUser.id,
      email: newUser.email,
      role: roleName,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });

    const userSummary = {
      id: newUser.id,
      fullName: newUser.full_name,
      email: newUser.email,
      phone: newUser.phone,
      avatarUrl: newUser.avatar_url,
      role: roleName,
      provider: "LOCAL",
      enabled: newUser.is_enabled,
    };

    return NextResponse.json(
      {
        token,
        tokenType: "Bearer",
        user: userSummary,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { message: error.message || "Error interno al registrar usuario en la base de datos." },
      { status: 500 }
    );
  }
}
