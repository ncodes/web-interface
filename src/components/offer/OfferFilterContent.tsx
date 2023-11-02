import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore, { SwapFilter } from "../../hooks/store/useStore.ts";
import { useUrlQuery } from "../../hooks/useUrlQuery.ts";
import { rmUndefinedAndNull } from "../../libs/helpers.ts";
import { FilterItem } from "../FilterItem.tsx";
import { CalendarInput } from "../swap/CalendarInput.tsx";
import { Button } from "../ui/Button.tsx";
import { Input } from "../ui/Input.tsx";
import { Accordion } from "../ui/accordion.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select.tsx";

interface Values {
  creator?: string;
  provider?: string;
  market?: string;
  status?: string;
  from_date?: string;
  to_date?: string;
}

export function OfferFilterContent() {
  const query = useUrlQuery();
  const navigate = useNavigate();
  const { setOfferFilter, offerFilter } = useStore((state) => ({
    setOfferFilter: state.setOfferFilter,
    offerFilter: state.offerFilter,
  }));
  const [values, setValues] = useState<Values>({});

  // Load filter fields default values from market filter in store
  useEffect(() => {
    if (Object.keys(offerFilter).length === 0) return;

    const update = {
      ...values,
      market: offerFilter?.marketAddress || "",
      status: offerFilter?.status || "",
      from_date: offerFilter?.fromDate
        ? moment(offerFilter.fromDate).toDate().toLocaleDateString("en-US")
        : "",
      to_date: offerFilter?.toDate
        ? moment(offerFilter.toDate).toDate().toLocaleDateString("en-US")
        : "",
    };

    setValues(update);
  }, [offerFilter]);

  // Build filter from query params
  useEffect(() => {
    const filter: Partial<SwapFilter> = {};
    filter.base = query.get("base") as string;
    filter.quote = query.get("quote") as string;
    filter.marketAddress = query.get("market") as string;
    filter.type = query.get("type") as string;
    filter.status = query.get("status") as string;
    filter.fromDate = moment(
      query.get("from_date") as string,
      "MM/DD/YYYY"
    ).toISOString();
    filter.toDate = moment(
      query.get("to_date") as string,
      "MM/DD/YYYY"
    ).toISOString();

    setOfferFilter && setOfferFilter(filter);
  }, [query, setOfferFilter]);

  return (
    <div>
      <Accordion type="multiple">
        <FilterItem title="Offerer" tip="Find offers from a certain address">
          <Input
            type="text"
            placeholder="e.g. 0x0..."
            className="pl-2 transition-all duration-500 hover:scale-x-[1.01] focus:scale-x-[1.01]"
            value={values.creator || ""}
            onChange={(e) => {
              setValues({ ...values, creator: e.target.value });
            }}
          />
        </FilterItem>
        <FilterItem
          title="By Market ID"
          tip="Find offers from a specific market matching the given address"
        >
          <Input
            type="text"
            placeholder="e.g. 0x0..."
            className="pl-2  transition-all duration-500 hover:scale-x-[1.01] focus:scale-x-[1.01]"
            value={values.market || ""}
            onChange={(e) => {
              setValues({ ...values, market: e.target.value });
            }}
          />
        </FilterItem>

        <FilterItem
          title="Status"
          tip="Find swaps based on their current status"
        >
          <div className="mr-1">
            <Select
              value={values.status || ""}
              onValueChange={(val) => {
                setValues({ ...values, status: val });
              }}
            >
              <SelectTrigger className="w-[120px] transition-all duration-500 hover:border-chinese-green hover:scale-x-105 data-[state=open]:border-chinese-green data-[state=open]:scale-x-105 focus:scale-x-105">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="executed">Executed</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </FilterItem>

        <FilterItem
          title="Date Range"
          tip="Find swaps created within a certain date range"
        >
          <div className="flex w-full gap-3">
            <div className="flex flex-1 flex-col gap-2 tracking-wide">
              <div className="text-xs text-gray-400 font-light">From Date:</div>
              <CalendarInput
                className="w-full"
                defaultValue={
                  values.from_date ? new Date(values.from_date) : undefined
                }
                onSelect={(date) => {
                  setValues({
                    ...values,
                    from_date: date.toLocaleDateString("en-US"),
                  });
                }}
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 tracking-wide">
              <div className="text-xs text-gray-400 font-light">To Date:</div>
              <CalendarInput
                className="w-full"
                defaultValue={
                  values.to_date ? new Date(values.to_date) : undefined
                }
                onSelect={(date) => {
                  setValues({
                    ...values,
                    to_date: date.toLocaleDateString("en-US"),
                  });
                }}
              />
            </div>
          </div>
        </FilterItem>
      </Accordion>
      <div className="px-5 py-5">
        <Button
          size="full"
          variant="outline"
          onClick={() => {
            const cloned = { ...values };
            navigate({
              pathname: "/my/offers",
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
