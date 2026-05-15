import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";
import { formatPrice, firstImageUrl, loadSellerProductsError } from "../utils/product.utils";
import {
  cardClass,
  cardStyle,
  colors,
  errorStyle,
  headingClass,
  headingStyle,
  linkClass,
  mutedTextStyle,
  overlineStyle,
  pageStyle,
  primaryBtnClass,
  primaryBtnStyle,
  productCardStyle,
} from "../../../app/uiTheme";

const Dashboard = () => {
  const { handleGetProductsForSeller } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setError("");
      setLoading(true);
      try {
        await handleGetProductsForSeller();
      } catch (err) {
        if (!cancelled) setError(loadSellerProductsError(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [handleGetProductsForSeller]);

  return (
    <div
      className="min-h-screen w-full flex justify-center px-4 sm:px-8 lg:px-12 pt-4 pb-10 sm:pt-6 sm:pb-12"
      style={pageStyle}
    >
      <div className="w-full max-w-[min(100%,1200px)]">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div>
            <p
              className="text-[10px] font-semibold tracking-[0.25em] uppercase mb-2"
              style={overlineStyle}
            >
              Seller
            </p>
            <h1
              className={`text-3xl sm:text-4xl font-bold ${headingClass}`}
              style={headingStyle}
            >
              Your products
            </h1>
            <p className="text-sm sm:text-base mt-3 max-w-xl" style={mutedTextStyle}>
              {loading
                ? "Loading your listings…"
                : `${sellerProducts.length} listing${sellerProducts.length === 1 ? "" : "s"}`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/seller/create-product"
              className={`inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold tracking-wide ${primaryBtnClass}`}
              style={primaryBtnStyle}
            >
              New product
            </Link>
            <Link
              to="/"
              className={linkClass}
            >
              Home
            </Link>
          </div>
        </header>

        {error ? (
          <div
            className={`${cardClass} px-5 py-4 text-sm mb-6`}
            style={errorStyle}
            role="alert"
          >
            {error}
          </div>
        ) : null}

        {loading ? (
          <div
            className={`${cardClass} p-12 sm:p-16 text-center text-sm`}
            style={{ ...cardStyle, color: colors.muted }}
          >
            Loading…
          </div>
        ) : !sellerProducts.length ? (
          <div
            className={`${cardClass} p-10 sm:p-14 text-center space-y-6`}
            style={cardStyle}
          >
            <p className="text-lg font-medium" style={{ color: colors.text }}>
              No products yet
            </p>
            <p className="text-sm max-w-md mx-auto" style={mutedTextStyle}>
              Create your first listing to show it here.
            </p>
            <Link
              to="/seller/create-product"
              className={`inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold ${primaryBtnClass}`}
              style={primaryBtnStyle}
            >
              Create product
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 list-none p-0 m-0">
            {sellerProducts.map((product) => {
              const img = firstImageUrl(product);
              const id = product._id ?? product.id;
              return (
                <li onClick={() => navigate(`/seller/product/${id}`) } key={id ?? product.title}>
                  <article
                    className="h-full flex flex-col rounded-none overflow-hidden border border-zinc-300 transition hover:border-amber-600/50"
                    style={productCardStyle}
                  >
                    <div className="aspect-4/3 relative" style={{ backgroundColor: colors.image }}>
                      {img ? (
                        <img
                          src={img}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="absolute inset-0 flex items-center justify-center text-xs text-zinc-400"
                        >
                          No image
                        </div>
                      )}
                    </div>
                    <div className="p-5 sm:p-6 flex flex-col flex-1 gap-3 min-w-0">
                      <h2
                        className={`text-base font-semibold leading-snug line-clamp-2 ${headingClass}`}
                        style={headingStyle}
                      >
                        {product.title}
                      </h2>
                      <p className="text-lg font-semibold text-amber-700">
                        {formatPrice(product.price?.amount, product.price?.currency)}
                      </p>
                      <p
                        className="text-sm leading-relaxed line-clamp-3 flex-1"
                        style={mutedTextStyle}
                      >
                        {product.description}
                      </p>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
