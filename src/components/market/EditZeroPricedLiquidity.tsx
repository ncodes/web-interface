import { useState } from "react";
import useMarketContract from "../../hooks/services/contracts/useMarketContract.ts";
import { useToast } from "../../hooks/toast/toast.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { delay, isDev } from "../../libs/helpers.ts";
import { EditRow } from "./EditRow.tsx";
import { EditFieldWithLabel } from "./EditFieldWithLabel.tsx";
import { Switch } from "../ui/switch.tsx";
import { Button } from "../ui/Button.tsx";
import IconSpinner from "../icons/IconSpinner.tsx";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";

export function EditZeroPricedLiquidity({
  market,
  close,
}: {
  market: Market;
  close?: () => void;
}) {
  const [checked, setChecked] = useState(market.enabledZeroOfferPrice);
  const { getChainInfo } = useConnectorContext();
  const { allowZeroOfferPrice, humanizeErrors } = useMarketContract();
  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError } = useToast();
  const queryClient = useQueryClient();

  const doWrite = async () => {
    try {
      setLoading(true);
      const txHash = await allowZeroOfferPrice(market.address);
      const blockExplorer = getChainInfo().blockExplorer;
      await delay(5000);
      notifySuccess("Successfully enabled zero price mode", {
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
    <EditRow
      title="Zero Priced Liquidity"
      tip="Allow liquidity providers to add liquidity with zero price. This is useful for offers where price is determined after a bargaining process."
    >
      <div className="flex flex-col gap-2">
        <EditFieldWithLabel
          label={<div className={"w-auto"}>Allow Zero Price</div>}
          tip="Allow liquidity providers to add liquidity with zero price. This is useful for offer-only markets where price is determined after a bargaining process."
        >
          <Switch
            checked={checked}
            disabled={loading}
            onCheckedChange={(value) => {
              if (market.enabledZeroOfferPrice) return;
              setChecked(value);
            }}
          />
        </EditFieldWithLabel>
        {!market.enabledZeroOfferPrice && (
          <Button
            onClick={doWrite}
            size="sm"
            disabled={loading || market.enabledZeroOfferPrice || !checked}
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
