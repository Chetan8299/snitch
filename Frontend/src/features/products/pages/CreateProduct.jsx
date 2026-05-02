import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { useProduct } from "../hooks/useProduct";

const inputBase =
  "w-full rounded-2xl border px-5 py-4 text-sm text-[#E5E1E4] " +
  "bg-[#131315] placeholder:text-[#534434]/80 " +
  "border-[#534434]/40 " +
  "transition-all duration-200 outline-none " +
  "focus:border-[#F59E0B]/60 focus:ring-2 focus:ring-[#F59E0B]/15 " +
  "hover:border-[#534434]/70";

const labelBase =
  "block text-xs font-medium tracking-widest uppercase text-[#D8C3AD]/70 mb-2.5";

const CURRENCIES = [
  "INR",
  "USD",
  "EUR",
  "GBP",
  "AUD",
  "CAD",
  "CHF",
  "CNY",
  "JPY",
  "KRW",
  "MXN",
  "NZD",
  "RUB",
  "SAR",
  "SEK",
  "SGD",
  "THB",
  "TRY",
  "ZAR",
];

const Field = ({ id, label, optional, children }) => (
  <div>
    <label htmlFor={id} className={labelBase}>
      {label}{" "}
      {optional ? (
        <span className="text-[#534434]/80 normal-case tracking-normal">
          (optional)
        </span>
      ) : (
        <span className="text-[#F59E0B]">*</span>
      )}
    </label>
    {children}
  </div>
);

function fileFingerprint(file) {
  return `${file.name}\0${file.size}\0${file.lastModified}`;
}

function formatSubmitError(err) {
  const data = err?.response?.data;
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    const first = data.errors[0];
    return typeof first === "string" ? first : first?.msg ?? "Invalid input";
  }
  if (typeof data?.message === "string") return data.message;
  return "Could not create product. Try again.";
}

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
          className="relative group aspect-square rounded-2xl overflow-hidden border border-[#534434]/35 bg-[#131315] shadow-lg shadow-black/20"
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
          <p className="absolute bottom-0 left-0 right-0 px-2.5 pb-2 pt-6 text-[10px] text-[#E5E1E4]/90 truncate">
            {files[i]?.name ?? "Image"}
          </p>
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-black/55 text-[#E5E1E4] text-lg leading-none backdrop-blur-sm opacity-90 hover:bg-red-950/80 hover:border-red-400/30 hover:text-red-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]"
            aria-label={`Remove image ${i + 1}`}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}

const CreateProduct = () => {
  const { handleCreateProduct } = useProduct();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priceAmount, setPriceAmount] = useState("");
  const [priceCurrency, setPriceCurrency] = useState("INR");
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const previewUrls = useMemo(
    () => imageFiles.map((file) => URL.createObjectURL(file)),
    [imageFiles]
  );

  useEffect(() => {
    return () => {
      previewUrls.forEach((u) => URL.revokeObjectURL(u));
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
        if (merged.length >= 7) break;
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

  const onSubmit = async (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    setError("");
    setSuccess("");

    if (!imageFiles.length) {
      setError("Add at least one image (up to 7).");
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

    setLoading(true);
    try {
      await handleCreateProduct(formData);
      setSuccess("Product created.");
      setTitle("");
      setDescription("");
      setPriceAmount("");
      setPriceCurrency("INR");
      setImageFiles([]);
      formEl.reset();
    } catch (err) {
      setError(formatSubmitError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex justify-center px-4 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-20"
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
        <header className="mb-10 lg:mb-12 max-w-3xl">
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
            New product
          </h1>
          <p className="text-sm sm:text-base mt-3 leading-relaxed" style={{ color: "#D8C3AD" }}>
            Fill in the details on the left; add images on the right. Previews update as you pick
            files (up to seven).
          </p>
        </header>

        <form
          onSubmit={onSubmit}
          className="rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12"
          style={{ backgroundColor: "#1C1B1D" }}
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
                      <option key={c} value={c} className="bg-[#1C1B1D]">
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>

            <div className="lg:col-span-5 lg:border-l border-[#534434]/25 lg:pl-10 xl:pl-12 pt-2 lg:pt-0 space-y-4 min-w-0">
              <Field id="images" label="Images">
                <div
                  className="rounded-2xl border-2 border-dashed border-[#534434]/50 bg-[#131315]/80 px-4 py-8 sm:py-10 text-center transition hover:border-[#F59E0B]/35"
                  style={{ minHeight: "140px" }}
                >
                  <input
                    id="images"
                    name="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onImagesChange}
                    className="block w-full text-sm text-[#D8C3AD] file:mx-auto file:mr-0 file:mb-3 file:block file:rounded-xl file:border-0 file:bg-[#534434]/35 file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-[#E5E1E4] file:cursor-pointer cursor-pointer"
                  />
                  <p className="text-xs leading-relaxed mt-2" style={{ color: "#D8C3AD" }}>
                    Up to 7 total (add in batches) · duplicate files skipped · 10 MB each · at least one
                    to submit
                  </p>
                  {imageFiles.length > 0 ? (
                    <p className="text-xs font-medium mt-3 text-[#F59E0B]">
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

            <div className="lg:col-span-12 space-y-6 pt-8 mt-2 border-t border-[#534434]/20">
              {error ? (
                <p
                  className="rounded-2xl px-5 py-3 text-sm"
                  style={{
                    backgroundColor: "rgba(147,0,10,0.25)",
                    border: "1px solid rgba(255,180,171,0.15)",
                    color: "#FFAAA5",
                  }}
                  role="alert"
                >
                  {error}
                </p>
              ) : null}

              {success ? (
                <p
                  className="rounded-2xl px-5 py-3 text-sm"
                  style={{
                    backgroundColor: "rgba(34,120,60,0.2)",
                    border: "1px solid rgba(134,239,172,0.2)",
                    color: "#BBF7D0",
                  }}
                  role="status"
                >
                  {success}
                </p>
              ) : null}

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={
                    "w-full sm:w-auto sm:min-w-[220px] rounded-2xl px-8 py-4 text-sm font-semibold tracking-wide " +
                    "transition-all duration-200 " +
                    "disabled:pointer-events-none disabled:opacity-40 " +
                    "focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/40 focus:ring-offset-2 " +
                    "focus:ring-offset-[#1C1B1D]"
                  }
                  style={{
                    background: loading
                      ? "#F59E0B"
                      : "linear-gradient(135deg, #FFC174 0%, #F59E0B 100%)",
                    color: "#2a1700",
                    boxShadow: "0 4px 24px rgba(245,158,11,0.18)",
                  }}
                >
                  {loading ? "Creating…" : "Create product"}
                </button>
                <Link
                  to="/"
                  className="text-center sm:text-left text-sm font-semibold text-[#F59E0B] transition hover:text-[#FFC174]"
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
