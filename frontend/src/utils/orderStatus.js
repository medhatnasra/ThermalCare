const STATUS_META = {
  pending: {
    label: "En attente",
    badgeClassName: "bg-amber-100 text-amber-700",
  },
  delivered: {
    label: "Livré",
    badgeClassName: "bg-emerald-100 text-emerald-700",
  },
  cancelled: {
    label: "Annulé",
    badgeClassName: "bg-rose-100 text-rose-700",
  },
  shipped: {
    label: "Expédié",
    badgeClassName: "bg-sky-100 text-sky-700",
  },
  unknown: {
    label: "Inconnu",
    badgeClassName: "bg-slate-100 text-slate-700",
  },
};

export const normalizeOrderStatus = (status) => {
  const value = String(status || "").toLowerCase();

  if (value.includes("cancel")) return "cancelled";
  if (value.includes("deliver")) return "delivered";
  if (value.includes("ship")) return "shipped";
  if (
    value.includes("pend") ||
    value.includes("process") ||
    value.includes("paid")
  ) {
    return "pending";
  }

  return value || "unknown";
};

export const getOrderStatusMeta = (status) => {
  const normalizedStatus = normalizeOrderStatus(status);
  return STATUS_META[normalizedStatus] || STATUS_META.unknown;
};

export const getOrderStatusLabel = (status) => getOrderStatusMeta(status).label;

export const getOrderStatusBadgeClassName = (status) =>
  getOrderStatusMeta(status).badgeClassName;

export const getOrderStatusSelectValue = (status) => {
  const normalizedStatus = normalizeOrderStatus(status);

  if (normalizedStatus === "delivered") return "Delivered";
  if (normalizedStatus === "cancelled") return "Cancelled";
  return "Pending";
};

export const ORDER_STATUS_OPTIONS = [
  { value: "Pending", label: "En attente" },
  { value: "Delivered", label: "Livré" },
  { value: "Cancelled", label: "Annulé" },
];
