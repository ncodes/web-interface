import { Button } from "../../components/ui/Button";

export function Error404() {
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
          {" "}
          Back to Home
        </Button>
      </div>
    </div>
  );
}
