import { Dialog, DialogClose } from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { SettingsIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useBalance } from "wagmi";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext";
import useBondCurveDistroContract from "../../hooks/services/contracts/useBondCurveTokenContract";
import { useToast } from "../../hooks/useToast";
import {
  delay,
  formatToHighDenom,
  formatToMoney,
  logError,
  toDec,
  toHD,
  toLD,
  trimZeros,
} from "../../libs/helpers";
import Input2 from "../Input2";
import IconSpinner from "../icons/IconSpinner";
import { Button } from "../ui/Button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/Dialog";
import { Label } from "../ui/label";
import { BuyBanner } from "./BuyBanner";

const AllowSwap = true;

export function BondingCurveSwapper() {
  const { address } = useConnectorContext();
  const [slippage, setSlippage] = useState<number>(1);
  const {
    getBuyPrice,
    buy,
    getBondCurveAllocation,
    getTotalBought,
    humanizeErrors,
  } = useBondCurveDistroContract();
  const [buyPrice, setBuyPrice] = useState<bigint>(0n);
  const [amount, setAmount] = useState<string>("");
  const [bondCurveAllocation, setBondCurveAllocation] = useState<bigint>(0n);
  const { notifyError, notifySuccess } = useToast();
  const [loading, setLoading] = useState(false);
  const balance = useBalance({
    address: address as `0x${string}`,
  });

  const getTotalBoughtQry = useQuery({
    queryKey: ["getTotalBought"],
    queryFn: () => getTotalBought(),
  });

  useEffect(() => {
    getBuyPrice().then((price) => {
      setBuyPrice(price);
    });
    getBondCurveAllocation().then((allocation) => {
      setBondCurveAllocation(allocation);
    });
  }, [loading, amount]);

  function canSwap() {
    if (!AllowSwap) return false;
    const amt = toDec(amount || "0");
    const output = amt.mul(10 ** 18).div(toDec(buyPrice));
    return (
      !loading &&
      amt.gt(0) &&
      amt.lte(toHD(balance.data?.value.toString() || "0")) &&
      output.lte(toHD(bondCurveAllocation.toString() || "0"))
    );
  }

  async function handleSwap() {
    if (!buyPrice || !amount) return;
    try {
      setLoading(true);
      const actualBuyPrice = toDec(buyPrice).add(
        toDec(buyPrice).mul(slippage / 100),
      );

      await buy(BigInt(toLD(amount)), BigInt(actualBuyPrice.toFixed(0)));
      await delay(5000);
      notifySuccess("Swap was successful");
      setLoading(false);
      setAmount("0");
    } catch (error) {
      setLoading(false);
      const msg = humanizeErrors(error);
      notifyError(msg, { duration: 5000 });
      logError(error);
    }
  }

  function computeOutputAmount() {
    return toDec(amount || "0").div(toDec(buyPrice).div(10 ** 18));
  }

  return (
    <>
      <BuyBanner />
      <div className="w-[300px] xs:w-[350px] mt-10 lg:mt-20 h-auto bg-card-background bg-gradient-to-t from-card-background to-card-background/30 rounded-xl border border-card-border/20">
        <header className="flex gap-2 border-b border-card-border/30">
          <div className="rounded-lg text-center rounded-b-none w-full p-2 font-silkscreen">
            Liquidity Market
          </div>
        </header>

        <div className="flex flex-col m-1 rounded-lg bg-yellow-400 text-gray-900 font-light text-xs p-2">
          <span className="text-sm font-silkscreen">Swap ETH for JOIN</span>
          <ul className="list-outside list-disc pl-3.5 text-yellow-950">
            <li>You get more JOIN and contribute to liquidity.</li>
            <li>Buy up to 0.03 ETH to reset DexDrop allocation.</li>
          </ul>
        </div>

        <section className="p-2">
          <div className="flex justify-between">
            <Label className="text-sm text-gray-500 font-light">Amount</Label>
            <Button variant="link" className="p-0 h-auto">
              <span className="text-xs font-light">
                <Dialog>
                  <DialogTrigger asChild>
                    <span className="flex gap-1 items-center">
                      <span className="text-gray-400">
                        Slippage:{" "}
                        <span className="text-gray-200">
                          {trimZeros(slippage.toFixed(2))}%
                        </span>
                      </span>
                      <span>
                        <SettingsIcon className="w-4 h-4 text-gray-400" />
                      </span>
                    </span>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] p-0 bg-modal-background border-modal-border mt-[15%]">
                    <DialogHeader>
                      <DialogTitle className="text-gray-200 p-4">
                        Set Slippage
                        <DialogClose className="absolute right-4 top-4" asChild>
                          <Button variant="link" className="p-0 h-auto">
                            <XIcon className="w-4 h-4 text-gray-400" />
                          </Button>
                        </DialogClose>
                      </DialogTitle>
                      <DialogDescription className="p-4 pt-0 text-gray-300 font-light tracking-wide">
                        Enter the maximum amount of slippage you are willing to
                        accept.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 px-4">
                      <Input2
                        placeholder="0.00"
                        type="number"
                        containerClassName="w-[100px] text-gray-200"
                        value={slippage.toString()}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value > 25) {
                            setSlippage(25);
                          } else if (value < 1) {
                            setSlippage(0);
                          } else {
                            setSlippage(value);
                          }
                        }}
                      />
                      {slippage > 4 && (
                        <div className=" m-1 rounded-lg  text-yellow-400 border border-yellow-400 font-light text-xs p-2">
                          Setting slippage too high may result in bots
                          front-running your swap transaction.
                        </div>
                      )}
                    </div>
                    <DialogFooter className="p-4 !flex-col">
                      <DialogClose asChild>
                        <Button type="submit">Update</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </span>
            </Button>
          </div>

          <Input2
            placeholder="0.00"
            containerClassName="mt-2"
            type="number"
            value={amount}
            step={0.01}
            disabled={loading || !AllowSwap}
            onChange={(e) => {
              setAmount(e.target.value || "");
            }}
            focusedClassName="border-gray-300 ring-gray-300 ring-1"
            afterInput={
              <div className="flex items-center justify-center mr-2">
                <img
                  src="https://files.joint.exchange/images/eth.svg"
                  alt="caution"
                  className="w-7 h-7"
                />
              </div>
            }
            after={
              <span className="flex pl-3 pb-1 text-gray-300 text-xs font-light">
                Bal: {balance.data?.formatted}
              </span>
            }
          />

          <div className="flex gap-2 pt-3 ">
            <Button
              className="font-light border-none text-xs bg-gray-800 px-2 py-0.5 h-auto rounded-lg"
              variant="outline"
              onClick={() => setAmount("0.1")}
              disabled={!AllowSwap}
            >
              0.1 ETH
            </Button>
            <Button
              className="font-light border-none text-xs bg-gray-800 px-2 py-0.5 h-auto rounded-lg"
              variant="outline"
              onClick={() => setAmount("0.5")}
              disabled={!AllowSwap}
            >
              0.5 ETH
            </Button>
            <Button
              className="font-light border-none text-xs bg-gray-800 px-2 py-0.5 h-auto rounded-lg"
              variant="outline"
              onClick={() => setAmount("1")}
              disabled={!AllowSwap}
            >
              1 ETH
            </Button>
          </div>
          <div className=" flex font-light text-xs gap-2 mt-2 pt-2">
            <span className="text-gray-500">Price: </span>
            <span className="text-gray-400 select-text">
              {toDec(buyPrice || "0")
                .div(10 ** 18)
                .toFixed()}
              {" ETH"}
            </span>
          </div>
          {!toDec(amount || "0").isZero() && (
            <div className="flex font-light text-xs gap-2 pt-2">
              <span className="text-gray-500">Output: </span>
              <span className="text-gray-400 select-text">
                {formatToMoney(computeOutputAmount().toFixed())}
                {" JOIN"}
              </span>
            </div>
          )}
          <div className="mt-4">
            <span className="text-xs text-gray-400 font-extralight block text-center mb-2">
              Opens on Dec 2nd, 2024.
            </span>

            <Button
              size="full"
              className="rounded-lg bg-green-500/90 text-white hover:bg-green-500 gap-1"
              disabled={!canSwap()}
              onClick={handleSwap}
            >
              {loading && (
                <IconSpinner className="w-4 h-4 text-gray-100 animate-spin" />
              )}
              {loading ? "Swapping..." : "Swap"}
            </Button>
          </div>
        </section>
      </div>
      <div className=" pt-0 mb-5">
        <div className="w-[300px] p-3 xs:w-[350px] mt-3 h-auto bg-card-background bg-gradient-to-t from-card-background to-card-background/30 rounded-xl border border-card-border/20">
          <div className="flex flex-col items-center justify-center">
            <span className="text-xs text-gray-400 tracking-wide block text-center">
              Total Swapped (JOIN)
            </span>
            <span className="font-silkscreen -tracking-widest">
              {formatToHighDenom(getTotalBoughtQry.data || BigInt(0))}
            </span>
          </div>
        </div>
        <span className="block text-xs text-center mt-2 text-gray-500 font-light tracking-wider">
          By clicking Swap, you agree to our{" "}
          <a
            href="https://jointlabs.notion.site/Terms-of-Service-3e470a80a33b4c76aa50bbb95801a82e?pvs=4"
            className="text-xs text-gray-400  hover:text-gray-300"
          >
            Terms
          </a>
          .
        </span>
      </div>
    </>
  );
}
