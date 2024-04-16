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
    <Dialog defaultOpen={open} modal={true} open={open}>
      <DialogContent className="bg-modal-background border-modal-border w-[400px] top-[25%] ring-0 outline-0 shadow-md shadow-gray-800">
        <DialogHeader>
          <DialogDescription>
            <div>
              <div className="flex text-[17px] items-center gap-2 tracking-wide text-chinese-green">
                <span>
                  <AlertTriangle width="19" />
                </span>
                <span>Disclaimer</span>
              </div>
              <div className=" text-gray-300 tracking-wide font-light relative top-1 pt-2">
                <>
                  Joint is an unaudited smart contract platform that carries
                  inherent contract, security, as well, as market risk.
                  Interacting with this version of Joint is at your own risk;
                  There may be bugs as well as other risk.
                  <br />
                  <br />
                  By clicking "Confirm", you agree to these risks.
                  <br />
                  <br />
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        localStorage.setItem("auditWarningConfirmed", "true");
                        setOpen(false);
                      }}
                    >
                      Confirm
                    </Button>
                  </div>
                </>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
