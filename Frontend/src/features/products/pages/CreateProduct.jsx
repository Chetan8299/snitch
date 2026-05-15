import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { useProduct } from "../hooks/useProduct";
import {
  CURRENCIES,
  DEFAULT_CURRENCY,
  MAX_PRODUCT_IMAGES,
  MAX_VARIANT_IMAGES_PER_VARIANT,
  MAX_VARIANT_IMAGES_TOTAL,
  MAX_VARIANTS,
} from "../constants/product.constants";
import {
  attributesFromRows,
  createEmptyAttributeRow,
  createEmptyVariant,
  fileFingerprint,
  formatCreateProductError,
} from "../utils/product.utils";
import {
  cardClass,
  cardStyle,
  errorStyle,
  headingClass,
  headingStyle,
  inputBase,
  innerStyle,
  labelBase,
  linkClass,
  mutedTextStyle,
  overlineStyle,
  outlineBtnClass,
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
        <span className="text-zinc-500 normal-case tracking-normal">
          (optional)
        </span>
      ) : (
        <span className="text-amber-700">*</span>
      )}
    </label>
    {children}
  </div>
);

function ImagePreviewGrid({ urls, files, onRemove }) {
  if (!urls.length) return null;

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
      {urls.map((url, i) => (
        <li
          key={
            files[i]
              ? `${fileFingerprint(files[i])}-${i}`
              : `preview-${i}`
          }
          className="relative group aspect-square rounded-none overflow-hidden border border-zinc-300 bg-zinc-100 shadow-sm"
        >
          <img
            src={url}
            alt={files[i]?.name ? `Preview ${files[i].name}` : `Preview ${i + 1}`}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-80 pointer-events-none"
            aria-hidden
          />
          <p className="absolute bottom-0 left-0 right-0 px-2.5 pb-2 pt-6 text-[10px] text-zinc-800 truncate">
            {files[i]?.name ?? "Image"}
          </p>
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-none border border-zinc-300 bg-white/90 text-zinc-800 text-lg leading-none hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
            aria-label={`Remove image ${i + 1}`}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}

function VariantEditor({ index, variant, onChange, onRemove, canRemove }) {
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
    onChange({ ...variant, ...patch });
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

  const onVariantImagesChange = (e) => {
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

  const removeVariantImageAt = (imageIndex) => {
    updateVariant({
      imageFiles: variant.imageFiles.filter((_, i) => i !== imageIndex),
    });
  };

  return (
    <article
      className="rounded-none border border-zinc-300 p-5 sm:p-6 space-y-6"
      style={innerStyle}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-semibold text-zinc-900">Variant {index + 1}</h3>
        {canRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="text-sm font-medium text-red-700 hover:text-red-800"
          >
            Remove variant
          </button>
        ) : null}
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
        <Field id={`variant-${variant.localId}-stock`} label="Stock" optional>
          <input
            id={`variant-${variant.localId}-stock`}
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
        <Field id={`variant-${variant.localId}-price`} label="Price">
          <input
            id={`variant-${variant.localId}-price`}
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
        <Field id={`variant-${variant.localId}-currency`} label="Currency">
          <select
            id={`variant-${variant.localId}-currency`}
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

      <Field id={`variant-${variant.localId}-images`} label="Variant images" optional>
        <div className="rounded-none border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-6 text-center transition hover:border-amber-600/40">
          <input
            id={`variant-${variant.localId}-images`}
            type="file"
            accept="image/*"
            multiple
            onChange={onVariantImagesChange}
            className="block w-full text-sm text-zinc-600 file:mx-auto file:mr-0 file:mb-3 file:block file:rounded-none file:border file:border-zinc-300 file:bg-white file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-zinc-800 file:cursor-pointer cursor-pointer"
          />
          <p className="text-xs leading-relaxed mt-2" style={mutedTextStyle}>
            Up to {MAX_VARIANT_IMAGES_PER_VARIANT} per variant · leave empty to use product images · 10 MB each
          </p>
          {variant.imageFiles.length > 0 ? (
            <p className="text-xs font-medium mt-3 text-amber-700">
              {variant.imageFiles.length} selected
            </p>
          ) : null}
        </div>
      </Field>

      <ImagePreviewGrid
        urls={previewUrls}
        files={variant.imageFiles}
        onRemove={removeVariantImageAt}
      />
    </article>
  );
}

const CreateProduct = () => {
  const { handleCreateProduct } = useProduct();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priceAmount, setPriceAmount] = useState("");
  const [priceCurrency, setPriceCurrency] = useState(DEFAULT_CURRENCY);
  const [imageFiles, setImageFiles] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const previewUrls = useMemo(
    () => imageFiles.map((file) => URL.createObjectURL(file)),
    [imageFiles]
  );

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const onImagesChange = (e) => {
    const input = e.target;
    const picked = Array.from(input.files ?? []);
    input.value = "";

    setImageFiles((prev) => {
      const seen = new Set(prev.map(fileFingerprint));
      const merged = [...prev];
      for (const file of picked) {
        if (merged.length >= MAX_PRODUCT_IMAGES) break;
        const fp = fileFingerprint(file);
        if (seen.has(fp)) continue;
        seen.add(fp);
        merged.push(file);
      }
      return merged;
    });
    setError("");
  };

  const removeImageAt = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setError("");
  };

  const addVariant = () => {
    if (variants.length >= MAX_VARIANTS) {
      setError(`You can add up to ${MAX_VARIANTS} variants.`);
      return;
    }
    setVariants((prev) => [...prev, createEmptyVariant(priceCurrency)]);
    setError("");
  };

  const updateVariantAt = (index, nextVariant) => {
    setVariants((prev) => prev.map((variant, i) => (i === index ? nextVariant : variant)));
    setError("");
  };

  const removeVariantAt = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
    setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    setError("");
    setSuccess("");

    if (!imageFiles.length) {
      setError(`Add at least one product image (up to ${MAX_PRODUCT_IMAGES}).`);
      return;
    }

    for (const [index, variant] of variants.entries()) {
      const priceText = String(variant.priceAmount).trim();
      if (!priceText) {
        setError(`Variant ${index + 1} needs a price.`);
        return;
      }
      if (Number.isNaN(Number(priceText))) {
        setError(`Variant ${index + 1} price must be a number.`);
        return;
      }
      if (variant.stock !== "" && Number.isNaN(Number(variant.stock))) {
        setError(`Variant ${index + 1} stock must be a number.`);
        return;
      }
    }

    const totalVariantImages = variants.reduce(
      (sum, variant) => sum + variant.imageFiles.length,
      0
    );
    if (totalVariantImages > MAX_VARIANT_IMAGES_TOTAL) {
      setError(`Variant images are limited to ${MAX_VARIANT_IMAGES_TOTAL} total across all variants.`);
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("priceAmount", priceAmount.trim());
    formData.append("priceCurrency", priceCurrency);
    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    if (variants.length > 0) {
      const payload = variants.map((variant) => ({
        stock: variant.stock === "" ? 0 : Number(variant.stock),
        priceAmount: String(variant.priceAmount).trim(),
        priceCurrency: variant.priceCurrency,
        attributes: attributesFromRows(variant.attributeRows),
        imageCount: variant.imageFiles.length,
      }));
      formData.append("variants", JSON.stringify(payload));
      variants.forEach((variant) => {
        variant.imageFiles.forEach((file) => {
          formData.append("variantImages", file);
        });
      });
    }

    setLoading(true);
    try {
      await handleCreateProduct(formData);
      setSuccess("Product created.");
      setTitle("");
      setDescription("");
      setPriceAmount("");
      setPriceCurrency(DEFAULT_CURRENCY);
      setImageFiles([]);
      setVariants([]);
      formEl.reset();
    } catch (err) {
      setError(formatCreateProductError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex justify-center px-4 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-20"
      style={pageStyle}
    >
      <div className="w-full max-w-[min(100%,1200px)]">
        <header className="mb-10 lg:mb-12 max-w-3xl">
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
            New product
          </h1>
          <p className="text-sm sm:text-base mt-3 leading-relaxed" style={mutedTextStyle}>
            Add product details, gallery images, and optional variants. Each variant needs its own price;
            leave images empty to use the product gallery.
          </p>
        </header>

        <form
          onSubmit={onSubmit}
          className={`${cardClass} p-6 sm:p-8 lg:p-10 xl:p-12 shadow-sm`}
          style={cardStyle}
          noValidate
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-14">
            <div className="lg:col-span-7 space-y-7 min-w-0">
              <Field id="title" label="Title">
                <input
                  id="title"
                  name="title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Handwoven tote"
                  className={inputBase}
                />
              </Field>

              <Field id="description" label="Description">
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What buyers should know"
                  className={`${inputBase} resize-y min-h-[160px]`}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field id="priceAmount" label="Price">
                  <input
                    id="priceAmount"
                    name="priceAmount"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="any"
                    required
                    value={priceAmount}
                    onChange={(e) => setPriceAmount(e.target.value)}
                    placeholder="0"
                    className={inputBase}
                  />
                </Field>
                <Field id="priceCurrency" label="Currency">
                  <select
                    id="priceCurrency"
                    name="priceCurrency"
                    value={priceCurrency}
                    onChange={(e) => setPriceCurrency(e.target.value)}
                    className={`${inputBase} appearance-none cursor-pointer`}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c} className="bg-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <section className="space-y-4 pt-2 border-t border-zinc-300">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className={labelBase}>Variants</p>
                    <p className="text-sm" style={mutedTextStyle}>
                      Optional SKUs with stock, attributes, and a required price. Images fall back to the
                      product gallery when left empty.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addVariant}
                    disabled={variants.length >= MAX_VARIANTS}
                    className={`text-sm px-4 py-2.5 ${outlineBtnClass}`}
                  >
                    Add variant
                  </button>
                </div>

                {variants.length === 0 ? (
                  <p className="text-sm rounded-none border border-dashed border-zinc-300 px-4 py-5" style={mutedTextStyle}>
                    No variants yet. Use the button above to add size, color, or other options.
                  </p>
                ) : (
                  <div className="space-y-5">
                    {variants.map((variant, index) => (
                      <VariantEditor
                        key={variant.localId}
                        index={index}
                        variant={variant}
                        onChange={(nextVariant) => updateVariantAt(index, nextVariant)}
                        onRemove={() => removeVariantAt(index)}
                        canRemove
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>

            <div className="lg:col-span-5 lg:border-l border-zinc-300 lg:pl-10 xl:pl-12 pt-2 lg:pt-0 space-y-4 min-w-0">
              <Field id="images" label="Images">
                <div
                  className="rounded-none border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 sm:py-10 text-center transition hover:border-amber-600/40"
                  style={{ minHeight: "140px" }}
                >
                  <input
                    id="images"
                    name="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onImagesChange}
                    className="block w-full text-sm text-zinc-600 file:mx-auto file:mr-0 file:mb-3 file:block file:rounded-none file:border file:border-zinc-300 file:bg-white file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-zinc-800 file:cursor-pointer cursor-pointer"
                  />
                  <p className="text-xs leading-relaxed mt-2" style={mutedTextStyle}>
                    Up to {MAX_PRODUCT_IMAGES} total (add in batches) · duplicate files skipped · 10 MB each · at least one
                    to submit
                  </p>
                  {imageFiles.length > 0 ? (
                    <p className="text-xs font-medium mt-3 text-amber-700">
                      {imageFiles.length} selected
                    </p>
                  ) : null}
                </div>
              </Field>

              <ImagePreviewGrid
                urls={previewUrls}
                files={imageFiles}
                onRemove={removeImageAt}
              />
            </div>

            <div className="lg:col-span-12 space-y-6 pt-8 mt-2 border-t border-zinc-300">
              {error ? (
                <p className="rounded-none px-5 py-3 text-sm" style={errorStyle} role="alert">
                  {error}
                </p>
              ) : null}

              {success ? (
                <p className="rounded-none px-5 py-3 text-sm" style={successStyle} role="status">
                  {success}
                </p>
              ) : null}

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full sm:w-auto sm:min-w-[220px] px-8 ${primaryBtnClass}`}
                  style={primaryBtnStyle}
                >
                  {loading ? "Creating…" : "Create product"}
                </button>
                <Link
                  to="/"
                  className={`text-center sm:text-left text-sm ${linkClass}`}
                >
                  Back to home
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
