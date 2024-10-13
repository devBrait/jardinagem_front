/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  important: ["#root"],
  theme: {
    extend: {
      colors: {
        verde_claro: "#98b344",
        verde_footer: "#DAE3BE",
        cinza_claro: "#656565",
      }
    },
  },
  plugins: [],
}

