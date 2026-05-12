import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { useProduct } from "../hooks/useProduct";
import {
  cardClass,
  cardStyle,
  colors,
  errorStyle,
  headingClass,
  headingStyle,
  linkClass,
  mutedTextStyle,
  outlineBtnClass,
  overlineStyle,
  pageStyle,
  primaryBtnClass,
  primaryBtnStyle,
} from "../../../app/uiTheme";

function imageUrl(entry) {
  if (!entry) return null;
  if (typeof entry === "string") return entry;
  if (typeof entry?.url === "string") return entry.url;
  if (typeof entry?.filePath === "string") return entry.filePath;
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

function sellerLabel(seller) {
  if (seller == null) return "—";
  if (typeof seller === "string") return seller;
  if (typeof seller === "object" && seller._id) return String(seller._id);
  return String(seller);
}

function loadErrorMessage(err) {
  if (err?.response?.status === 404) return "This product could not be found.";
  const data = err?.response?.data;
  if (typeof data?.message === "string") return data.message;
  return "Could not load product details.";
}

function ProductImageGallery({ imageList }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const mainImage = imageList[activeImageIndex] ?? imageList[0] ?? null;

  return (
    <div className="space-y-4 min-w-0">
      <div className={`aspect-4/3 w-full border border-zinc-300 relative overflow-hidden rounded-none`} style={{ backgroundColor: colors.image }}>
        {mainImage ? (
          <img
            src={mainImage}
            alt=""
            className="absolute inset-0 w-full h-full object-contain bg-white"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-sm text-zinc-400"
          >
            No images
          </div>
        )}
      </div>
      {imageList.length > 1 ? (
        <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
          {imageList.map((src, i) => (
            <li key={`${src}-${i}`}>
              <button
                type="button"
                onClick={() => setActiveImageIndex(i)}
                className={`block w-16 h-16 sm:w-20 sm:h-20 border overflow-hidden rounded-none p-0 cursor-pointer transition ${
                  i === activeImageIndex
                    ? "border-amber-600 ring-1 ring-amber-600/50"
                    : "border-zinc-300 opacity-80 hover:opacity-100"
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

const ProductDetail = () => {
  const { id } = useParams();
  const { handleGetProductDetails } = useProduct();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const imageList = useMemo(() => {
    const raw = product?.images;
    if (!Array.isArray(raw)) return [];
    return raw.map(imageUrl).filter(Boolean);
  }, [product]);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    (async () => {
      setError("");
      setLoading(true);
      setProduct(null);
      try {
        const data = await handleGetProductDetails(id);
        if (!cancelled) setProduct(data ?? null);
      } catch (err) {
        if (!cancelled) {
          setError(loadErrorMessage(err));
          setProduct(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, handleGetProductDetails]);

  const productId = product?._id ?? product?.id ?? id;

  if (!id) {
    return (
      <div
        className="min-h-screen w-full flex justify-center px-4 sm:px-8 lg:px-12 pt-4 pb-10"
        style={pageStyle}
      >
        <div className="w-full max-w-[min(100%,1100px)]">
          <nav className="mb-6">
            <Link
              to="/"
              className={`text-sm ${linkClass}`}
            >
              ← Back to browse
            </Link>
          </nav>
          <p className="text-sm" style={{ color: errorStyle.color }}>
            Missing product id in the URL.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full flex justify-center px-4 sm:px-8 lg:px-12 pt-4 pb-10 sm:pt-6 sm:pb-12"
      style={pageStyle}
    >
      <div className="w-full max-w-[min(100%,1100px)]">
        <nav className="mb-6">
          <Link
            to="/"
            className={`text-sm ${linkClass}`}
          >
            ← Back to browse
          </Link>
        </nav>

        {loading ? (
          <div
            className={`${cardClass} p-12 text-center text-sm`}
            style={{ ...cardStyle, color: colors.muted }}
          >
            Loading…
          </div>
        ) : error ? (
          <div
            className={`${cardClass} px-5 py-4 text-sm`}
            style={errorStyle}
            role="alert"
          >
            {error}
          </div>
        ) : product ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:items-start">
            <ProductImageGallery
              key={String(productId)}
              imageList={imageList}
            />

            <div className="min-w-0 space-y-6">
              <div>
                <p
                  className="text-[10px] font-semibold tracking-[0.25em] uppercase mb-2"
                  style={overlineStyle}
                >
                  Product
                </p>
                <h1
                  className={`text-3xl sm:text-4xl font-bold ${headingClass}`}
                  style={headingStyle}
                >
                  {product.title}
                </h1>
                <p className="text-3xl sm:text-4xl font-semibold mt-4 text-amber-700">
                  {formatPrice(product.price?.amount, product.price?.currency)}
                </p>
                <p className="text-xs mt-2 text-zinc-500">
                  {product.price?.currency} · price shown in whole units
                </p>
              </div>

              <section>
                <h2
                  className="text-xs font-semibold tracking-widest uppercase mb-3"
                  style={mutedTextStyle}
                >
                  Description
                </h2>
                <p
                  className="text-base leading-relaxed whitespace-pre-wrap"
                  style={mutedTextStyle}
                >
                  {product.description}
                </p>
              </section>

              <dl
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm border-t border-b border-zinc-300 py-5"
                style={mutedTextStyle}
              >
                <div>
                  <dt className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                    Product ID
                  </dt>
                  <dd className="font-mono text-xs break-all text-zinc-900">
                    {String(productId)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                    Seller
                  </dt>
                  <dd className="font-mono text-xs break-all text-zinc-900">
                    {sellerLabel(product.seller)}
                  </dd>
                </div>
                {product.__v != null ? (
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                      Version
                    </dt>
                    <dd className="text-zinc-900">{product.__v}</dd>
                  </div>
                ) : null}
              </dl>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                <button
                  type="button"
                  className={`flex-1 px-6 ${primaryBtnClass}`}
                  style={primaryBtnStyle}
                >
                  Add to cart
                </button>
                <button
                  type="button"
                  className={`flex-1 px-6 ${outlineBtnClass}`}
                >
                  Buy now
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProductDetail;
