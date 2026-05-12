import React, { useState } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { useAuth } from "../hook/useAuth";
import ContinueWithGoogle from "../components/ContinueWithGoogle";
import {
  cardClass,
  cardStyle,
  colors,
  errorStyle,
  headingClass,
  headingStyle,
  inputBase,
  innerStyle,
  labelBase,
  linkClass,
  mutedTextStyle,
  overlineStyle,
  pageStyle,
  primaryBtnClass,
  primaryBtnStyle,
} from "../../../app/uiTheme";

const Field = ({ id, label, children }) => (
  <div>
    <label htmlFor={id} className={labelBase}>
      {label} <span className="text-amber-700">*</span>
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
      className="min-h-screen flex items-start justify-center px-6 py-16 sm:py-20"
      style={pageStyle}
    >
      <div className="w-full max-w-[440px]">
        <header className="mb-10 text-center space-y-4">
          <p
            className="text-[10px] font-semibold tracking-[0.25em] uppercase"
            style={overlineStyle}
          >
            Join
          </p>
          <h1
            className={`text-[2rem] sm:text-[2.25rem] font-bold leading-tight ${headingClass}`}
            style={headingStyle}
          >
            Create your account
          </h1>
          <p className="text-sm leading-relaxed" style={mutedTextStyle}>
            A few details — room to breathe.
          </p>
        </header>

        <form
          onSubmit={onSubmit}
          className={`${cardClass} p-9 sm:p-11 space-y-10 shadow-sm`}
          style={cardStyle}
          noValidate
        >
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

          <div
            className="rounded-none border border-zinc-300 px-6 py-5"
            style={innerStyle}
          >
            <label className="flex cursor-pointer items-start gap-5 select-none">
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
                    "h-5 w-5 rounded-none border-2 flex items-center justify-center transition-all duration-200 " +
                    (isSeller
                      ? "border-amber-600 bg-amber-600"
                      : "border-zinc-400 bg-white")
                  }
                >
                  {isSeller ? (
                    <svg viewBox="0 0 12 10" fill="none" className="h-3 w-3">
                      <path
                        d="M1 5l3.5 3.5L11 1"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </div>
              </div>

              <span className="space-y-1.5">
                <span className="block text-sm font-semibold" style={{ color: colors.text }}>
                  I am a seller
                </span>
                <span className="block text-xs leading-relaxed" style={mutedTextStyle}>
                  Check this if you plan to list items. Leave unchecked for a buyer account.
                </span>
              </span>
            </label>
          </div>

          {error ? (
            <p className="rounded-none px-5 py-3.5 text-sm" style={errorStyle} role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${primaryBtnClass}`}
            style={primaryBtnStyle}
          >
            {loading ? "Creating account…" : "Register"}
          </button>

          <p className="text-center text-sm leading-relaxed pt-1" style={mutedTextStyle}>
            Already have an account?{" "}
            <Link to="/login" className={linkClass}>
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
