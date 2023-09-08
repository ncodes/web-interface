import { EditRow } from "./EditRow.tsx";
import { Input } from "../ui/Input.tsx";
import { Button } from "../ui/Button.tsx";
import useMarketContract from "../../hooks/services/contracts/useMarketContract.ts";
import { useState } from "react";
import IconCaution from "../icons/IconCaution.tsx";
import { useToast } from "../../hooks/toast/toast.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { isDev } from "../../libs/helpers.ts";
import { useConnectorContext } from "../../hooks/connectors/context.tsx";
import IconSpinner from "../icons/IconSpinner.tsx";

export function EditCommission(props: { market: Market }) {
  const { getChainInfo } = useConnectorContext();
  const { setCommission: write, humanizeErrors } = useMarketContract();
  const [loading, setLoading] = useState(false);
  const [commission, setCommission] = useState(
    (props.market.commission || 0) / 100
  );
  const [commissionErr, setCommissionErr] = useState("");
  const { notifySuccess, notifyError } = useToast();
  const queryClient = useQueryClient();

  const doWrite = async () => {
    try {
      setLoading(true);
      const txHash = await write(props.market.address, commission * 100);
      const blockExplorer = getChainInfo().blockExplorer;
      notifySuccess("Successfully created a market", {
        duration: 10000,
        links: [
          { label: "View Transaction", href: `${blockExplorer}/tx/${txHash}` },
        ],
      });
      queryClient.refetchQueries(["getMarkets"]).catch(console.error);
    } catch (error) {
      const msg = humanizeErrors(error);
      notifyError(msg);
      if (isDev()) console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <EditRow title="Commission" tip="Update the market's commission">
      <div className="w-full flex gap-4">
        <Input
          type="number"
          className="px-3 py-4"
          value={commission}
          disabled={loading}
          onChange={(e) => {
            setCommission(parseFloat(e.target.value || ""));
            if (e.target.value == undefined) return;
            if (parseFloat(e.target.value) > 30) {
              setCommissionErr("Commission must be less than 30%");
            } else {
              setCommissionErr("");
            }
          }}
        />
        <Button
          size="sm"
          onClick={doWrite}
          disabled={loading || commissionErr.length > 0}
        >
          {!loading && <>Update</>}
          {loading && (
            <>
              <IconSpinner
                width="20"
                stopColor="#06060c"
                className="animate-spin"
              />
            </>
          )}
        </Button>
      </div>
      {commissionErr.length > 0 && (
        <div className="text-xs font-light mt-2 tracking-wide text-red-500 flex gap-1">
          <IconCaution width="15px" fillA="#ed4f41" /> {commissionErr}
        </div>
      )}
    </EditRow>
  );
}
