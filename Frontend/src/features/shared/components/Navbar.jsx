import React, { useEffect } from "react";
import { Link, NavLink } from "react-router";
import { useSelector } from "react-redux";
import useCart from "../../cart/hook/useCart";
import {
  cardStyle,
  colors,
  headingClass,
  linkClass,
  overlineStyle,
} from "../../../app/uiTheme";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition ${
    isActive ? "text-amber-800" : "text-zinc-600 hover:text-zinc-900"
  }`;

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const authLoading = useSelector((state) => state.auth.loading);
  const cartItems = useSelector((state) => state.cart.items);
  const { handleGetCart } = useCart();

  const isSeller = user?.role === "seller";
  const cartCount = Array.isArray(cartItems)
    ? cartItems.reduce((n, item) => n + (Number(item.quantity) || 1), 0)
    : 0;

  useEffect(() => {
    if (!user || isSeller) return;
    handleGetCart().catch(() => {});
  }, [user, isSeller, handleGetCart]);

  return (
    <header
      className="sticky top-0 z-50 border-b border-zinc-300"
      style={{ ...cardStyle, backgroundColor: colors.card }}
    >
      <div className="mx-auto flex h-14 sm:h-16 max-w-[min(100%,1200px)] items-center justify-between gap-4 px-4 sm:px-8 lg:px-12">
        <Link to="/" className="flex items-baseline gap-2 shrink-0 group">
          <span
            className="text-[10px] font-semibold tracking-[0.25em] uppercase"
            style={overlineStyle}
          >
            Snitch
          </span>
          <span
            className={`hidden sm:inline text-lg font-bold tracking-tight ${headingClass} text-zinc-900 group-hover:text-amber-800 transition`}
          >
            Shop
          </span>
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 sm:gap-x-6 text-sm">
          <NavLink to="/" end className={navLinkClass}>
            Browse
          </NavLink>

          {authLoading ? (
            <span className="text-sm text-zinc-400">…</span>
          ) : user ? (
            <>
              {!isSeller ? (
                <NavLink to="/cart" className={navLinkClass}>
                  Cart
                  {cartCount > 0 ? (
                    <span className="ml-1.5 inline-flex min-w-[1.25rem] items-center justify-center rounded-none bg-amber-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  ) : null}
                </NavLink>
              ) : null}

              {isSeller ? (
                <>
                  <NavLink to="/seller/dashboard" className={navLinkClass}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/seller/create-product" className={navLinkClass}>
                    Sell
                  </NavLink>
                </>
              ) : null}

              <span
                className="hidden md:inline text-zinc-500 truncate max-w-[180px]"
                title={user.email}
              >
                {user.fullName?.trim() || user.email}
              </span>
            </>
          ) : (
            <>
              <Link to="/login" className={navLinkClass({ isActive: false })}>
                Log in
              </Link>
              <Link
                to="/register"
                className={`${linkClass} text-sm font-semibold`}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
