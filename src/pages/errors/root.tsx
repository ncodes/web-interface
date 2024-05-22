import { AlertCircle } from "lucide-react";
import { useRouteError } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Error404 } from "./Error404";

export function RootErrorBoundary() {
  const error = useRouteError() as { status: number } | Error;

  if (error instanceof Error) {
    return (
      <div className="bg-black w-screen h-screen flex justify-center items-center text-gray-100 font-light">
        <div className="border p-5 rounded-2xl border-gray-700 shadow-md shadow-gray-800">
          <span className="flex items-center gap-2">
            <AlertCircle size="20" className="text-red-600" />
            <span>{error.message}</span>
          </span>
          <Button
            className="mt-4 w-full"
            onClick={() => {
              history.back();
            }}
          >
            Go back
          </Button>
        </div>
      </div>
    );
  }

  if (error.status === 404) {
    return <Error404 />;
  }

  return (
    <div className="bg-black w-screen h-screen flex justify-center items-center text-gray-100 font-light">
      <div className="border p-5 rounded-2xl border-gray-700 shadow-md shadow-gray-800">
        <span className="flex items-center gap-2">
          <span>Page Not Found</span>
        </span>
        <Button
          className="mt-4 w-full"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}
