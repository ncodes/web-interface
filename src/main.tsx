import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "../polyfills.ts";
import App from "./App.tsx";
import ConnectorProvider from "./hooks/connectors/components/ConnectorProvider.tsx";
import "./hooks/store/useStore.ts";
import "./i18n/i18n.ts";
import { isLocal } from "./libs/helpers.ts";
import Airdrop from "./pages/Airdrop.tsx";
import Disputes from "./pages/Disputes.tsx";
import Liquidities from "./pages/Liquidities.tsx";
import Liquidity from "./pages/Liquidity.tsx";
import Market from "./pages/Market.tsx";
import Markets from "./pages/Markets.tsx";
import Mediation from "./pages/Mediation.tsx";
import Offer from "./pages/Offer.tsx";
import Offers from "./pages/Offers.tsx";
import RefPage from "./pages/Ref.tsx";
import Swap from "./pages/Swap.tsx";
import Swaps from "./pages/Swaps.tsx";
import { Error404 } from "./pages/errors/Error404.tsx";
import { RootErrorBoundary } from "./pages/errors/root.tsx";
import ConnectExample from "./pages/play/ConnectExample.tsx";
import "./sentry.ts";
import "./styles/app.css";
import "./styles/fonts.css";

// Make the path locale optional
function makePath(path: string) {
  return `:locale?/${path}`;
}

const routes = [
  {
    path: makePath("/"),
    element: <App page={<Markets defaultTab="markets" />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("/markets"),
    element: <App page={<Markets defaultTab="markets" />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("/markets/watching"),
    element: <App page={<Markets defaultTab="watched-markets" />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("/my/markets"),
    element: <App page={<Markets defaultTab="my-markets" />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("/market/:id"),
    element: <App page={<Market />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("/my/liquidity"),
    element: <App page={<Liquidities defaultTab="my-liquidities" />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("/liquidity/watched"),
    element: <App page={<Liquidities defaultTab="watched-liquidities" />} />,
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
    path: makePath("/my/swaps"),
    element: <App page={<Swaps />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("/swap/:orderId"),
    element: <App page={<Swap />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("/my/disputes"),
    element: <App page={<Disputes />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("/my/tickets"),
    element: <App page={<Mediation defaultTab="my-tickets" />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("/tickets/stats"),
    element: <App page={<Mediation defaultTab="ticket-stats" />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("/my/offers"),
    element: <App page={<Offers />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("/offer/:id"),
    element: <App page={<Offer />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("/airdrop"),
    element: <App page={<Airdrop defaultTab="airdrop" />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("/points"),
    element: <App page={<Airdrop defaultTab="leaderboard" />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("/tapwar"),
    element: <App page={<Airdrop defaultTab="tap" />} />,
    errorElement: <RootErrorBoundary />,
  },
  // {
  //   path: makePath("/energon"),
  //   element: <App page={<Airdrop defaultTab="energon" />} />,
  //   errorElement: <RootErrorBoundary />,
  // },
  // {
  //   path: makePath("/nft"),
  //   element: <App page={<Airdrop defaultTab="nft" />} />,
  //   errorElement: <RootErrorBoundary />,
  // },
  // {
  //   path: makePath("/galxe"),
  //   element: <App page={<Airdrop defaultTab="galxe" />} />,
  //   errorElement: <RootErrorBoundary />,
  // },
  // {
  //   path: makePath("/referrals"),
  //   element: <App page={<Points defaultTab="referrals" />} />,
  //   errorElement: <RootErrorBoundary />,
  // },
  {
    path: makePath("/r/:code"),
    element: <App page={<RefPage />} />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: makePath("*"),
    element: <Error404 />,
  },
];

if (isLocal()) {
  routes.push({
    path: makePath(`play/connect-wallet`),
    element: <App page={<ConnectExample />} />,
    errorElement: <RootErrorBoundary />,
  });
}

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ConnectorProvider>
    <RouterProvider router={router} />
  </ConnectorProvider>,
);
