/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    fontFamily: {
      asap: ["Asap", "sans-serif"],
      inter: ["Inter", "sans-serif"],
    },
    extend: {
      gridTemplateColumns: {
        "auto-1fr": "auto 1fr",
      },
    },
  },
  plugins: [],
};
