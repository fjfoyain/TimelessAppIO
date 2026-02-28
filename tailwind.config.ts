import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7f13ec",
          dark: "#5e0eb0",
          light: "#9d4dff",
          hover: "#6b10c7",
        },
        accent: {
          cyan: "#00f0ff",
          fuchsia: "#d946ef",
          pink: "#ec4899",
          amber: "#f59e0b",
        },
        background: {
          dark: "#0a060f",
          "dark-alt": "#050408",
          deep: "#191022",
        },
        surface: {
          dark: "#13111a",
          alt: "#231630",
          input: "#2d1f3b",
        },
        card: {
          dark: "#130d1a",
        },
        whatsapp: "#25D366",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
      },
      backgroundImage: {
        "premium-gradient":
          "linear-gradient(135deg, rgba(127,19,236,0.1) 0%, rgba(10,6,15,1) 100%)",
        "card-gradient":
          "linear-gradient(180deg, rgba(30,20,40,0.6) 0%, rgba(19,13,26,0.9) 100%)",
      },
      boxShadow: {
        glow: "0 0 20px -5px rgba(127, 19, 236, 0.5)",
        "glow-hover": "0 0 30px -5px rgba(127, 19, 236, 0.7)",
        "glow-btn": "0 0 20px rgba(127, 19, 236, 0.4)",
        "glow-white": "0 0 30px rgba(255, 255, 255, 0.3)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        tilt: "tilt 10s infinite linear",
        "float-slow": "float 6s ease-in-out infinite",
        "float-delayed": "float 8s ease-in-out 2s infinite",
        "spin-slow": "spin 25s linear infinite",
        "spin-slower": "spin 35s linear infinite reverse",
        "spin-slowest": "spin 45s linear infinite",
      },
      keyframes: {
        tilt: {
          "0%, 50%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(0.5deg)" },
          "75%": { transform: "rotate(-0.5deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
