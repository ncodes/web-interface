import create from 'zustand';
import { createContext } from 'react';

export const StoreContext = createContext(null);

export interface IStore {
}

export default function useStore() {
  return create<IStore>(() => ({
  }));
}
