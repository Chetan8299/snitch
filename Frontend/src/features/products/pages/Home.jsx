import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";
import { formatPrice, firstImageUrl, loadProductListError } from "../utils/product.utils";
import {
  cardClass,
  cardStyle,
  colors,
  errorStyle,
  headingClass,
  headingStyle,
  mutedTextStyle,
  overlineStyle,
  pageStyle,
  primaryBtnClass,
  primaryBtnStyle,
  productCardStyle,
} from "../../../app/uiTheme";

const Home = () => {
  const { handleGetAllProducts } = useProduct();
  const products = useSelector((state) => state.product.products);
  const user = useSelector((state) => state.auth.user);
  const isSeller = user?.role === "seller";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setError("");
      setLoading(true);
      try {
        await handleGetAllProducts();
      } catch (err) {
        if (!cancelled) setError(loadProductListError(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [handleGetAllProducts]);

  return (
    <div
      className="min-h-screen w-full flex justify-center px-4 sm:px-8 lg:px-12 pt-4 pb-10 sm:pt-6 sm:pb-12"
      style={pageStyle}
    >
      <div className="w-full max-w-[min(100%,1200px)]">
        <header className="mb-6 sm:mb-8 border-b border-zinc-300 pb-6">
          <div>
            <p
              className="text-[10px] font-semibold tracking-[0.25em] uppercase mb-2"
              style={overlineStyle}
            >
              Catalog
            </p>
            <h1
              className={`text-3xl sm:text-4xl font-bold ${headingClass}`}
              style={headingStyle}
            >
              Browse products
            </h1>
            <p
              className="text-sm sm:text-base mt-2 max-w-xl"
              style={mutedTextStyle}
            >
              {loading
                ? "Loading catalog…"
                : `${products.length} item${products.length === 1 ? "" : "s"}`}
            </p>
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
        ) : !products.length ? (
          <div
            className={`${cardClass} p-10 sm:p-14 text-center space-y-4`}
            style={cardStyle}
          >
            <p className="text-lg font-medium" style={{ color: colors.text }}>
              No products yet
            </p>
            <p
              className="text-sm max-w-md mx-auto"
              style={mutedTextStyle}
            >
              Check back soon, or sign in as a seller to list something.
            </p>
            {isSeller ? (
              <Link
                to="/seller/create-product"
                className={`inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold ${primaryBtnClass}`}
                style={primaryBtnStyle}
              >
                Create a product
              </Link>
            ) : null}
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 list-none p-0 m-0">
            {products.map((product) => {
              const img = firstImageUrl(product);
              const id = product._id ?? product.id;
              return (
                <li key={id ?? product.title}>
                  <Link to={`/product/${id}`}>
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
                      <div className="p-4 sm:p-5 flex flex-col flex-1 gap-2 min-w-0">
                        <h2
                          className={`text-base font-semibold leading-snug line-clamp-2 ${headingClass}`}
                          style={headingStyle}
                        >
                          {product.title}
                        </h2>
                        <p className="text-lg font-semibold text-amber-700">
                          {formatPrice(
                            product.price?.amount,
                            product.price?.currency,
                          )}
                        </p>
                        <p
                          className="text-sm leading-relaxed line-clamp-3 flex-1"
                          style={mutedTextStyle}
                        >
                          {product.description}
                        </p>
                      </div>
                    </article>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
