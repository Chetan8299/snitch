import React from "react";

const ContinueWithGoogle = () => {
  return (
    <div>
      <a
        className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-[#dadce0] bg-white px-6 py-3.5 text-sm font-medium text-[#3c4043] shadow-sm transition-colors duration-200 hover:bg-[#f8f9fa] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/30 focus:ring-offset-2 focus:ring-offset-[#1C1B1D]"
        href="/api/auth/google"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 18 18"
          className="h-[18px] w-[18px]"
        >
          <path
            fill="#4285F4"
            d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.58 2.68-3.9 2.68-6.62Z"
          />
          <path
            fill="#34A853"
            d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33A9 9 0 0 0 9 18Z"
          />
          <path
            fill="#FBBC05"
            d="M3.97 10.71a5.41 5.41 0 0 1 0-3.42V4.96H.96a9 9 0 0 0 0 8.08l3.01-2.33Z"
          />
          <path
            fill="#EA4335"
            d="M9 3.58c1.33 0 2.52.46 3.46 1.36l2.58-2.58A8.96 8.96 0 0 0 9 0 .9 9 0 0 0 .96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
          />
        </svg>
        <span>Continue with Google</span>
      </a>
    </div>
  );
};

export default ContinueWithGoogle;
