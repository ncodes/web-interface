import { ReactElement, useState } from "react";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import { useToast } from "../../hooks/useToast.tsx";
import { isDev, toHDD, toLD } from "../../libs/helpers.ts";
import Input2 from "../Input2.tsx";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";
import IconSpinner from "../icons/IconSpinner.tsx";
import { Button } from "../ui/Button.tsx";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card.tsx";

export function BalanceCard(props: {
  symbol?: string;
  balance: string;
  hideHelp?: boolean;
  children?: ReactElement;
}) {
  return (
    <Card className="w-full shrink-0 border border-card-border/70 border-b-gray-700 bg-card-background shadow-gray-900 shadow-lg">
      <CardHeader className="p-0">
        <CardTitle className="text-center p-0 tracking-wider font-normal h-0 pt-3 float-right">
          {!props.hideHelp && (
            <IconInfoCircle className="float-right relative -top-1 -left-2 z-10 cursor-pointer text-card-icon/80 hover:text-card-icon transition-all duration-500" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 p-0 pb-3 relative text-gray-200 text-[15px] text-center  tracking-wider">
        <span className="relative font-light text-chinese-green text-[15px]">
          {props.symbol}
        </span>
        <p>{props.balance}</p>
      </CardContent>
      {props.children && (
        <CardFooter className="border-t border-card-border/50  py-0 px-0 font-light text-sm text-center">
          {props.children}
        </CardFooter>
      )}
    </Card>
  );
}

export function NativeTokenWrapper({
  title,
  wrap,
  curBalance,
  onDone,
}: {
  title: string;
  wrap: boolean;
  curBalance: bigint;
  onDone?: () => void;
}) {
  const [activated, setActivated] = useState(false);
  const [amount, setAmount] = useState("");
  const {
    sendTransaction,
    withdrawWrappedToken,
    getChainInfo,
    humanizeErc20Errors,
  } = useConnectorContext();
  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError } = useToast();

  function isReady() {
    if (parseFloat(amount || "0") <= 0) return false;
    if (toHDD(curBalance).lessThan(amount)) return false;
    return true;
  }

  async function doAction() {
    try {
      const netInfo = getChainInfo();
      if (!netInfo || !netInfo.wrappedTokenInfo?.address) return;

      setLoading(true);

      if (wrap) {
        await sendTransaction(
          netInfo.wrappedTokenInfo?.address,
          BigInt(toLD(amount))
        );
      } else {
        await withdrawWrappedToken(BigInt(toLD(amount)));
      }

      setAmount("");
      setActivated(false);
      onDone && onDone();

      notifySuccess(wrap ? "Wrap was successful" : "Unwrap was successful", {
        duration: 5000,
      });
    } catch (error) {
      const msg = humanizeErc20Errors(error);
      notifyError(msg);
      if (isDev()) console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (activated)
    return (
      <Input2
        containerClassName="m-1 !rounded-lg border-none"
        className="h-full text-gray-100 font-normal"
        placeholder="Enter amount"
        value={amount}
        disabled={loading}
        onChange={(e) => setAmount(e.target.value)}
        afterInput={
          <div className="flex items-center gap-2">
            <div>
              <Button
                variant="ghost"
                disabled={loading}
                className="p-0 h-auto text-gray-400 text-[10px] hover:bg-transparent hover:text-chinese-green"
                onClick={() => {
                  setAmount(toHDD(curBalance).toString());
                }}
              >
                Max
              </Button>
            </div>
            <Button
              variant="default"
              disabled={!isReady() || loading}
              size="sm"
              rounded="xl"
              className="mr-1"
              onClick={doAction}
            >
              {!loading && (wrap ? "Wrap" : "Unwrap")}
              {loading && (
                <>
                  <IconSpinner
                    width="20"
                    className="animate-spin"
                    fill="fill-gray-900"
                  />
                </>
              )}
            </Button>
          </div>
        }
      />
    );

  return (
    <Button
      variant="ghost"
      className="w-full text-center rounded-none rounded-b-xl hover:bg-gray-800  md:block text-gray-400 border-gray-600"
      onClick={() => setActivated(true)}
      disabled={curBalance == BigInt(0)}
    >
      <a
        href="#"
        className="hover:text-[15px] hover:text-gray-100 transition-all duration-300"
      >
        {title}
      </a>
    </Button>
  );
}
