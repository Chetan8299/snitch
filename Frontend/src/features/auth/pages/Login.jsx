import React, { useState } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { useAuth } from "../hook/useAuth";
import ContinueWithGoogle from "../components/ContinueWithGoogle";

/* ─── Design tokens (Stitch · Nocturne Amber) — match Register ─────────── */

const inputBase =
  "w-full rounded-2xl border px-5 py-4 text-sm text-[#E5E1E4] " +
  "bg-[#1C1B1D] placeholder:text-[#534434]/80 " +
  "border-[#534434]/40 " +
  "transition-all duration-200 outline-none " +
  "focus:border-[#F59E0B]/60 focus:ring-2 focus:ring-[#F59E0B]/15 " +
  "hover:border-[#534434]/70";

const labelBase =
  "block text-xs font-medium tracking-widest uppercase text-[#D8C3AD]/70 mb-2.5";

const Field = ({ id, label, children }) => (
  <div>
    <label htmlFor={id} className={labelBase}>
      {label} <span className="text-[#F59E0B]">*</span>
    </label>
    {children}
  </div>
);

const Login = () => {
  const { handleLogin } = useAuth();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    await handleLogin({
      email: email.trim(),
      password,
    });
  };

  return (
    <div
      className="min-h-screen flex items-start justify-center px-6 py-20 sm:py-28"
      style={{ backgroundColor: "#131315", fontFamily: "'Inter', sans-serif" }}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700&display=swap"
        rel="stylesheet"
      />

      <div className="w-full max-w-[440px]">
        <header className="mb-14 text-center space-y-4">
          <p
            className="text-[10px] font-semibold tracking-[0.25em] uppercase"
            style={{ color: "#F59E0B" }}
          >
            Welcome back
          </p>
          <h1
            className="text-[2rem] sm:text-[2.25rem] font-bold tracking-tight leading-tight"
            style={{
              fontFamily: "'Manrope', sans-serif",
              color: "#E5E1E4",
              letterSpacing: "-0.02em",
            }}
          >
            Sign in
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "#D8C3AD" }}>
            Same calm layout — email and password only.
          </p>
        </header>

        <form
          onSubmit={onSubmit}
          className="rounded-3xl p-9 sm:p-11 space-y-10"
          style={{ backgroundColor: "#1C1B1D" }}
          noValidate
        >
          <div className="space-y-8">
            <Field id="email" label="Email">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputBase}
              />
            </Field>

            <Field id="password" label="Password">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className={inputBase}
              />
            </Field>
          </div>

          {error ? (
            <p
              className="rounded-2xl px-5 py-3.5 text-sm"
              style={{
                backgroundColor: "rgba(147,0,10,0.25)",
                border: "1px solid rgba(255,180,171,0.15)",
                color: "#FFAAA5",
              }}
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className={
              "w-full rounded-2xl py-4 text-sm font-semibold tracking-wide " +
              "transition-all duration-200 " +
              "disabled:pointer-events-none disabled:opacity-40 " +
              "focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/40 focus:ring-offset-2 " +
              "focus:ring-offset-[#1C1B1D]"
            }
            style={{
              background: loading
                ? "#F59E0B"
                : "linear-gradient(135deg, #FFC174 0%, #F59E0B 100%)",
              color: "#2a1700",
              boxShadow: "0 4px 24px rgba(245,158,11,0.18)",
            }}
            onMouseEnter={(e) => {
              if (!loading)
                e.currentTarget.style.boxShadow =
                  "0 4px 32px rgba(245,158,11,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "0 4px 24px rgba(245,158,11,0.18)";
            }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <p
            className="text-center text-sm leading-relaxed pt-1"
            style={{ color: "#D8C3AD" }}
          >
            New here?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#F59E0B] transition hover:text-[#FFC174]"
            >
              Create an account
            </Link>
          </p>
          <ContinueWithGoogle />
        </form>
      </div>
    </div>
  );
};

export default Login;
