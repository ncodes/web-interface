import react from "@vitejs/plugin-react-swc";
import { Buffer } from "buffer";
import "dotenv/config";
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

  // replaceInFile.sync({
  //   files: "./public/worker.js",
  //   from: "process.env.VITE_APP_URL",
  //   to: process.env.VITE_APP_URL,
  // });

  return {
    define,
    plugins: [replaceWorkerEnv(), react()],
  };
});
