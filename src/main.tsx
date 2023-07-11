import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/app.css";
import { RootErrorBoundary } from "./pages/errors/root.tsx";
import ConnectExample from "./pages/play/ConnectExample.tsx";
import Index from "./pages/index/Index.tsx";

const router = createBrowserRouter([
  {
    path: "/play/connect-wallet",
    element: <App page={<ConnectExample />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: "/",
    element: <App page={<Index />} />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
