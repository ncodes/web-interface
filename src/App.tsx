import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import ConnectorProvider from "./hooks/connectors/components/ConnectorProvider.tsx";
import { ReactElement } from "react";

type AppProps = {
  page: ReactElement;
};

function App({ page }: AppProps) {
  const queryClient = new QueryClient();

  return (
    <ConnectorProvider
      appName={import.meta.env.NEXT_PUBLIC_APP_NAME}
      infuraId={import.meta.env.NEXT_PUBLIC_INFURA_ID}
    >
      <QueryClientProvider client={queryClient}>
        <Toaster containerStyle={{ top: 80 }} />
        {page}
      </QueryClientProvider>
    </ConnectorProvider>
  );
}

export default App;
