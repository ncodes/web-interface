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
import Timeline from "./pages/Timeline.tsx";
import Market from "./pages/Market.tsx";
import Liquidities from "./pages/Liquidities.tsx";
import Liquidity from "./pages/Liquidity.tsx";
import Swaps from "./pages/Swaps.tsx";
import Swap from "./pages/Swap.tsx";
import Disputes from "./pages/Disputes.tsx";
import Mediation from "./pages/Mediation.tsx";
import Offers from "./pages/Offers.tsx";
import Offer from "./pages/Offer.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ConnectorProvider from "./hooks/connectors/components/ConnectorProvider.tsx";

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
    element: <App page={<Timeline />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("/markets"),
    element: <App page={<Markets defaultTab="markets" />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("/markets/owned"),
    element: <App page={<Markets defaultTab="my-markets" />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("/market/:id"),
    element: <App page={<Market />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("/liquidity/owned"),
    element: <App page={<Liquidities />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("/liquidity/:market/:provider/:lid"),
    element: <App page={<Liquidity />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("/liquidity/:market/:provider/:lid/offers"),
    element: <App page={<Liquidity defaultTab="offers" />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("/swaps/owned"),
    element: <App page={<Swaps />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("/swap/:orderId"),
    element: <App page={<Swap />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("/disputes"),
    element: <App page={<Disputes />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("/mediation"),
    element: <App page={<Mediation defaultTab="my-tickets" />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("/tickets/owned"),
    element: <App page={<Mediation defaultTab="my-tickets" />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("/tickets/stats"),
    element: <App page={<Mediation defaultTab="ticket-stats" />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("/offers"),
    element: <App page={<Offers />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("/offer/:id"),
    element: <App page={<Offer />} />,
    errorElement: <RootErrorBoundary />,
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConnectorProvider
        appName={import.meta.env.NEXT_PUBLIC_APP_NAME}
        infuraId={import.meta.env.NEXT_PUBLIC_INFURA_ID}
      >
        <RouterProvider router={router} />
      </ConnectorProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
