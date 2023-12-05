interface HistoryInfo {
  type: "market";
  marketAddress: string;
}

/**
 * Manage search history.
 * This hook is backed by localStorage.
 * @param network The network to use
 * @returns
 */
function useSearchHistory(network: string) {
  function makeKey() {
    return `search-history:${network}`;
  }

  /**
   * Get the search history
   * @returns
   */
  function get(): HistoryInfo[] {
    return JSON.parse(localStorage.getItem(makeKey()) || "[]");
  }

  /**
   * Add a search history
   * @param history The history to add
   */
  function add(history: HistoryInfo) {
    const current = get();
    localStorage.setItem(
      makeKey(),
      JSON.stringify([
        history,
        ...current.filter((h) => h.marketAddress !== history.marketAddress),
      ])
    );
  }

  return {
    add,
    get,
  };
}

export default useSearchHistory;
