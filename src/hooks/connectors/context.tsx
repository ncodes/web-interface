import { createContext, useContext } from "react";
import { IConnector } from "./useConnector";

export const ConnectorContext = createContext<IConnector>({} as IConnector);

export function useConnectorContext() {
  return useContext<IConnector>(ConnectorContext);
}
