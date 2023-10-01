import { useContext } from "react";
import { IConnector } from "./useConnector.tsx";
import { ConnectorContext } from "./context.tsx";

export function useConnectorContext() {
  return useContext<IConnector>(ConnectorContext);
}
