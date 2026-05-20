import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import useCart from "../hook/useCart";
import { cartSubtotal, resolveCartLine } from "../utils/cart.utils";
import { formatPrice } from "../../products/utils/product.utils";
import {
  cardClass,
  cardStyle,
  colors,
  errorStyle,
  headingClass,
  headingStyle,
  mutedTextStyle,
  outlineBtnClass,
  overlineStyle,
  pageStyle,
  primaryBtnClass,
  primaryBtnStyle,
} from "../../../app/uiTheme";

function ImagePlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400">
      No image
    </div>
  );
}

function CartLineDetails({ line, outOfStock }) {
  return (
    <div className="min-w-0 flex-1 flex flex-col justify-between gap-3">
      <div>
        <Link
          to={line.productId ? `/product/${line.productId}` : "/"}
          className="text-base sm:text-lg font-semibold text-zinc-900 hover:text-amber-800 transition line-clamp-2"
        >
          {line.title}
        </Link>
        {line.variantLabel && line.variantLabel !== "—" ? (
          <p className="text-sm mt-1.5" style={mutedTextStyle}>
            {line.variantLabel}
          </p>
        ) : null}
        <p className="text-xs mt-2 text-zinc-500">
          Qty {line.quantity}
          {line.stock != null ? ` · ${line.stock} in stock` : ""}
        </p>
        {outOfStock ? (
          <p className="text-xs mt-2 font-medium text-red-700">
            Not enough stock for this quantity.
          </p>
        ) : null}
        {line.diffAmount > 0 ? (
          <p className="text-xs mt-2 font-medium text-red-700">
            You are getting paying {line.diffAmount} more than the original
            price
          </p>
        ) : (
          <p className="text-xs mt-2 font-medium text-green-700">
            You are getting a discount of {Math.abs(line.diffAmount)} less than
            the original price. Purchase this item at {line.formattedLine}
          </p>
        )}
      </div>

      <div className="flex items-end justify-between gap-4 pt-1 border-t border-zinc-200 sm:border-0 sm:pt-0">
        <p className="text-sm text-zinc-500">{line.formattedUnit} each</p>
        <p className="text-lg font-semibold text-amber-700 tabular-nums">
          {line.formattedLine}
        </p>
      </div>
    </div>
  );
}

function CartLineItem({ item }) {
  const line = useMemo(() => resolveCartLine(item), [item]);
  const outOfStock = line.stock != null && line.stock < line.quantity;

  return (
    <li className={`${cardClass} overflow-hidden`} style={cardStyle}>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-5">
        <Link
          to={line.productId ? `/product/${line.productId}` : "/"}
          className="shrink-0 w-full sm:w-28 h-36 sm:h-28 border border-zinc-300 bg-white overflow-hidden block"
        >
          {line.image ? (
            <img
              src={line.image}
              alt=""
              className="w-full h-full object-contain"
            />
          ) : (
            <ImagePlaceholder />
          )}
        </Link>

        <CartLineDetails line={line} outOfStock={outOfStock} />
      </div>
    </li>
  );
}

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const cartTotalPrice = useSelector((state) => state.cart.totalPrice);
  const cartCurrency = useSelector((state) => state.cart.currency);
  const { handleGetCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setError("");
      setLoading(true);
      try {
        await handleGetCart();
      } catch (err) {
        if (!cancelled) {
          const msg =
            err?.response?.data?.message ??
            "Could not load your cart. Try again.";
          setError(typeof msg === "string" ? msg : "Could not load your cart.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const lines = useMemo(
    () => (Array.isArray(cartItems) ? cartItems.map(resolveCartLine) : []),
    [cartItems],
  );

  const { total, currency, count } = useMemo(
    () => cartSubtotal(cartItems),
    [cartItems],
  );

  const displayTotal = Number(cartTotalPrice) || total;
  const displayCurrency = cartCurrency || currency;

  const isEmpty = !loading && !error && lines.length === 0;

  return (
    <div
      className="min-h-screen w-full flex justify-center px-4 sm:px-8 lg:px-12 pt-4 pb-10 sm:pt-6 sm:pb-12"
      style={pageStyle}
    >
      <div className="w-full max-w-[min(100%,1100px)]">
        <header className="mb-8 sm:mb-10">
          <p
            className="text-[10px] font-semibold tracking-[0.25em] uppercase mb-2"
            style={overlineStyle}
          >
            Your bag
          </p>
          <h1
            className={`text-3xl sm:text-4xl font-bold ${headingClass}`}
            style={headingStyle}
          >
            Shopping cart
          </h1>
          <p className="text-sm mt-2" style={mutedTextStyle}>
            {loading
              ? "Loading your items…"
              : isEmpty
                ? "Your cart is empty."
                : `${count} item${count === 1 ? "" : "s"}`}
          </p>
        </header>

        {loading ? (
          <div
            className={`${cardClass} p-12 text-center text-sm`}
            style={{ ...cardStyle, color: colors.muted }}
          >
            Loading cart…
          </div>
        ) : error ? (
          <div
            className={`${cardClass} px-5 py-4 text-sm`}
            style={errorStyle}
            role="alert"
          >
            {error}
          </div>
        ) : isEmpty ? (
          <div
            className={`${cardClass} p-10 sm:p-14 text-center`}
            style={cardStyle}
          >
            <p className="text-lg font-semibold text-zinc-900 mb-2">
              Nothing here yet
            </p>
            <p className="text-sm mb-8 max-w-sm mx-auto" style={mutedTextStyle}>
              When you add products with a chosen variant, they will show up
              here.
            </p>
            <Link
              to="/"
              className={`inline-block px-8 ${primaryBtnClass}`}
              style={primaryBtnStyle}
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-10 items-start">
            <ul className="space-y-4 list-none p-0 m-0">
              {cartItems.map((item) => (
                <CartLineItem
                  key={item._id ?? resolveCartLine(item).id}
                  item={item}
                />
              ))}
            </ul>

            <aside
              className={`${cardClass} p-6 sm:p-7 lg:sticky lg:top-6`}
              style={cardStyle}
            >
              <h2
                className="text-xs font-semibold tracking-widest uppercase mb-5"
                style={mutedTextStyle}
              >
                Order summary
              </h2>

              <dl className="space-y-3 text-sm mb-6">
                <div className="flex justify-between gap-4">
                  <dt style={mutedTextStyle}>Subtotal</dt>
                  <dd className="font-medium text-zinc-900 tabular-nums">
                    {formatPrice(displayTotal, displayCurrency)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt style={mutedTextStyle}>Items</dt>
                  <dd className="text-zinc-900">{count}</dd>
                </div>
                <div className="flex justify-between gap-4 pt-3 border-t border-zinc-300">
                  <dt className="font-semibold text-zinc-900">
                    Estimated total
                  </dt>
                  <dd className="text-xl font-semibold text-amber-700 tabular-nums">
                    {formatPrice(displayTotal, displayCurrency)}
                  </dd>
                </div>
              </dl>

              <p
                className="text-xs mb-5 leading-relaxed"
                style={mutedTextStyle}
              >
                Prices use each variant&apos;s current price. Shipping and taxes
                calculated at checkout.
              </p>

              <button
                type="button"
                className={`w-full mb-3 ${primaryBtnClass}`}
                style={primaryBtnStyle}
              >
                Proceed to checkout
              </button>
              <Link
                to="/"
                className={`block w-full text-center ${outlineBtnClass}`}
              >
                Add more items
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
