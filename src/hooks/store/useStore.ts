import create from "zustand";
import { createContext } from "react";

export const StoreContext = createContext<IStore | null>(null);

export interface IStore {}

export default function useStore() {
  return create<IStore>(() => ({}));
}
