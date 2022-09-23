/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./public/**/*.html",
  ],
  plugins: [
    require("daisyui"),
  ],
  daisyui: {
    themes: ["cmyk", "dark"],
  },
}
