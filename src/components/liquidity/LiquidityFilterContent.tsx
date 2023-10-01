import { useUrlQuery } from "../../hooks/useUrlQuery.ts";
import { useLocation, useNavigate } from "react-router-dom";
import useStore, { LiquidityFilter } from "../../hooks/store/useStore.ts";
import { useEffect, useState } from "react";
import { isTrue, rmUndefinedAndNull } from "../../libs/helpers.ts";
import { Accordion } from "../ui/accordion.tsx";
import { FilterItem } from "../FilterItem.tsx";
import { cn } from "../../libs/utils.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select.tsx";
import { validators } from "tailwind-merge";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group.tsx";
import { ToolTip } from "../ToolTip.tsx";
import { Label } from "../ui/label.tsx";
import { Button } from "../ui/Button.tsx";
import Input2 from "../Input2.tsx";
import { useSheetInfo } from "../../hooks/useSheetInfo.ts";
import { ScrollArea } from "../ui/scroll-area.tsx";
import ScrollOverflowIndicator from "../ScrollOverflowIndicator.tsx";
import { usePaymentService } from "../../hooks/services/backend/usePaymentService.ts";
import { useQuery } from "@tanstack/react-query";
import { PaymentMethodSelector } from "./PaymentMethodSelector.tsx";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";

interface Errors {
  price?: string;
  liquidity?: string;
}

interface Values {
  base?: string;
  quote?: string;
  market?: string;
  price_cur?: string;
  price?: string;
  price_lte?: string;
  amt_cur?: string;
  amt?: string;
  amt_lte?: string;
  provider?: string;
  kyc_lp?: string;
  kyc_taker?: string;
  swap_badges?: string;
  payment_method?: string;
}

export function LiquidityFilterContent({ ownerMode }: { ownerMode?: boolean }) {
  const [sheetHeight] = useSheetInfo();
  const query = useUrlQuery();
  const navigate = useNavigate();
  const location = useLocation();
  const { setLiquidityFilter, liquidityFilter } = useStore((state) => ({
    setLiquidityFilter: state.setLiquidityFilter,
    liquidityFilter: state.liquidityFilter,
  }));
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Errors>({});
  const [openPayMethodSelector, setOpenPayMethodSelector] = useState(false);
  const [selectedPayMethod, setSelectedPayMethod] = useState<
    PaymentMethod | undefined
  >(undefined);
  const { getChainInfo } = useConnectorContext();
  const { getPaymentMethods } = usePaymentService();

  const payMethods = useQuery({
    queryKey: ["getPaymentMethods", { network: getChainInfo().queryName }],
    queryFn: getPaymentMethods,
  });

  // Load filter fields default values from liquidity filter in store
  useEffect(() => {
    if (Object.keys(liquidityFilter).length === 0) return;

    let update = { ...values };

    if (liquidityFilter.priceUsd) {
      const op = liquidityFilter.priceUsd.startsWith(">") ? ">" : "<";
      const price = liquidityFilter.priceUsd.replace(">", "").replace("<", "");
      update = {
        ...update,
        price_cur: "USD",
        price: price,
        price_lte: op == "<" ? "lower" : "higher",
      };
    } else {
      update = {
        ...update,
        price_cur: "USD",
        price: "",
        price_lte: "lower",
      };
    }

    if (liquidityFilter.amountUsd) {
      const op = liquidityFilter.amountUsd.startsWith(">") ? ">" : "<";
      const liq = liquidityFilter.amountUsd.replace(">", "").replace("<", "");
      update = {
        ...update,
        amt_cur: "USD",
        amt: liq,
        amt_lte: op == "<" ? "lower" : "higher",
      };
    } else {
      update = {
        ...update,
        amt_cur: "USD",
        amt: "",
        amt_lte: "lower",
      };
    }

    update = {
      ...update,
      base: liquidityFilter?.base || "",
      quote: liquidityFilter?.quote || "",
      kyc_lp: liquidityFilter?.kycLp?.toString() || "",
      kyc_taker: liquidityFilter?.kycTaker?.toString() || "",
      provider: liquidityFilter?.provider?.toString() || "",
      market: liquidityFilter?.market || "",
      swap_badges: liquidityFilter?.swapBadges || "",
      payment_method: liquidityFilter.paymentMethods
        ? liquidityFilter.paymentMethods
        : "",
    };

    setValues(update);
  }, [liquidityFilter]);

  useEffect(() => {
    if (selectedPayMethod) return;
    if (!payMethods.data) return;
    setSelectedPayMethod(
      payMethods.data.find((m) => m.badge == values.payment_method)
    );
  }, [payMethods.data]);

  // Build filter from query params
  useEffect(() => {
    const filter: Partial<LiquidityFilter> = {};

    const priceCur = query.get("price_cur") || "USD";
    const price = query.get("price");
    const priceLTE = query.get("price_lte") || "lower";
    if (price && priceCur == "USD") {
      filter.priceUsd = price;
      const op = priceLTE == "lower" ? "<" : ">";
      filter.priceUsd = op + filter.priceUsd;
    } else filter.priceUsd = undefined;

    const amtCur = query.get("amt_cur") || "USD";
    const amt = query.get("amt");
    const liqLTE = query.get("amt_lte") || "lower";
    if (amt && amtCur == "USD") {
      filter.amountUsd = amt;
      const op = liqLTE == "lower" ? "<" : ">";
      filter.amountUsd = op + filter.amountUsd;
    } else filter.amountUsd = undefined;

    filter.kycLp = query.get("kyc_lp")
      ? isTrue(query.get("kyc_lp") as string)
      : undefined;

    filter.kycTaker = query.get("kyc_taker")
      ? isTrue(query.get("kyc_taker") as string)
      : undefined;

    filter.market = query.get("market") as string;

    filter.provider = query.get("provider") as string;

    filter.swapBadges = query.get("swap_badges") as string;

    filter.base = query.get("base") as string;

    filter.quote = query.get("quote") as string;

    filter.paymentMethods = query.get("payment_method") as string;

    setLiquidityFilter && setLiquidityFilter(filter);
  }, [query, setLiquidityFilter]);

  function isLoading(): boolean {
    return payMethods.isLoading && !payMethods.isFetched;
  }

  return (
    <div>
      <ScrollOverflowIndicator side="bottom">
        <ScrollArea type="scroll" className={cn(sheetHeight)}>
          <Accordion type="multiple">
            <FilterItem
              title="Base"
              tip="Find liquidities matching the base token address or symbol"
              className={cn({
                hidden: location.pathname.includes("/market/"),
              })}
            >
              <Input2
                type="text"
                placeholder="e.g. 0x0..."
                className="pl-2"
                value={values.base || ""}
                onChange={(e) => {
                  setValues({ ...values, base: e.target.value });
                }}
              />
            </FilterItem>
            <FilterItem
              title="Quote"
              tip="Find liquidities matching the quote token address or symbol"
              className={cn({
                hidden: location.pathname.includes("/market/"),
              })}
            >
              <Input2
                type="text"
                placeholder="e.g. 0x0..."
                className="pl-2"
                value={values.quote || ""}
                onChange={(e) => {
                  setValues({ ...values, quote: e.target.value });
                }}
              />
            </FilterItem>
            <FilterItem
              title="By Market ID"
              tip="Find a market by its address or ID"
              className={cn({
                hidden: location.pathname.includes("/market/"),
              })}
            >
              <Input2
                type="text"
                placeholder="e.g. 0x0..."
                className="pl-2"
                value={values.market || ""}
                onChange={(e) => {
                  setValues({ ...values, market: e.target.value });
                }}
              />
            </FilterItem>

            <FilterItem
              title="By Creator"
              tip="Find a market by its creator's address"
              className={cn({ hidden: ownerMode })}
            >
              <Input2
                type="text"
                placeholder="e.g. 0x0..."
                className="pl-2"
                value={values.provider || ""}
                onChange={(e) => {
                  setValues({ ...values, provider: e.target.value });
                }}
              />
            </FilterItem>
            <FilterItem
              title="Quote Price"
              tip="Filter by price (QUOTE)"
              className={cn({ hidden: !values.market })}
            >
              <div>
                <Input2
                  placeholder="0.00"
                  className="w-[100px] px-2 pl-0"
                  value={values.price || ""}
                  onChange={(e) => {
                    setValues({ ...values, price: e.target.value });
                    if (validators.isNumber(e.target.value)) {
                      setErrors({ price: "" });
                    } else {
                      setErrors({ price: "Must be a number" });
                    }
                  }}
                  beforeInput={
                    <div className="w-[50px] ml-[5px]">
                      <Select
                        value={values.price_cur || "USD"}
                        onValueChange={(cur) => {
                          setValues({ ...values, price_cur: cur });
                        }}
                      >
                        <SelectTrigger className="border-none focus:border-0 focus:ring-0 data-[state=open]:border-none">
                          <SelectValue placeholder="$" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">$</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  }
                  err={errors.price}
                />
              </div>
              <div className="flex-1 px-3 flex">
                <RadioGroup
                  className="flex flex-1 items-center gap-3"
                  value={values.price_lte}
                  onValueChange={(value) => {
                    setValues({
                      ...values,
                      price_lte: value,
                    });
                  }}
                >
                  <ToolTip tip={"Less than or equal to the amount"}>
                    <span className="flex items-center gap-2">
                      <RadioGroupItem value="lower" id="lower" />
                      <Label
                        htmlFor="lower"
                        className="font-light tracking-wider"
                      >
                        {"<="}
                      </Label>
                    </span>
                  </ToolTip>
                  <ToolTip tip={"Greater than or equal to the amount"}>
                    <span className="flex items-center gap-2">
                      {" "}
                      <RadioGroupItem value="higher" id="higher" />
                      <Label
                        htmlFor="higher"
                        className="font-light tracking-wider"
                      >
                        {">="}
                      </Label>
                    </span>
                  </ToolTip>
                </RadioGroup>
              </div>
            </FilterItem>

            <FilterItem
              title="Available Liquidity"
              tip="Find liquidities with certain amount of available liquidity"
              className={cn({ hidden: values.market })}
            >
              <div>
                <Input2
                  className="w-[100px] px-2 pl-0"
                  placeholder="0.00"
                  value={values.amt || ""}
                  onChange={(e) => {
                    setValues({ ...values, amt: e.target.value });
                    if (validators.isNumber(e.target.value)) {
                      setErrors({ liquidity: "" });
                    } else {
                      setErrors({ liquidity: "Must be a number" });
                    }
                  }}
                  beforeInput={
                    <div className="w-[50px] ml-[5px]">
                      <Select
                        value={values.amt_cur || "USD"}
                        onValueChange={(cur) => {
                          setValues({ ...values, amt_cur: cur });
                        }}
                      >
                        <SelectTrigger className="border-none focus:border-0 focus:ring-0 data-[state=open]:border-none">
                          <SelectValue placeholder="$" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">$</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  }
                  err={errors.liquidity}
                />
              </div>
              <div className="flex-1 px-3 flex">
                <RadioGroup
                  className="flex flex-1 items-center gap-3"
                  value={values.amt_lte}
                  onValueChange={(value) => {
                    setValues({
                      ...values,
                      amt_lte: value,
                    });
                  }}
                >
                  <ToolTip tip={"Less than or equal to the amount"}>
                    <span className="flex items-center gap-2">
                      <RadioGroupItem value="lower" id="lower" />
                      <Label
                        htmlFor="lower"
                        className="font-light tracking-wider"
                      >
                        {"<="}
                      </Label>
                    </span>
                  </ToolTip>
                  <ToolTip tip={"Greater than or equal to the amount"}>
                    <span className="flex items-center gap-2">
                      {" "}
                      <RadioGroupItem value="higher" id="higher" />
                      <Label
                        htmlFor="higher"
                        className="font-light tracking-wider"
                      >
                        {">="}
                      </Label>
                    </span>
                  </ToolTip>
                </RadioGroup>
              </div>
            </FilterItem>

            <FilterItem
              title="Payment Method"
              tip="Find liquidities that accept a specific payment method"
              className={cn({ hidden: values.market })}
            >
              <PaymentMethodSelector
                contentClassName="!ml-0"
                triggerClassName={cn(
                  "border-solid border-card-border hover:border-card-border pl-4",
                  {
                    "!border-chinese-green ring-2 ring-chinese-green":
                      openPayMethodSelector,
                  }
                )}
                open={openPayMethodSelector}
                setOpen={setOpenPayMethodSelector}
                isLoading={isLoading()}
                selected={selectedPayMethod}
                payMethods={payMethods.data}
                setSelected={(method) => {
                  setSelectedPayMethod(method);
                  setValues({ ...values, payment_method: method.badge });
                }}
              />
            </FilterItem>

            <FilterItem
              title="KYC'D LP"
              tip="Find liquidities where liquidity providers have completed KYC"
              className={cn({ hidden: ownerMode })}
            >
              <RadioGroup
                value={values.kyc_lp || "false"}
                className="flex flex-1 gap-3"
                onValueChange={(value) => {
                  setValues({
                    ...values,
                    kyc_lp: (value === "true").toString(),
                  });
                }}
              >
                <span className="flex items-center gap-2">
                  <RadioGroupItem value="false" id="no" />
                  <Label htmlFor="all" className="font-light tracking-wider">
                    No
                  </Label>
                </span>
                <span className="flex items-center gap-2">
                  {" "}
                  <RadioGroupItem value="true" id="yes" />
                  <Label htmlFor="yes" className="font-light tracking-wider">
                    Yes
                  </Label>
                </span>
              </RadioGroup>
            </FilterItem>

            <FilterItem
              title="KYC'D Takers"
              tip="Find liquidities where takers have completed KYC"
              className={cn({ hidden: ownerMode })}
            >
              <RadioGroup
                value={values.kyc_taker || "false"}
                className="flex flex-1 gap-3"
                onValueChange={(value) => {
                  setValues({
                    ...values,
                    kyc_taker: (value === "true").toString(),
                  });
                }}
              >
                <span className="flex items-center gap-2">
                  <RadioGroupItem value="false" id="no" />
                  <Label htmlFor="all" className="font-light tracking-wider">
                    No
                  </Label>
                </span>
                <span className="flex items-center gap-2">
                  {" "}
                  <RadioGroupItem value="true" id="yes" />
                  <Label htmlFor="yes" className="font-light tracking-wider">
                    Yes
                  </Label>
                </span>
              </RadioGroup>
            </FilterItem>

            <FilterItem
              title="SWAP Badges"
              className="border-none"
              tip="Find liquidities that require takers to have one or more badges"
            >
              <RadioGroup defaultValue="false" className="flex flex-1 gap-3">
                <Input2
                  type="text"
                  placeholder="e.g kyc, bitcoiner"
                  className="pl-2"
                  value={values.swap_badges || ""}
                  onChange={(e) => {
                    setValues({ ...values, swap_badges: e.target.value });
                  }}
                />
              </RadioGroup>
            </FilterItem>
          </Accordion>
        </ScrollArea>
      </ScrollOverflowIndicator>
      <div className="px-5 py-5 border-t border-gray-800">
        <Button
          size="full"
          onClick={() => {
            const cloned = { ...values };
            if (!cloned.price) {
              delete cloned.price_lte;
              delete cloned.price_cur;
            }

            if (!cloned.amt) {
              delete cloned.amt_lte;
              delete cloned.amt_cur;
            }

            navigate({
              pathname: location.pathname,
              search: new URLSearchParams(
                rmUndefinedAndNull(cloned, true)
              ).toString(),
            });
          }}
        >
          Filter
        </Button>
      </div>
    </div>
  );
}
