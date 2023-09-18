import { useLocation } from "react-router-dom";
import React from "react";

export function useUrlQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}
