import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/fonts.css";
import "./styles/app.css";
import { RootErrorBoundary } from "./pages/errors/root.tsx";
import ConnectExample from "./pages/play/ConnectExample.tsx";
import "./i18n/i18n.ts";
import "./hooks/store/useStore.ts";
import Markets from "./pages/Markets.tsx";
import Index from "./pages/Index.tsx";
import Market from "./pages/Market.tsx";

function makePath(path: string) {
  return `:locale?/${path}`;
}

const router = createBrowserRouter([
  {
    path: makePath(`play/connect-wallet`),
    element: <App page={<ConnectExample />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath(""),
    element: <App page={<Index />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("/markets"),
    element: <App page={<Markets />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("/market/:id"),
    element: <App page={<Market />} />,
    errorElement: <RootErrorBoundary />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
