import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";
import { emailValidator, passwordValidator } from "../../../../lib/validators";

const registerSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: emailValidator,
  password: passwordValidator,
  role: z.enum(["CUSTOMER", "DELIVERY", "ADMIN"]).optional(), // Include 'ADMIN' in role options
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, password, role } = registerSchema.parse(body);

    // Extract current logged-in user (admin) from request headers or JWT token
    const userIdFromToken = req.headers.get("user-id");
    const userRoleFromToken = req.headers.get("user-role");

    // If attempting to assign the "ADMIN" role, ensure that the request is from an existing admin
    if (role === "ADMIN") {
      // If userRoleFromToken is not "ADMIN", deny the request
      if (userRoleFromToken !== "ADMIN") {
        return NextResponse.json(
          { error: "Only admins can register other admins." },
          { status: 403 }
        );
      }

      // Optionally, check if the logged-in admin's ID matches the requestor's ID (if needed)
      // For example, if the admin is allowed to only create admins themselves:
      if (userIdFromToken !== "expectedAdminId") {
        return NextResponse.json(
          { error: "You are not authorized to perform this action." },
          { status: 403 }
        );
      }
    }

    // Check if the email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists." },
        { status: 409 }
      );
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role || "CUSTOMER", // Default to "CUSTOMER" if no role is provided
      },
    });

    // -------- create JWT token --------
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET missing in env");

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Set response with the role and JWT token
    const response = NextResponse.json(
      {
        message: "User registered successfully",
        role: user.role,
      },
      { status: 201 }
    );

    // Set HTTP-only cookie for the JWT token
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only over HTTPS in production
      sameSite: "lax",
      path: "/", // cookie available across entire app
      maxAge: 2 * 60 * 60, // 2 hours
    });

    return response;
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Server error:", error);
    return NextResponse.json(
      { error: `${error} Server error, please try again.` },
      { status: 500 }
    );
  }
}
