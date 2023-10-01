import { createContext } from "react";
import { IConnector } from "./useConnector";

export const ConnectorContext = createContext<IConnector>({} as IConnector);
