"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../lib/store/store";
import { registerUser } from "../lib/store/features/auth/authThunk";
import { z } from "zod";
import { emailValidator, passwordValidator } from "../lib/validators";
import Link from "next/link";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  email: emailValidator,
  password: passwordValidator,
  role: z.enum(["CUSTOMER", "DELIVERY"]),
});

export default function SignUpForm() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "CUSTOMER" as "CUSTOMER" | "DELIVERY",
  });

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, error } = useAppSelector((s) => s.auth);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // client-side Zod validation
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      alert(parsed.error.errors[0].message);
      return;
    }

    try {
      const res = await dispatch(registerUser(parsed.data));
      if (registerUser.fulfilled.match(res)) {
        // Save token and role to cookies (handled in the slice)
        // Redirect based on role
        const targetRoute =
          parsed.data.role === "CUSTOMER" ? "/customer" : "/partner";
        router.replace(targetRoute);
      }
    } catch (err) {
      console.error("Error registering user:", err);
    }
  };

  return (
    <section className="pt-20 pb-20">
      <div className="container mx-auto max-w-lg">
        <div className="bg-white shadow-lg rounded-lg p-10">
          <h2 className="text-2xl font-bold text-center mb-2">
            Create account
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Already have an account?<span className="text-blue-600"><Link href="login">Login</Link></span>
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* username */}
            <div>
              <label className="block font-semibold mb-1">Username</label>
              <input
                className="form-control shadow-sm bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-3"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                placeholder="johndoe"
              />
            </div>

            {/* email */}
            <div>
              <label className="block font-semibold mb-1">Email</label>
              <input
                className="form-control shadow-sm bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-3"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter email"
              />
            </div>

            {/* password */}
            <div>
              <label className="block font-semibold mb-1">Password</label>
              <input
                className="form-control shadow-sm bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-3"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
              />
            </div>

            {/* role */}
            <div>
              <label className="block font-semibold mb-1">Role</label>
              <select
                name="role"
                className="form-control shadow-sm bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-3"
                value={form.role}
                onChange={handleChange}
              >
                <option value="CUSTOMER">Customer</option>
                <option value="DELIVERY">Delivery Partner</option>
              </select>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <button
              disabled={status === "loading"}
              className="w-full flex justify-center items-center text-white rounded-lg bg-black hover:bg-black focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium text-sm py-3"
            >
              {status === "loading" ? "Creating…" : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
