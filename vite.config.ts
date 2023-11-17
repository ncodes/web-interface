import inject from "@rollup/plugin-inject";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    define: {},
    server: {
      rollupOptions: {
        plugins: [inject({ Buffer: ["Buffer", "Buffer"] })],
      },
    },
    build: {
      rollupOptions: {
        plugins: [inject({ Buffer: ["Buffer", "Buffer"] })],
      },
    },
    plugins: [react()],
  };
});
