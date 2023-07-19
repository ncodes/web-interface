import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import ConnectorProvider from "./hooks/connectors/components/ConnectorProvider.tsx";
import { ReactElement } from "react";
import LoadingBar from "react-top-loading-bar";
import useStore from "./hooks/store/useStore.ts";

type AppProps = {
  page: ReactElement;
};

function App({ page }: AppProps) {
  const queryClient = new QueryClient();
  const loaderProgress = useStore((state) => state.loaderProgress);
  const setLoaderProgress = useStore((state) => state.setLoaderProgress);

  return (
    <ConnectorProvider
      appName={import.meta.env.NEXT_PUBLIC_APP_NAME}
      infuraId={import.meta.env.NEXT_PUBLIC_INFURA_ID}
    >
      <QueryClientProvider client={queryClient}>
        <Toaster containerStyle={{ top: 30 }} />
        <LoadingBar
          color="#C8ED5A"
          progress={loaderProgress}
          onLoaderFinished={() => setLoaderProgress && setLoaderProgress(0)}
        />
        {page}
      </QueryClientProvider>
    </ConnectorProvider>
  );
}

export default App;
