/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          satoshi: ["Satoshi", "sans-serif"],
          poppins: ["Poppins", "sans-serif"],
          inter: ["Inter", "sans-serif"],  
          clash: ["Clash Display", "sans-serif"],
          general: ["General Sans", "sans-serif"],
        },
      },
    },
    plugins: [],
  };
  