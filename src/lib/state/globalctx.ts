import {
  createContextId,
  useContext,
  useContextProvider,
  useStore
} from "@builder.io/qwik";

export interface GlobalState {
  user: null | { id: string; name: string };
  theme: "light" | "dark";
}

const GlobalCtx = createContextId<GlobalState>("global-state");

/**
 * Dipanggil SATU KALI di root/layout
 */
export const provideGlobalState = () => {
  const store = useStore<GlobalState>({
    user: null,
    theme: "dark",
  });

  useContextProvider(GlobalCtx, store);
};

/**
 * Dipanggil di component mana saja
 */
export const useGlobalState = () => {
  return useContext(GlobalCtx);
};
