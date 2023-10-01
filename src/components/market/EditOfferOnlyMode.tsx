import { EditRow } from "./EditRow.tsx";
import { EditFieldWithLabel } from "./EditFieldWithLabel.tsx";
import { Switch } from "../ui/switch.tsx";
import { useState } from "react";
import useMarketContract from "../../hooks/services/contracts/useMarketContract.ts";
import { useToast } from "../../hooks/toast/toast.tsx";
import { useQueryClient } from "@tanstack/react-query";
import IconSpinner from "../icons/IconSpinner.tsx";
import { Button } from "../ui/Button.tsx";
import { delay, isDev } from "../../libs/helpers.ts";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";

export function EditOfferOnlyMode({
  market,
  close,
}: {
  market: Market;
  close?: () => void;
}) {
  const [checked, setChecked] = useState(market.offerOnly);
  const { getChainInfo } = useConnectorContext();
  const { markAsOfferOnly, humanizeErrors } = useMarketContract();
  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError } = useToast();
  const queryClient = useQueryClient();

  const doWrite = async () => {
    try {
      setLoading(true);
      const txHash = await markAsOfferOnly(market.address);
      const blockExplorer = getChainInfo().blockExplorer;
      await delay(5000);
      notifySuccess("Successfully enabled market-only mode", {
        duration: 5000,
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
    <EditRow title="Offer Mode" tip="Update the market's dispute parameters">
      <div className="flex flex-col gap-3">
        <EditFieldWithLabel
          label={<div className={"w-auto"}>Enable Offer Only mode</div>}
          tip="Make the market offer-only. This means swaps can only be initiated through offers to liquidity providers. Note: This cannot be undone."
        >
          <Switch
            checked={checked}
            disabled={loading}
            onCheckedChange={(value) => {
              if (market.offerOnly) return;
              setChecked(value);
            }}
          />
        </EditFieldWithLabel>
        {!market.offerOnly && (
          <Button
            onClick={doWrite}
            size="sm"
            disabled={loading || market.offerOnly || !checked}
          >
            {!loading && <>Update</>}
            {loading && (
              <>
                <IconSpinner
                  width="20"
                  fill="fill-[#06060c]"
                  className="animate-spin"
                />
              </>
            )}
          </Button>
        )}
      </div>
    </EditRow>
  );
}
