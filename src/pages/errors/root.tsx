import { useRouteError } from "react-router-dom";

export function RootErrorBoundary() {
  const error = useRouteError() as { status: number } | Error;

  if (error instanceof Error) {
    return <span>{error.message}</span>;
  }

  if (error.status === 404) {
    return <span>Page Not Found</span>;
  }

  return <span>Error</span>;
}
