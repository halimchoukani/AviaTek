export const STATUS_COLORS = {
  Pending: { bg: "#3A2D14", text: "#F59E0B", border: "#F59E0B" },
  Approved: { bg: "#064E3B", text: "#10B981", border: "#10B981" },
  Rejected: { bg: "#450A0A", text: "#EF4444", border: "#EF4444" },
};

export const REQUEST_TYPE_COLORS: Record<string, { text: string; bg: string }> = {
  "Type Rating": { text: "#C9A961", bg: "#2D2612" }, // Goldish
  "Recurrency": { text: "#94A3B8", bg: "#1E293B" }, // Greyish
  "Checkout": { text: "#94A3B8", bg: "#1E293B" },
  "Proficiency": { text: "#D97706", bg: "#2D1B05" }, // Amber
  "Initial": { text: "#C9A961", bg: "#2D2612" },
};