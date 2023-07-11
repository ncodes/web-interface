import useStore, { StoreContext } from "./hooks/store/useStore.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import ConnectorProvider from "./hooks/connectors/components/ConnectorProvider.tsx";
import { ReactElement } from "react";

type AppProps = {
  page: ReactElement;
};

function App({ page }: AppProps) {
  const store = useStore();
  const queryClient = new QueryClient();

  return (
    <StoreContext.Provider value={store}>
      <ConnectorProvider
        appName={import.meta.env.NEXT_PUBLIC_APP_NAME}
        infuraId={import.meta.env.NEXT_PUBLIC_INFURA_ID}
      >
        <QueryClientProvider client={queryClient}>
          <Toaster containerStyle={{ top: 80 }} />
          {page}
        </QueryClientProvider>
      </ConnectorProvider>
    </StoreContext.Provider>
  );
}

export default App;
