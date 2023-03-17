/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        mobile: { max: "1024px" }, // Mobile screens
        laptop: { min: "1024px" }, // Laptop screens
      },
    },
  },
  plugins: [],
};
