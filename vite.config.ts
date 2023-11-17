import inject from "@rollup/plugin-inject";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    define: {},
    server: {
      rollupOptions: {
        plugins: [inject({ Buffer: ["Buffer", "buffer"] })],
      },
    },
    build: {
      rollupOptions: {
        plugins: [inject({ Buffer: ["Buffer", "buffer"] })],
      },
    },
    plugins: [react()],
  };
});
