/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // 🔥 Core
        primary: "#020617", // APP BACKGROUND (single source of truth)

        // 🧱 Surfaces
        surface: "#020617", // same as primary, explicit meaning
        card: "#1E293B",
        border: "#334155",

        // 🎯 Brand / highlights
        secondary: "#C9A961",

        // 🧠 Text
        text: {
          primary: "#FFFFFF",
          secondary: "#94A3B8",
          muted: "#64748B",
        },

        // ⚠️ States
        destructive: "#EF4444",
      },
    },
  },
  plugins: [],
};
