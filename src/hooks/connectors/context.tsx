import { createContext } from "react";
import { IConnector } from "./interface";

export const ConnectorContext = createContext<IConnector>({} as IConnector);
