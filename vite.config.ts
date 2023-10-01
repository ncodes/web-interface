import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { Buffer } from "buffer";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    global: {
      Buffer: Buffer,
    },
  },
  plugins: [react()],
});
