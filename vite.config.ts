import react from "@vitejs/plugin-react-swc";
import { Buffer } from "buffer";
import "dotenv/config";
import { resolve } from "path";
import replaceInFile from "replace-in-file";
import { defineConfig } from "vite";

function replaceWorkerEnv() {
  return {
    name: "replaceWorkerEnv",
    writeBundle: {
      sequential: true,
      order: "post",
      async handler({ dir }) {
        await replaceInFile({
          files: dir + "/worker.js",
          from: "import.meta.env.VITE_APP_URL",
          to: `"${process.env.VITE_APP_URL}"`,
        });
      },
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
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
    resolve: {
      alias: [
        {
          find: "@/icons",
          replacement: resolve(__dirname, "./src/components/icons"),
        },
        { find: "@", replacement: resolve(__dirname, "./src") },
      ],
    },
    plugins: [replaceWorkerEnv(), react()],
  };
});
