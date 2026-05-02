import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";

function firstImageUrl(product) {
  const first = product?.images?.[0];
  if (!first) return null;
  if (typeof first === "string") return first;
  if (typeof first?.url === "string") return first.url;
  if (typeof first?.filePath === "string") return first.filePath;
  return null;
}

function formatPrice(amount, currency) {
  const n = Number(amount);
  if (!Number.isFinite(n) || !currency) return String(amount ?? "—");
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `${n} ${currency}`;
  }
}

function loadErrorMessage(err) {
  const data = err?.response?.data;
  if (typeof data?.message === "string") return data.message;
  if (err?.response?.status === 401) return "Sign in as a seller to view your products.";
  if (err?.response?.status === 403) {
    return "Seller account required. Register or log in with a seller profile.";
  }
  return "Could not load products. Try again.";
}

const Dashboard = () => {
  const { handleGetProductsForSeller } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setError("");
      setLoading(true);
      try {
        await handleGetProductsForSeller();
      } catch (err) {
        if (!cancelled) setError(loadErrorMessage(err));
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

      <div className="w-full max-w-[min(100%,1200px)]">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div>
            <p
              className="text-[10px] font-semibold tracking-[0.25em] uppercase mb-2"
              style={{ color: "#F59E0B" }}
            >
              Seller
            </p>
            <h1
              className="text-3xl sm:text-4xl font-bold tracking-tight"
              style={{
                fontFamily: "'Manrope', sans-serif",
                color: "#E5E1E4",
                letterSpacing: "-0.02em",
              }}
            >
              Your products
            </h1>
            <p className="text-sm sm:text-base mt-3 max-w-xl" style={{ color: "#D8C3AD" }}>
              {loading
                ? "Loading your listings…"
                : `${sellerProducts.length} listing${sellerProducts.length === 1 ? "" : "s"}`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/seller/create-product"
              className="inline-flex items-center justify-center rounded-none px-6 py-3.5 text-sm font-semibold tracking-wide transition focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/40 focus:ring-offset-2 focus:ring-offset-[#131315]"
              style={{
                background: "linear-gradient(135deg, #FFC174 0%, #F59E0B 100%)",
                color: "#2a1700",
                boxShadow: "0 4px 24px rgba(245,158,11,0.18)",
              }}
            >
              New product
            </Link>
            <Link
              to="/"
              className="text-sm font-semibold text-[#F59E0B] transition hover:text-[#FFC174]"
            >
              Home
            </Link>
          </div>
        </header>

        {error ? (
          <div
            className="rounded-none px-5 py-4 text-sm mb-6"
            style={{
              backgroundColor: "rgba(147,0,10,0.25)",
              border: "1px solid rgba(255,180,171,0.15)",
              color: "#FFAAA5",
            }}
            role="alert"
          >
            {error}
          </div>
        ) : null}

        {loading ? (
          <div
            className="rounded-none border border-[#534434]/40 p-12 sm:p-16 text-center text-sm"
            style={{ backgroundColor: "#1C1B1D", color: "#D8C3AD" }}
          >
            Loading…
          </div>
        ) : !sellerProducts.length ? (
          <div
            className="rounded-none border border-[#534434]/40 p-10 sm:p-14 text-center space-y-6"
            style={{ backgroundColor: "#1C1B1D" }}
          >
            <p className="text-lg font-medium" style={{ color: "#E5E1E4" }}>
              No products yet
            </p>
            <p className="text-sm max-w-md mx-auto" style={{ color: "#D8C3AD" }}>
              Create your first listing to show it here.
            </p>
            <Link
              to="/seller/create-product"
              className="inline-flex items-center justify-center rounded-none px-6 py-3.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/40"
              style={{
                background: "linear-gradient(135deg, #FFC174 0%, #F59E0B 100%)",
                color: "#2a1700",
              }}
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
                <li key={id ?? product.title}>
                  <article
                    className="h-full flex flex-col rounded-none overflow-hidden border transition hover:border-[#F59E0B]/35"
                    style={{
                      backgroundColor: "#1C1B1D",
                      borderColor: "rgba(83, 68, 52, 0.45)",
                    }}
                  >
                    <div className="aspect-4/3 bg-[#131315] relative">
                      {img ? (
                        <img
                          src={img}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="absolute inset-0 flex items-center justify-center text-xs"
                          style={{ color: "#534434" }}
                        >
                          No image
                        </div>
                      )}
                    </div>
                    <div className="p-5 sm:p-6 flex flex-col flex-1 gap-3 min-w-0">
                      <h2
                        className="text-base font-semibold leading-snug line-clamp-2"
                        style={{
                          fontFamily: "'Manrope', sans-serif",
                          color: "#E5E1E4",
                        }}
                      >
                        {product.title}
                      </h2>
                      <p className="text-lg font-semibold" style={{ color: "#F59E0B" }}>
                        {formatPrice(product.price?.amount, product.price?.currency)}
                      </p>
                      <p
                        className="text-sm leading-relaxed line-clamp-3 flex-1"
                        style={{ color: "#D8C3AD" }}
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
