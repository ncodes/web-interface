import { useState } from "react";
import { useConnectorContext } from "../../hooks/connectors/context.tsx";
import useMarketContract from "../../hooks/services/contracts/useMarketContract.ts";
import { EditRow } from "./EditRow.tsx";
import { EditFieldWithLabelAndSlider } from "./EditFieldWithLabelAndSlider.tsx";
import { Button } from "../ui/Button.tsx";
import { useToast } from "../../hooks/toast/toast.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { isDev } from "../../libs/helpers.ts";
import IconSpinner from "../icons/IconSpinner.tsx";

export function EditDisputeDurations({ market }: { market: Market }) {
  const [disputeDelayDur, setDisputeDelayDur] = useState(
    market.disputeDelayDur
  );
  const [evidenceDur, setEvidenceDur] = useState(market.evidenceDur);
  const [votingDur, setVotingDur] = useState(market.predictDur);
  const { getChainInfo } = useConnectorContext();
  const { setDisputeDurations, humanizeErrors } = useMarketContract();
  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError } = useToast();
  const queryClient = useQueryClient();

  const doWrite = async () => {
    try {
      setLoading(true);
      const txHash = await setDisputeDurations(
        market.address,
        disputeDelayDur,
        evidenceDur,
        votingDur
      );
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

  function formatSec(seconds: number) {
    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30; // Approximate months as 30 days
    const year = day * 365; // Approximate years as 365 days

    let time: string;

    if (seconds < minute) {
      time = Math.round(seconds) + "s";
    } else if (seconds < hour) {
      time = Math.round(seconds / minute) + "m";
    } else if (seconds < day) {
      time = Math.round(seconds / hour) + "h";
    } else if (seconds < month) {
      time = Math.round(seconds / day) + "d";
    } else if (seconds < year) {
      time = Math.round(seconds / month) + "mo";
    } else {
      time = Math.round(seconds / year) + "y";
    }

    return time;
  }

  return (
    <EditRow
      title="Dispute Durations"
      tip="Update the market's dispute related durations"
    >
      <div className="flex flex-col gap-2">
        <EditFieldWithLabelAndSlider
          type="number"
          className="mb-2"
          label={<>Dispute Delay</>}
          tip="The number of seconds to wait before initiating a dispute after a trade is marked as paid."
          value={disputeDelayDur}
          slideMin={300}
          slideMax={86400}
          suffix={formatSec(disputeDelayDur)}
          onChange={(value) => {
            setDisputeDelayDur(parseFloat(value) || 0);
          }}
        />

        <EditFieldWithLabelAndSlider
          type="number"
          className="mb-2"
          label={<>Evidence Duration</>}
          tip="The number of seconds within which dispute evidece must be collected and analyzing by mediators"
          value={evidenceDur}
          slideMin={1800}
          slideMax={172800}
          suffix={formatSec(evidenceDur)}
          onChange={(value) => {
            setEvidenceDur(parseFloat(value) || 0);
          }}
        />

        <EditFieldWithLabelAndSlider
          type="number"
          className="mb-2"
          label={<>Voting Duration</>}
          tip="The of seconds within which dispute mediators must vote and reach a verdict. Half of the time is for vote committing and the other half is for vote revealing."
          value={votingDur}
          slideMin={1800}
          slideMax={172800}
          suffix={formatSec(votingDur)}
          onChange={(value) => {
            setVotingDur(parseFloat(value) || 0);
          }}
        />

        <Button size="sm" className="mt-2" onClick={doWrite} disabled={loading}>
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
    </EditRow>
  );
}
