import React, { useState } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { useAuth } from "../hook/useAuth";
import ContinueWithGoogle from "../components/ContinueWithGoogle";

/* ─── Design tokens (Stitch · Nocturne Amber) ─────────────────────────────
   surface          #131315   Level-0 page bg
   surface_low      #1C1B1D   Level-1 card bg
   surface_container#201F22   Level-2 inner chip/hover
   outline_variant  #534434   Ghost border (20 % opacity rule)
   primary          #FFC174   Warm amber glow
   primary_container#F59E0B   CTA / true accent
   on_surface       #E5E1E4   Body text
   on_surface_var   #D8C3AD   Muted / label text
──────────────────────────────────────────────────────────────────────── */

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

const Register = () => {
  const { handleRegister } = useAuth();
  const { loading, error } = useSelector((state) => state.auth);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [isSeller, setIsSeller] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    await handleRegister({
      email: email.trim(),
      contact: contact.trim(),
      password,
      fullName: fullName.trim(),
      isSeller,
    });
  };

  return (
    <div
      className="min-h-screen flex items-start justify-center px-6 py-20 sm:py-28"
      style={{ backgroundColor: "#131315", fontFamily: "'Inter', sans-serif" }}
    >
      {/* Google Fonts — Inter + Manrope */}
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
        {/* ── Header ── */}
        <header className="mb-14 text-center space-y-4">
          <p
            className="text-[10px] font-semibold tracking-[0.25em] uppercase"
            style={{ color: "#F59E0B" }}
          >
            Join
          </p>
          <h1
            className="text-[2rem] sm:text-[2.25rem] font-bold tracking-tight leading-tight"
            style={{
              fontFamily: "'Manrope', sans-serif",
              color: "#E5E1E4",
              letterSpacing: "-0.02em",
            }}
          >
            Create your account
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "#D8C3AD" }}>
            A few details — room to breathe.
          </p>
        </header>

        {/* ── Form shell ── */}
        <form
          onSubmit={onSubmit}
          className="rounded-3xl p-9 sm:p-11 space-y-10"
          style={{ backgroundColor: "#1C1B1D" }}
          noValidate
        >
          {/* ── Fields ── */}
          <div className="space-y-8">
            <Field id="fullName" label="Full name">
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                minLength={3}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="At least 3 characters"
                className={inputBase}
              />
            </Field>

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

            <Field id="contact" label="Contact">
              <input
                id="contact"
                name="contact"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                required
                pattern="\d{10}"
                title="Enter a 10-digit phone number"
                maxLength={10}
                value={contact}
                onChange={(e) =>
                  setContact(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                placeholder="10-digit number"
                className={inputBase}
              />
            </Field>

            <Field id="password" label="Password">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a strong password"
                className={inputBase}
              />
            </Field>
          </div>

          {/* ── Seller toggle card ── */}
          <div
            className="rounded-2xl px-6 py-5 transition-colors duration-200"
            style={{ backgroundColor: "#201F22" }}
          >
            <label className="flex cursor-pointer items-start gap-5 select-none">
              {/* Custom amber checkbox */}
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  id="isSeller"
                  type="checkbox"
                  name="isSeller"
                  checked={isSeller}
                  onChange={(e) => setIsSeller(e.target.checked)}
                  className="sr-only peer"
                />
                <div
                  className={
                    "h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 " +
                    (isSeller
                      ? "border-[#F59E0B] bg-[#F59E0B]"
                      : "border-[#534434]/70 bg-[#1C1B1D]")
                  }
                >
                  {isSeller && (
                    <svg viewBox="0 0 12 10" fill="none" className="h-3 w-3">
                      <path
                        d="M1 5l3.5 3.5L11 1"
                        stroke="#472a00"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>

              <span className="space-y-1.5">
                <span
                  className="block text-sm font-semibold"
                  style={{ color: "#E5E1E4" }}
                >
                  I am a seller
                </span>
                <span
                  className="block text-xs leading-relaxed"
                  style={{ color: "#D8C3AD" }}
                >
                  Check this if you plan to list items. Leave unchecked for a
                  buyer account.
                </span>
              </span>
            </label>
          </div>

          {/* ── Error banner ── */}
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

          {/* ── Submit ── */}
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
            {loading ? "Creating account…" : "Register"}
          </button>

          <p
            className="text-center text-sm leading-relaxed pt-1"
            style={{ color: "#D8C3AD" }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#F59E0B] transition hover:text-[#FFC174]"
            >
              Sign in
            </Link>
          </p>

          <ContinueWithGoogle />
        </form>
      </div>
    </div>
  );
};

export default Register;
