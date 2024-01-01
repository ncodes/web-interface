import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import useMarketContract from "../../hooks/services/contracts/useMarketContract.ts";
import { useToast } from "../../hooks/useToast.tsx";
import {
  delay,
  logError,
  splitAndCleanBadges,
  splitBadgeFromPath,
} from "../../libs/helpers.ts";
import IconSpinner from "../icons/IconSpinner.tsx";
import { Button } from "../ui/Button.tsx";
import { EditFieldWithLabel } from "./EditFieldWithLabel.tsx";
import { EditRow } from "./EditRow.tsx";

export function EditBadgeRequirements({
  market,
  close,
}: {
  market: Market;
  close?: () => void;
}) {
  const { getChainInfo } = useConnectorContext();
  const { notifySuccess, notifyError } = useToast();
  const queryClient = useQueryClient();
  const { setRequiredBadges, humanizeErrors } = useMarketContract();
  const [err, setErr] = useState("");
  const [err2, setErr2] = useState("");
  const [loading, setLoading] = useState(false);
  const [putBadges, setPutBadges] = useState(
    market.requiredPutBadges.join(","),
  );
  const [swapBadges, setSwapBadges] = useState(
    market.requiredSwapBadges.join(","),
  );

  const doWrite = async () => {
    try {
      setLoading(true);
      const txHash = await setRequiredBadges(
        market.address,
        splitBadgeFromPath(splitAndCleanBadges(putBadges)),
        splitBadgeFromPath(splitAndCleanBadges(swapBadges)),
      );
      const blockExplorer = getChainInfo().blockExplorer;
      await delay(5000);
      notifySuccess("Successfully updated badge requirement", {
        duration: 5000,
        links: [
          { label: "View Transaction", href: `${blockExplorer}/tx/${txHash}` },
        ],
      });
      queryClient.refetchQueries(["getMarketsByCreator"]).catch(logError);
      close && close();
    } catch (error) {
      const msg = humanizeErrors(error);
      notifyError(msg);
      logError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <EditRow
      title="Badge Rules"
      tip="Specify required badges liquidity providers or takers must have to trade in this market. Up to 8 badges can be specified."
    >
      <div className="flex flex-col gap-2">
        <EditFieldWithLabel
          value={putBadges}
          disabled={loading}
          label={<div>LP</div>}
          labelWrapperClassName="w-[60px]"
          tip="Specify up to 8 badges that liquidity providers must have to trade in this market. Separate badges with a comma."
          placeholder="ex: kyc, merchant"
          onChange={(e) => {
            const val = e.target.value;
            if (splitAndCleanBadges(val).length > 8)
              setErr("Too many badges (max: 8)");
            else setErr("");
            setPutBadges(val);
          }}
          err={err}
        />
        <EditFieldWithLabel
          value={swapBadges}
          disabled={loading}
          label={<div>Taker</div>}
          labelWrapperClassName="w-[60px]"
          tip="Specify up to 8 badges that takers must have to trade in this market. Separate badges with a comma."
          placeholder="ex: kyc, merchant"
          onChange={(e) => {
            const val = e.target.value;
            if (splitAndCleanBadges(val).length > 8)
              setErr2("Too many badges (max: 8)");
            else setErr2("");
            setSwapBadges(val);
          }}
          err={err2}
        />
        <Button
          size="sm"
          className="mt-2"
          onClick={doWrite}
          disabled={
            loading ||
            err.length > 0 ||
            (market.requiredPutBadges.join(",") == putBadges &&
              market.requiredSwapBadges.join(",") == swapBadges)
          }
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
      </div>
    </EditRow>
  );
}
