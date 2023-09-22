import { EditRow } from "./EditRow.tsx";
import { Button } from "../ui/Button.tsx";
import { delay, isDev } from "../../libs/helpers.ts";
import { useConnectorContext } from "../../hooks/connectors/context.tsx";
import useMarketContract from "../../hooks/services/contracts/useMarketContract.ts";
import { useState } from "react";
import IconCaution from "../icons/IconCaution.tsx";
import { useToast } from "../../hooks/toast/toast.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { isAddress } from "viem";
import IconSpinner from "../icons/IconSpinner.tsx";
import Input2 from "../Input2.tsx";

export function EditMarketManager({
  market,
  close,
}: {
  market: Market;
  close?: () => void;
}) {
  const { getChainInfo } = useConnectorContext();
  const { setManager, humanizeErrors } = useMarketContract();
  const [address, setAddress] = useState(market.manager || "");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { notifySuccess, notifyError } = useToast();
  const queryClient = useQueryClient();

  const doWrite = async () => {
    try {
      setLoading(true);
      const txHash = await setManager(market.address, address);
      const blockExplorer = getChainInfo().blockExplorer;
      await delay(5000);
      notifySuccess("Successfully updated market manager", {
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
      title="Market Manager"
      tip="Market managers can force trades to be released or cancelled. Setting a manager disables on-chain dispute resolution."
    >
      <div>
        <div className="w-full flex gap-4">
          <Input2
            type="text"
            value={address}
            disabled={loading}
            className="px-3 py-4"
            spellCheck={false}
            placeholder="Enter an address (ex: 0xAbC...)"
            onChange={(e) => {
              setAddress(e.target.value);
            }}
            onBlur={(e) => {
              if (e.target.value && !isAddress(e.target.value))
                setErr("Invalid address");
              else setErr("");
            }}
            afterInput={
              <div className="pr-1">
                <Button
                  onClick={doWrite}
                  disabled={loading || err.length > 0 || address.length == 0}
                  size="sm"
                  rounded="xl"
                  className="mt-[1px]"
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
            }
          />
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
