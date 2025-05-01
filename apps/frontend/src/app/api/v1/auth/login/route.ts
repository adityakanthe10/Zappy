import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

const allowedOrigin = "https://zappy-frontend.onrender.com"; // your deployed frontend

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return withCORS(
        NextResponse.json(
          { error: "Email and password are required." },
          { status: 400 }
        )
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return withCORS(
        NextResponse.json(
          { error: "User not found. Signup Please" },
          { status: 404 }
        )
      );
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return withCORS(
        NextResponse.json({ error: "Invalid password." }, { status: 401 })
      );
    }

    if (!process.env.JWT_SECRET) {
      return withCORS(
        NextResponse.json({ error: "JWT_SECRET not set." }, { status: 500 })
      );
    }

    const role = user.role as "CUSTOMER" | "DELIVERY" | "ADMIN";

    const token = jwt.sign({ userId: user.id, role }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    const res = NextResponse.json(
      {
        message: "Login successful",
        token,
        role,
      },
      { status: 200 }
    );

    res.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60,
      path: "/",
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
    });

    res.cookies.set("role", role, {
      httpOnly: true,
      maxAge: 2 * 60 * 60,
      path: "/",
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
    });

    return withCORS(res);
  } catch (err) {
    console.error("Login error:", err);
    return withCORS(
      NextResponse.json({ error: "Server error" }, { status: 500 })
    );
  }
}

// Handle preflight request (very important)
export function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  return withCORS(res);
}

// Helper function to add CORS headers
function withCORS(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.headers.set("Access-Control-Allow-Credentials", "true");
  return res;
}
