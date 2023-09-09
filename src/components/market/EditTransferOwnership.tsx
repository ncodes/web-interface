import { EditRow } from "./EditRow.tsx";
import { Input } from "../ui/Input.tsx";
import { Button } from "../ui/Button.tsx";
import { useConnectorContext } from "../../hooks/connectors/context.tsx";
import useMarketContract from "../../hooks/services/contracts/useMarketContract.ts";
import { useState } from "react";
import { useToast } from "../../hooks/toast/toast.tsx";
import { useQueryClient } from "@tanstack/react-query";
import IconCaution from "../icons/IconCaution.tsx";
import { isAddress } from "viem";
import IconSpinner from "../icons/IconSpinner.tsx";
import { isDev } from "../../libs/helpers.ts";

export function EditTransferOwnership({
  market,
  close,
}: {
  market: Market;
  close: () => void;
}) {
  const { getChainInfo } = useConnectorContext();
  const { transferOwnership, humanizeErrors } = useMarketContract();
  const [loading, setLoading] = useState(false);
  const [newOwner, setNewOwner] = useState("");
  const [err, setErr] = useState("");
  const { notifySuccess, notifyError } = useToast();
  const queryClient = useQueryClient();

  const doWrite = async () => {
    try {
      setLoading(true);
      const txHash = await transferOwnership(market.address, newOwner);
      const blockExplorer = getChainInfo().blockExplorer;
      notifySuccess("Successfully transferred ownership", {
        duration: 10000,
        links: [
          { label: "View Transaction", href: `${blockExplorer}/tx/${txHash}` },
        ],
      });
      queryClient.refetchQueries(["getMarketsByCreator"]).catch(console.error);
      close && close();
    } catch (error) {
      const msg = humanizeErrors(error);
      notifyError(msg);
      if (isDev()) console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <EditRow
      title="Transfer Ownership"
      tip="Transfer ownership of the market to another account. Future commisions will be sent to the new owner. This cannot be undone."
    >
      <div>
        <div className="w-full flex gap-4">
          <Input
            type="text"
            className="px-3 py-4"
            value={newOwner}
            disabled={loading}
            spellCheck={false}
            placeholder="Enter an address (ex: 0xAbC...)"
            onChange={(e) => {
              setNewOwner(e.target.value);
            }}
            onBlur={(e) => {
              if (e.target.value && !isAddress(e.target.value))
                setErr("Invalid address");
              else setErr("");
            }}
          />
          <Button
            onClick={doWrite}
            disabled={loading || err.length > 0 || newOwner.length == 0}
            size="sm"
            variant="destructive"
          >
            {!loading && <>Transfer</>}
            {loading && (
              <>
                <IconSpinner
                  width="20"
                  stopColor="#FFFFFF"
                  className="animate-spin"
                />
              </>
            )}
          </Button>
        </div>
        {err.length > 0 && (
          <div className="text-xs font-light mt-2 tracking-wide text-red-500 flex gap-1">
            <IconCaution width="15px" fillA="#ed4f41" /> {err}
          </div>
        )}
      </div>
    </EditRow>
  );
}
