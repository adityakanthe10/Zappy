// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/db";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return NextResponse.json({ error: "User not found." }, { status: 404 });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return NextResponse.json({ error: "Invalid password." }, { status: 401 });

    if (!process.env.JWT_SECRET)
      return NextResponse.json(
        { error: "JWT_SECRET not set." },
        { status: 500 }
      );

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    /* ---- return token + role + optional message ---- */
    return NextResponse.json(
      {
        message: "Login successful",
        token,        // JWT
        role: user.role as "CUSTOMER" | "DELIVERY",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
