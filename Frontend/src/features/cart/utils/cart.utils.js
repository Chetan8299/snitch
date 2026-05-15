import {
  firstImageUrl,
  formatAttributes,
  formatPrice,
  imageUrl,
  normalizeVariantAttributes,
} from "../../products/utils/product.utils";

export function findVariantInProduct(product, variantId) {
  if (!product || variantId == null) return null;
  const want = String(variantId);
  const list = Array.isArray(product.variants) ? product.variants : [];
  return (
    list.find(
      (v) => String(v._id) === want || String(v.id) === want,
    ) ?? null
  );
}

export function resolveCartLine(item) {
  const product = item?.product;
  const quantity = Number(item?.quantity) || 1;
  const variant = findVariantInProduct(product, item?.variant);

  const unitPrice = variant?.price ?? item?.price ?? product?.price;
  const amount = Number(unitPrice?.amount);
  const currency = unitPrice?.currency ?? "INR";

  const variantImages = Array.isArray(variant?.images) ? variant.images : [];
  const image =
    imageUrl(variantImages[0]) ?? firstImageUrl(product) ?? null;

  const productId = product?._id ?? product?.id ?? null;
  const variantLabel = variant
    ? formatAttributes(normalizeVariantAttributes(variant.attributes))
    : null;

  return {
    id: item?._id ?? `${productId}-${item?.variant}`,
    productId,
    title: product?.title ?? "Product",
    image,
    variantLabel,
    quantity,
    unitAmount: Number.isFinite(amount) ? amount : 0,
    currency,
    lineTotal: Number.isFinite(amount) ? amount * quantity : 0,
    stock: variant?.stock ?? null,
    formattedUnit: formatPrice(amount, currency),
    formattedLine: formatPrice(
      Number.isFinite(amount) ? amount * quantity : null,
      currency,
    ),
  };
}

export function cartSubtotal(items) {
  if (!Array.isArray(items) || !items.length) {
    return { total: 0, currency: "INR", count: 0 };
  }

  let total = 0;
  let currency = "INR";
  let count = 0;

  for (const item of items) {
    const line = resolveCartLine(item);
    total += line.lineTotal;
    currency = line.currency;
    count += line.quantity;
  }

  return { total, currency, count };
}
