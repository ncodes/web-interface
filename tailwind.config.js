/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    screens: {
      xxxs: "320px",
      xxs: "375px",
      xs: "425px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1920px",
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontFamily: {
      sans: ["Mitr", "sans-serif"],
      raleway: ["Raleway", "sans-serif"],
      satoshi: ["Satoshi", "sans-serif"],
      jersey10: [`"Jersey 10"`, "sans-serif"],
      jersey20: [`"Jersey 20"`, "sans-serif"],
      jersey25: [`"Jersey 25"`, "sans-serif"],
      abrilFatFace: [`"Abril Fatface"`, "sans-serif"],
      mitr: ["Mitr", "sans-serif"],
    },
    extend: {
      colors: {
        background: "#030507",
        "chinese-green": "#C8ED5A",
        "vampire-black": "#060A0E",

        // Input element colors
        input: "#0F2137",
        "input-separator": "#163357",

        // Modal
        "modal-border": "#26292D",
        "modal-background": "#030507",

        // Card
        "card-background": "#0C1218",
        "card-border": "#2F3F4F",
        "card-icon": "#7E8FB1",

        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundImage: {
        chat: "url('/images/bg/chatbg.png')",
        airdropHeader: "url('/images/airdrop/headerbg.png')",
        airdropHeader2: "url('/images/airdrop/headerbg2.png')",
        airdropHeader3: "url('/images/airdrop/headerbg3.png')",
        gamebg: "url('/images/game/gamebg@1x.png')",
        warbond: "url('public/images/game/warbondbg.png')",
      },
      transitionProperty: {
        width: "width",
        left: "left",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("tailwindcss-animate")],
};
