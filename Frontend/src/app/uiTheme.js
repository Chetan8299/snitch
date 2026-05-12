export const colors = {
  page: "#F4F4F5",
  card: "#FFFFFF",
  inner: "#FAFAFA",
  image: "#E4E4E7",
  text: "#18181B",
  muted: "#52525B",
  label: "#71717A",
  accent: "#B45309",
  accentStrong: "#D97706",
  accentSoft: "#F59E0B",
  border: "#D4D4D8",
};

export const pageStyle = {
  backgroundColor: colors.page,
};

export const cardStyle = { backgroundColor: colors.card };

export const innerStyle = { backgroundColor: colors.inner };

export const headingClass = "font-heading tracking-tight";

export const headingStyle = {
  color: colors.text,
};

export const overlineStyle = { color: colors.accent };

export const mutedTextStyle = { color: colors.muted };

export const errorStyle = {
  backgroundColor: "#FEF2F2",
  border: "1px solid #FECACA",
  color: "#B91C1C",
};

export const successStyle = {
  backgroundColor: "#F0FDF4",
  border: "1px solid #BBF7D0",
  color: "#166534",
};

export const inputBase =
  "w-full rounded-none border px-5 py-4 text-sm text-zinc-900 bg-white " +
  "placeholder:text-zinc-400 border-zinc-300 transition-all duration-200 outline-none " +
  "focus:border-amber-600 focus:ring-2 focus:ring-amber-600/15 hover:border-zinc-400";

export const labelBase =
  "block text-xs font-medium tracking-widest uppercase text-zinc-500 mb-2.5";

export const cardClass = "rounded-none border border-zinc-300";

export const primaryBtnClass =
  "rounded-none py-4 text-sm font-semibold tracking-wide transition-all duration-200 " +
  "disabled:pointer-events-none disabled:opacity-40 " +
  "focus:outline-none focus:ring-2 focus:ring-amber-600/40 focus:ring-offset-2 focus:ring-offset-white";

export const primaryBtnStyle = {
  backgroundColor: colors.accentStrong,
  color: "#FFFFFF",
};

export const outlineBtnClass =
  "rounded-none border-2 border-amber-600 px-6 py-4 text-sm font-semibold tracking-wide " +
  "text-amber-700 transition hover:bg-amber-50 focus:outline-none focus:ring-2 " +
  "focus:ring-amber-600/40 focus:ring-offset-2 focus:ring-offset-white";

export const linkClass =
  "font-semibold text-amber-700 transition hover:text-amber-800";

export const productCardStyle = {
  backgroundColor: colors.card,
  borderColor: colors.border,
};
