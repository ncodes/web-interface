import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/Button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "./ui/Dialog.tsx";

export default function AuditStatusNotice() {
  const [open, setOpen] = useState(
    localStorage.getItem("auditWarningConfirmed") !== "true",
  );

  return (
    <Dialog defaultOpen={open} modal open={open}>
      <DialogContent className="bg-modal-background border-gray-700 mx-2 md:mx-0 md:w-[400px] top-[25%] ring-0 outline-0 shadow-sm shadow-gray-800">
        <DialogHeader>
          <DialogDescription className="text-left">
            <div className="flex text-[17px] items-center gap-2 tracking-wide text-chinese-green">
              <span>
                <AlertTriangle width="18" />
              </span>
              <span className="font-jersey10 text-2xl tracking-wider">
                Disclaimer
              </span>
            </div>
          </DialogDescription>
          <div className="text-left text-sm text-gray-300 tracking-wide font-light relative top-1  [&_a]:text-chinese-green">
            The current deployment of Joint (the "Trialnet") is an unaudited
            smart contract platform that carries inherent contract, security, as
            well, as market risk. Interacting with this version of Joint is at
            your own risk; There may be bugs as well as other risk.
            <br />
            <br />
            By clicking "Confirm", you agree to these risks to our{" "}
            <a href="https://jntl.ink/tos">terms of service</a> and{" "}
            <a href="https://jntl.ink/privacy-policy">privacy policy</a>.
            <br />
            <br />
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="full"
                rounded="xl"
                className="hover:border-chinese-green"
                onClick={() => {
                  localStorage.setItem("auditWarningConfirmed", "true");
                  setOpen(false);
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
