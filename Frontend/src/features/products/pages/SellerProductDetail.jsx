import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { useProduct } from "../hooks/useProduct";
import {
  CURRENCIES,
  DEFAULT_CURRENCY,
  MAX_VARIANT_IMAGES_PER_VARIANT,
} from "../constants/product.constants";
import {
  attributesFromRows,
  createEmptyAttributeRow,
  createEmptyVariant,
  fileFingerprint,
  formatAttributes,
  formatPrice,
  formatVariantSubmitError,
  imageUrl,
  loadProductDetailsError,
} from "../utils/product.utils";
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
  outlineBtnClass,
  overlineStyle,
  pageStyle,
  primaryBtnClass,
  primaryBtnStyle,
  successStyle,
} from "../../../app/uiTheme";

const Field = ({ id, label, optional, children }) => (
  <div>
    <label htmlFor={id} className={labelBase}>
      {label}{" "}
      {optional ? (
        <span className="text-zinc-500 normal-case tracking-normal">(optional)</span>
      ) : (
        <span className="text-amber-700">*</span>
      )}
    </label>
    {children}
  </div>
);

function ProductImageGallery({ imageList }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const mainImage = imageList[activeImageIndex] ?? imageList[0] ?? null;

  return (
    <div className="space-y-4 min-w-0">
      <div
        className="aspect-4/3 w-full border border-zinc-300 relative overflow-hidden rounded-none"
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

function VariantImagePreviewGrid({ urls, files, onRemove }) {
  if (!urls.length) return null;

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
      {urls.map((url, i) => (
        <li
          key={files[i] ? `${fileFingerprint(files[i])}-${i}` : `preview-${i}`}
          className="relative aspect-square rounded-none overflow-hidden border border-zinc-300 bg-zinc-100"
        >
          <img src={url} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-none border border-zinc-300 bg-white/90 text-zinc-800 text-lg leading-none hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition"
            aria-label={`Remove image ${i + 1}`}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}

function AddVariantForm({ defaultCurrency, submitting, error, success, onSubmit, onCancel }) {
  const [variant, setVariant] = useState(() => createEmptyVariant(defaultCurrency));

  const previewUrls = useMemo(
    () => variant.imageFiles.map((file) => URL.createObjectURL(file)),
    [variant.imageFiles]
  );

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const updateVariant = (patch) => {
    setVariant((prev) => ({ ...prev, ...patch }));
  };

  const updateAttributeRow = (rowLocalId, patch) => {
    updateVariant({
      attributeRows: variant.attributeRows.map((row) =>
        row.localId === rowLocalId ? { ...row, ...patch } : row
      ),
    });
  };

  const addAttributeRow = () => {
    updateVariant({
      attributeRows: [...variant.attributeRows, createEmptyAttributeRow()],
    });
  };

  const removeAttributeRow = (rowLocalId) => {
    const nextRows = variant.attributeRows.filter((row) => row.localId !== rowLocalId);
    updateVariant({
      attributeRows: nextRows.length ? nextRows : [createEmptyAttributeRow()],
    });
  };

  const onImagesChange = (e) => {
    const input = e.target;
    const picked = Array.from(input.files ?? []);
    input.value = "";

    const merged = [...variant.imageFiles];
    const seen = new Set(merged.map(fileFingerprint));
    for (const file of picked) {
      if (merged.length >= MAX_VARIANT_IMAGES_PER_VARIANT) break;
      const fp = fileFingerprint(file);
      if (seen.has(fp)) continue;
      seen.add(fp);
      merged.push(file);
    }

    updateVariant({ imageFiles: merged });
  };

  const removeImageAt = (index) => {
    updateVariant({
      imageFiles: variant.imageFiles.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(variant, () => setVariant(createEmptyVariant(defaultCurrency)));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-none border border-zinc-300 p-5 sm:p-6 space-y-6"
      style={innerStyle}
      noValidate
    >
      <div>
        <h3 className="text-sm font-semibold text-zinc-900">New variant</h3>
        <p className="text-sm mt-1" style={mutedTextStyle}>
          Price is required. Leave images empty to use the product gallery.
        </p>
      </div>

      <div className="space-y-3">
        <p className={labelBase}>Attributes</p>
        <div className="space-y-3">
          {variant.attributeRows.map((row) => (
            <div
              key={row.localId}
              className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3"
            >
              <input
                type="text"
                value={row.key}
                onChange={(e) => updateAttributeRow(row.localId, { key: e.target.value })}
                placeholder="e.g. Size"
                className={inputBase}
              />
              <input
                type="text"
                value={row.value}
                onChange={(e) => updateAttributeRow(row.localId, { value: e.target.value })}
                placeholder="e.g. Medium"
                className={inputBase}
              />
              <button
                type="button"
                onClick={() => removeAttributeRow(row.localId)}
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 px-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addAttributeRow}
          className={`text-sm px-4 py-2.5 ${outlineBtnClass}`}
        >
          Add attribute
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field id={`new-variant-${variant.localId}-stock`} label="Stock" optional>
          <input
            id={`new-variant-${variant.localId}-stock`}
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            value={variant.stock}
            onChange={(e) => updateVariant({ stock: e.target.value })}
            placeholder="0"
            className={inputBase}
          />
        </Field>
        <Field id={`new-variant-${variant.localId}-price`} label="Price">
          <input
            id={`new-variant-${variant.localId}-price`}
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            required
            value={variant.priceAmount}
            onChange={(e) => updateVariant({ priceAmount: e.target.value })}
            placeholder="0"
            className={inputBase}
          />
        </Field>
        <Field id={`new-variant-${variant.localId}-currency`} label="Currency">
          <select
            id={`new-variant-${variant.localId}-currency`}
            value={variant.priceCurrency}
            onChange={(e) => updateVariant({ priceCurrency: e.target.value })}
            className={`${inputBase} appearance-none cursor-pointer`}
          >
            {CURRENCIES.map((currency) => (
              <option key={currency} value={currency} className="bg-white">
                {currency}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field id={`new-variant-${variant.localId}-images`} label="Variant images" optional>
        <div className="rounded-none border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-6 text-center transition hover:border-amber-600/40">
          <input
            id={`new-variant-${variant.localId}-images`}
            type="file"
            accept="image/*"
            multiple
            onChange={onImagesChange}
            className="block w-full text-sm text-zinc-600 file:mx-auto file:mr-0 file:mb-3 file:block file:rounded-none file:border file:border-zinc-300 file:bg-white file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-zinc-800 file:cursor-pointer cursor-pointer"
          />
          <p className="text-xs leading-relaxed mt-2" style={mutedTextStyle}>
            Up to {MAX_VARIANT_IMAGES_PER_VARIANT} images · leave empty to use product images
          </p>
        </div>
      </Field>

      <VariantImagePreviewGrid
        urls={previewUrls}
        files={variant.imageFiles}
        onRemove={removeImageAt}
      />

      {error ? (
        <p className="rounded-none px-4 py-3 text-sm" style={errorStyle} role="alert">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="rounded-none px-4 py-3 text-sm" style={successStyle} role="status">
          {success}
        </p>
      ) : null}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={submitting}
          className={`sm:min-w-[180px] px-6 ${primaryBtnClass}`}
          style={primaryBtnStyle}
        >
          {submitting ? "Adding…" : "Add variant"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className={`px-6 ${outlineBtnClass}`}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function VariantList({ variants, productImages }) {
  if (!variants.length) {
    return (
      <p className="text-sm rounded-none border border-dashed border-zinc-300 px-4 py-5" style={mutedTextStyle}>
        No variants yet. Add one to offer size, color, or other options.
      </p>
    );
  }

  return (
    <ul className="space-y-4 list-none p-0 m-0">
      {variants.map((variant, index) => {
        const variantImages = Array.isArray(variant.images) ? variant.images : [];
        const imageList = variantImages.map(imageUrl).filter(Boolean);
        const displayImages = imageList.length ? imageList : productImages;
        const preview = displayImages[0] ?? null;

        return (
          <li
            key={variant._id ?? variant.id ?? `variant-${index}`}
            className="rounded-none border border-zinc-300 p-4 sm:p-5"
            style={innerStyle}
          >
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="w-full sm:w-28 h-28 border border-zinc-300 shrink-0 overflow-hidden bg-white">
                {preview ? (
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400">
                    No image
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <p className="text-sm font-semibold text-zinc-900">Variant {index + 1}</p>
                <p className="text-lg font-semibold text-amber-700">
                  {formatPrice(variant.price?.amount, variant.price?.currency)}
                </p>
                <p className="text-sm" style={mutedTextStyle}>
                  Stock: {variant.stock ?? 0}
                </p>
                <p className="text-sm" style={mutedTextStyle}>
                  {formatAttributes(variant.attributes)}
                </p>
                {displayImages.length > 1 ? (
                  <p className="text-xs text-zinc-500">{displayImages.length} images</p>
                ) : null}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

const SellerProductDetail = () => {
  const { productId } = useParams();
  const { handleGetProductDetails, handleCreateProductVariant } = useProduct();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [variantSubmitting, setVariantSubmitting] = useState(false);
  const [variantError, setVariantError] = useState("");
  const [variantSuccess, setVariantSuccess] = useState("");

  const refreshProduct = useCallback(async () => {
    if (!productId) return null;

    try {
      const data = await handleGetProductDetails(productId);
      setProduct(data ?? null);
      return data ?? null;
    } catch (err) {
      setError(loadProductDetailsError(err));
      setProduct(null);
      return null;
    }
  }, [productId, handleGetProductDetails]);

  useEffect(() => {
    if (!productId) return undefined;

    let cancelled = false;

    (async () => {
      setError("");
      setLoading(true);
      setProduct(null);

      try {
        const data = await handleGetProductDetails(productId);
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
  }, [productId, handleGetProductDetails]);

  const imageList = useMemo(() => {
    const raw = product?.images;
    if (!Array.isArray(raw)) return [];
    return raw.map(imageUrl).filter(Boolean);
  }, [product]);

  const variants = useMemo(() => {
    if (!Array.isArray(product?.variants)) return [];
    return product.variants;
  }, [product]);

  const defaultCurrency = product?.price?.currency ?? DEFAULT_CURRENCY;

  const handleAddVariant = async (variant, resetForm) => {
    if (!productId) return;

    const priceText = String(variant.priceAmount).trim();
    if (!priceText) {
      setVariantError("Variant price is required.");
      return;
    }
    if (Number.isNaN(Number(priceText))) {
      setVariantError("Variant price must be a number.");
      return;
    }
    if (variant.stock !== "" && Number.isNaN(Number(variant.stock))) {
      setVariantError("Variant stock must be a number.");
      return;
    }

    const formData = new FormData();
    formData.append(
      "variant",
      JSON.stringify({
        stock: variant.stock === "" ? 0 : Number(variant.stock),
        priceAmount: priceText,
        priceCurrency: variant.priceCurrency || defaultCurrency,
        attributes: attributesFromRows(variant.attributeRows),
        imageCount: variant.imageFiles.length,
      })
    );
    variant.imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    setVariantSubmitting(true);
    setVariantError("");
    setVariantSuccess("");

    try {
      await handleCreateProductVariant(productId, formData);
      setVariantSuccess("Variant added.");
      resetForm();
      setShowVariantForm(false);
      await refreshProduct();
    } catch (err) {
      setVariantError(formatVariantSubmitError(err));
    } finally {
      setVariantSubmitting(false);
    }
  };

  if (!productId) {
    return (
      <div
        className="min-h-screen w-full flex justify-center px-4 sm:px-8 lg:px-12 pt-4 pb-10"
        style={pageStyle}
      >
        <div className="w-full max-w-[min(100%,1100px)]">
          <nav className="mb-6">
            <Link to="/seller/dashboard" className={`text-sm ${linkClass}`}>
              ← Back to dashboard
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
        <nav className="mb-6 flex flex-wrap items-center gap-4">
          <Link to="/seller/dashboard" className={`text-sm ${linkClass}`}>
            ← Back to dashboard
          </Link>
          <Link to={`/product/${productId}`} className={`text-sm ${linkClass}`}>
            View public page
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
          <div className={`${cardClass} px-5 py-4 text-sm`} style={errorStyle} role="alert">
            {error}
          </div>
        ) : product ? (
          <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:items-start">
              <ProductImageGallery imageList={imageList} />

              <div className="min-w-0 space-y-6">
                <div>
                  <p
                    className="text-[10px] font-semibold tracking-[0.25em] uppercase mb-2"
                    style={overlineStyle}
                  >
                    Seller listing
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
                      {String(product._id ?? product.id ?? productId)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                      Variants
                    </dt>
                    <dd className="text-zinc-900">{variants.length}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <section className={`${cardClass} p-5 sm:p-6 lg:p-8 space-y-6`} style={cardStyle}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className={labelBase}>Variants</p>
                  <p className="text-sm" style={mutedTextStyle}>
                    Manage SKUs for this product. Each variant needs its own price.
                  </p>
                </div>
                {!showVariantForm ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowVariantForm(true);
                      setVariantError("");
                      setVariantSuccess("");
                    }}
                    className={`text-sm px-4 py-2.5 ${outlineBtnClass}`}
                  >
                    Add variant
                  </button>
                ) : null}
              </div>

              <VariantList variants={variants} productImages={imageList} />

              {showVariantForm ? (
                <AddVariantForm
                  key={defaultCurrency}
                  defaultCurrency={defaultCurrency}
                  submitting={variantSubmitting}
                  error={variantError}
                  success={variantSuccess}
                  onSubmit={handleAddVariant}
                  onCancel={() => {
                    setShowVariantForm(false);
                    setVariantError("");
                    setVariantSuccess("");
                  }}
                />
              ) : null}
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SellerProductDetail;
