import { DEFAULT_CURRENCY } from "../constants/product.constants";

export function createLocalId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createEmptyAttributeRow() {
  return { localId: createLocalId("attr"), key: "", value: "" };
}

export function createEmptyVariant(defaultCurrency = DEFAULT_CURRENCY) {
  return {
    localId: createLocalId("variant"),
    stock: "",
    priceAmount: "",
    priceCurrency: defaultCurrency,
    attributeRows: [createEmptyAttributeRow()],
    imageFiles: [],
  };
}

export function attributesFromRows(rows) {
  const attributes = {};
  for (const row of rows) {
    const key = row.key.trim();
    const value = row.value.trim();
    if (!key || !value) continue;
    attributes[key] = value;
  }
  return attributes;
}

export function fileFingerprint(file) {
  return `${file.name}\0${file.size}\0${file.lastModified}`;
}

export function imageUrl(entry) {
  if (!entry) return null;
  if (typeof entry === "string") return entry;
  if (typeof entry?.url === "string") return entry.url;
  if (typeof entry?.filePath === "string") return entry.filePath;
  return null;
}

export function firstImageUrl(product) {
  const first = product?.images?.[0];
  return imageUrl(first);
}

export function formatPrice(amount, currency) {
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

export function formatAttributes(attributes) {
  if (attributes == null) return "—";

  const entries =
    attributes instanceof Map
      ? [...attributes.entries()]
      : Object.entries(attributes);

  if (!entries.length) return "—";
  return entries.map(([key, value]) => `${key}: ${value}`).join(" · ");
}

export function sellerLabel(seller) {
  if (seller == null) return "—";
  if (typeof seller === "string") return seller;
  if (typeof seller === "object") {
    const fullName = typeof seller.fullName === "string" ? seller.fullName.trim() : "";
    const altName = typeof seller.name === "string" ? seller.name.trim() : "";
    const name = fullName || altName;
    if (name) return name;
    if (typeof seller.email === "string" && seller.email.trim()) return seller.email.trim();
    if (seller._id) return String(seller._id);
  }
  return String(seller);
}

export function getApiErrorMessage(err, fallback) {
  const data = err?.response?.data;
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    const first = data.errors[0];
    return typeof first === "string" ? first : first?.msg ?? fallback;
  }
  if (typeof data?.message === "string") return data.message;
  return fallback;
}

export function loadProductDetailsError(err) {
  if (err?.response?.status === 404) return "This product could not be found.";
  return getApiErrorMessage(err, "Could not load product details.");
}

export function loadProductListError(err) {
  return getApiErrorMessage(err, "Could not load products. Try again.");
}

export function loadSellerProductsError(err) {
  if (err?.response?.status === 401) return "Sign in as a seller to view your products.";
  if (err?.response?.status === 403) {
    return "Seller account required. Register or log in with a seller profile.";
  }
  return getApiErrorMessage(err, "Could not load products. Try again.");
}

export function formatCreateProductError(err) {
  return getApiErrorMessage(err, "Could not create product. Try again.");
}

export function formatVariantSubmitError(err) {
  return getApiErrorMessage(err, "Could not add variant. Try again.");
}

export function normalizeVariantAttributes(attributes) {
  if (attributes == null) return {};
  if (attributes instanceof Map) return Object.fromEntries(attributes.entries());
  if (typeof attributes === "object") return attributes;
  return {};
}

export function variantOptionGroups(variants) {
  if (!Array.isArray(variants) || !variants.length) return [];

  const byName = new Map();
  for (const variant of variants) {
    const attrs = normalizeVariantAttributes(variant?.attributes);
    for (const [name, value] of Object.entries(attrs)) {
      const key = String(name).trim();
      const option = String(value).trim();
      if (!key || !option) continue;
      if (!byName.has(key)) byName.set(key, new Set());
      byName.get(key).add(option);
    }
  }

  return [...byName.entries()].map(([name, values]) => ({
    name,
    values: [...values],
  }));
}
