import { createContext, useContext } from "react";
import { IConnector } from "./useConnector";

export const ConnectorContext = createContext<IConnector | null>(null);

export function useConnectorContext() {
  return useContext<IConnector | null>(ConnectorContext);
}
