import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { useProduct } from "../hooks/useProduct";
import {
  formatPrice,
  imageUrl,
  loadProductDetailsError,
  normalizeVariantAttributes,
  sellerLabel,
  variantOptionGroups,
} from "../utils/product.utils";
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
import useCart from "../../cart/hook/useCart";

function ProductImageGallery({ imageList }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const mainImage = imageList[activeImageIndex] ?? imageList[0] ?? null;

  return (
    <div className="space-y-4 min-w-0">
      <div
        className={`aspect-4/3 w-full border border-zinc-300 relative overflow-hidden rounded-none`}
        style={{ backgroundColor: colors.image }}
      >
        {mainImage ? (
          <img
            src={mainImage}
            alt=""
            className="absolute inset-0 w-full h-full object-contain bg-white"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-400">
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
  const { handleAddItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAttributes, setSelectedAttributes] = useState({});

  const variants = useMemo(() => {
    if (!Array.isArray(product?.variants)) return [];
    return product.variants;
  }, [product]);

  const optionGroups = useMemo(() => variantOptionGroups(variants), [variants]);

  const doesSelectionMatch = useMemo(() => {
    return (variant, selection) => {
      const attrs = normalizeVariantAttributes(variant?.attributes);
      return optionGroups.every((group) => {
        const selectedValue = selection[group.name];
        if (!selectedValue) return true;
        return (
          String(attrs[group.name] ?? "").trim() ===
          String(selectedValue).trim()
        );
      });
    };
  }, [optionGroups]);

  const selectedVariant = useMemo(() => {
    if (!variants.length) return null;
    if (!optionGroups.length) {
      return variants[0] ?? null;
    }
    return (
      variants.find((variant) =>
        doesSelectionMatch(variant, selectedAttributes),
      ) ?? null
    );
  }, [variants, optionGroups, selectedAttributes, doesSelectionMatch]);

  const imageList = useMemo(() => {
    const raw = selectedVariant?.images?.length
      ? selectedVariant.images
      : product?.images;
    if (!Array.isArray(raw)) return [];
    return raw.map(imageUrl).filter(Boolean);
  }, [product, selectedVariant]);

  const displayPrice = selectedVariant?.price ?? product?.price;

  const selectedVariantStock = selectedVariant?.stock;

  const hasVariantOptions = optionGroups.length > 0;
  /** Cart API expects a real variant subdocument id; base product-only line items are not allowed when SKUs exist. */
  const productHasVariants = variants.length > 0;
  const variantIdForCart = selectedVariant?._id ?? selectedVariant?.id;
  const canAddVariantToCart =
    productHasVariants && variantIdForCart != null && variantIdForCart !== "";
  const productId = product?._id ?? product?.id ?? id;

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
          setError(loadProductDetailsError(err));
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

  useEffect(() => {
    if (!hasVariantOptions) {
      setSelectedAttributes({});
      return;
    }

    const seed = {};
    for (const group of optionGroups) {
      seed[group.name] = group.values[0] ?? "";
    }
    setSelectedAttributes(seed);
  }, [id, hasVariantOptions, optionGroups]);

  /** True if at least one variant offers this value for this attribute (always clickable). */
  const variantOffersOption = (groupName, optionValue) => {
    const want = String(optionValue).trim();
    return variants.some((variant) => {
      const attrs = normalizeVariantAttributes(variant?.attributes);
      return String(attrs[groupName] ?? "").trim() === want;
    });
  };

  /**
   * Pick a full SKU after the user changes one attribute: keep their choice, then
   * choose the best-matching variant so other dimensions update (e.g. Medium + White
   * → Medium + Red) instead of disabling Medium or snapping back to Large.
   */
  const handleSelectOption = (groupName, optionValue) => {
    setSelectedAttributes((prev) => {
      const next = { ...prev, [groupName]: optionValue };
      const want = String(optionValue).trim();

      const candidates = variants.filter((variant) => {
        const attrs = normalizeVariantAttributes(variant?.attributes);
        return String(attrs[groupName] ?? "").trim() === want;
      });

      if (!candidates.length) {
        return next;
      }

      let best = candidates[0];
      let bestScore = -1;
      for (const variant of candidates) {
        const attrs = normalizeVariantAttributes(variant.attributes);
        let score = 0;
        for (const group of optionGroups) {
          if (group.name === groupName) continue;
          const selected = next[group.name];
          if (!selected) continue;
          if (
            String(attrs[group.name] ?? "").trim() === String(selected).trim()
          ) {
            score++;
          }
        }
        if (score > bestScore) {
          bestScore = score;
          best = variant;
        }
      }

      const attrs = normalizeVariantAttributes(best.attributes);
      const resolved = {};
      for (const group of optionGroups) {
        const v = attrs[group.name];
        resolved[group.name] =
          v != null && String(v).trim() ? String(v).trim() : "";
      }
      resolved[groupName] = want;
      return resolved;
    });
  };

  if (!id) {
    return (
      <div
        className="min-h-screen w-full flex justify-center px-4 sm:px-8 lg:px-12 pt-4 pb-10"
        style={pageStyle}
      >
        <div className="w-full max-w-[min(100%,1100px)]">
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
              key={String(
                selectedVariant?._id ?? selectedVariant?.id ?? productId,
              )}
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
                  {formatPrice(displayPrice?.amount, displayPrice?.currency)}
                </p>
                <p className="text-xs mt-2 text-zinc-500">
                  {displayPrice?.currency} · price shown in whole units
                </p>
              </div>

              {hasVariantOptions ? (
                <section className="space-y-4">
                  <h2
                    className="text-xs font-semibold tracking-widest uppercase"
                    style={mutedTextStyle}
                  >
                    Options
                  </h2>
                  <div className="space-y-4">
                    {optionGroups.map((group) => (
                      <div key={group.name}>
                        <p className="text-sm font-medium text-zinc-900 mb-2">
                          {group.name}:{" "}
                          <span className="text-zinc-600">
                            {selectedAttributes[group.name] || "Select"}
                          </span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {group.values.map((value) => {
                            const selected =
                              selectedAttributes[group.name] === value;
                            const offered = variantOffersOption(
                              group.name,
                              value,
                            );
                            return (
                              <button
                                key={`${group.name}-${value}`}
                                type="button"
                                onClick={() =>
                                  handleSelectOption(group.name, value)
                                }
                                disabled={!offered}
                                className={`px-3 py-1.5 text-sm border rounded-none transition ${
                                  selected
                                    ? "border-amber-600 bg-amber-50 text-amber-800"
                                    : "border-zinc-300 bg-white text-zinc-800 hover:border-zinc-400"
                                } ${!offered ? "opacity-40 cursor-not-allowed" : ""}`}
                              >
                                {value}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm" style={mutedTextStyle}>
                    {selectedVariant
                      ? `Stock: ${selectedVariantStock ?? 0}`
                      : "This option combination is unavailable."}
                  </p>
                </section>
              ) : null}

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
                    Product name
                  </dt>
                  <dd className="text-sm text-zinc-900">
                    {product.title?.trim() ? product.title : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                    Seller
                  </dt>
                  <dd className="text-sm text-zinc-900">
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
                  disabled={productHasVariants && !canAddVariantToCart}
                  className={`flex-1 px-6 ${primaryBtnClass} ${
                    productHasVariants && !canAddVariantToCart
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  style={primaryBtnStyle}
                  onClick={() => {
                    if (productHasVariants && !canAddVariantToCart) return;
                    const vid = variantIdForCart;
                    if (!vid) return;
                    handleAddItem(productId, vid, 1);
                  }}
                >
                  Add to cart
                </button>
                <button
                  type="button"
                  disabled={productHasVariants && !canAddVariantToCart}
                  className={`flex-1 px-6 ${outlineBtnClass} ${
                    productHasVariants && !canAddVariantToCart
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => {
                    if (productHasVariants && !canAddVariantToCart) return;
                    const vid = variantIdForCart;
                    if (!vid) return;
                    handleAddItem(productId, vid, 1);
                  }}
                >
                  Buy now
                </button>
              </div>
              {productHasVariants && !canAddVariantToCart ? (
                <p className="text-sm" style={mutedTextStyle}>
                  Select a variant (options above) to add this product to your
                  cart. The base listing alone cannot be purchased when variants
                  exist.
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProductDetail;
