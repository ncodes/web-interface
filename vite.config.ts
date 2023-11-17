import inject from "@rollup/plugin-inject";
import react from "@vitejs/plugin-react-swc";
import { Buffer } from "buffer";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  let define = {};
  if (command != "build") {
    define = {
      global: { Buffer: Buffer },
    };
  }

  if (command == "build") {
    globalThis.Buffer = Buffer;
  }

  return {
    define,
    build: {
      rollupOptions: {
        plugins: [inject({ Buffer: ["Buffer", "Buffer"] })],
      },
    },
    plugins: [react()],
  };
});
