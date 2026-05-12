import React, { useState } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { useAuth } from "../hook/useAuth";
import ContinueWithGoogle from "../components/ContinueWithGoogle";
import {
  cardClass,
  cardStyle,
  errorStyle,
  headingClass,
  headingStyle,
  inputBase,
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
      className="min-h-screen flex items-start justify-center px-6 py-16 sm:py-20"
      style={pageStyle}
    >
      <div className="w-full max-w-[440px]">
        <header className="mb-10 text-center space-y-4">
          <p
            className="text-[10px] font-semibold tracking-[0.25em] uppercase"
            style={overlineStyle}
          >
            Welcome back
          </p>
          <h1
            className={`text-[2rem] sm:text-[2.25rem] font-bold leading-tight ${headingClass}`}
            style={headingStyle}
          >
            Sign in
          </h1>
          <p className="text-sm leading-relaxed" style={mutedTextStyle}>
            Same calm layout — email and password only.
          </p>
        </header>

        <form
          onSubmit={onSubmit}
          className={`${cardClass} p-9 sm:p-11 space-y-10 shadow-sm`}
          style={cardStyle}
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
              className="rounded-none px-5 py-3.5 text-sm"
              style={errorStyle}
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${primaryBtnClass}`}
            style={primaryBtnStyle}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <p
            className="text-center text-sm leading-relaxed pt-1"
            style={mutedTextStyle}
          >
            New here?{" "}
            <Link to="/register" className={linkClass}>
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
