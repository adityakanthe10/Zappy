"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../lib/store";
import { loginUser } from "../lib/store/features/auth/authThunk";
import Link from "next/link";

export default function LoginForm() {
  /* ---------------------------------------------------------------- */
  /* local component state                                            */
  /* ---------------------------------------------------------------- */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* ---------------------------------------------------------------- */
  /* redux + routing helpers                                          */
  /* ---------------------------------------------------------------- */
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, error } = useAppSelector((s) => s.auth);

  /* ---------------------------------------------------------------- */
  /* submit handler                                                   */
  /* ---------------------------------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await dispatch(loginUser({ email, password }));
    console.log("res", res);

    if (loginUser.fulfilled.match(res)) {
      // token + role are now in Redux and localStorage (slice does that)
      router.replace(
        res.payload.role === "CUSTOMER" ? "/customer" : "/partner"
      );
    }
  };

  return (
    <section className="pt-20 pb-20">
      <div className="container mx-auto max-w-lg">
        <div className="bg-white shadow-lg rounded-lg p-10">
          <h2 className="text-2xl font-bold text-center mb-2">Login</h2>
          <p className="text-center text-gray-600 mb-8">
            Don&apos;t have an account?{" "}
            <span className="text-blue-600">
              <Link href="register">Signup</Link>
            </span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
            {/* email */}
            <div>
              <label className="block mb-1 font-semibold">Email</label>
              <input
                className="w-full p-3 border rounded-lg shadow-sm"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* password */}
            <div>
              <label className="block mb-1 font-semibold">Password</label>
              <input
                className="w-full p-3 border rounded-lg shadow-sm"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <button
              disabled={status === "loading"}
              className="w-full py-3 bg-black text-white rounded-lg disabled:opacity-60"
            >
              {status === "loading" ? "Signing in…" : "Login"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
