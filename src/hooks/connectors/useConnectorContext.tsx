import { useContext } from "react";
import { ConnectorContext } from "./context.tsx";
import { IConnector } from "./interface.ts";

export function useConnectorContext() {
  return useContext<IConnector>(ConnectorContext);
}
