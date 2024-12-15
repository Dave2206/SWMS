/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./presets/**/*.{js,vue,ts}",
    // other paths
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-primeui")],
  purge: ["./src/**/*.{vue,js,ts,jsx,tsx}"],
};
