import moment from "moment/moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../../hooks/store/useStore.ts";
import { useUrlQuery } from "../../hooks/useUrlQuery.ts";
import { rmUndefinedAndNull } from "../../libs/helpers.ts";
import Calendar2 from "../Calendar2.tsx";
import { FilterItem } from "../FilterItem.tsx";
import Input2 from "../Input2.tsx";
import ScrollOverflowIndicator from "../ScrollOverflowIndicator.tsx";
import Select2 from "../Select2.tsx";
import { Button } from "../ui/Button.tsx";
import { Accordion } from "../ui/accordion.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import { SelectItem } from "../ui/select.tsx";

interface Values {
  market?: string;
  creator?: string;
  order?: string;
  dispute?: string;
  status?: string;
  from_date?: string;
  to_date?: string;
}

export function DisputeFilterContent() {
  const query = useUrlQuery();
  const navigate = useNavigate();
  const { setDisputeFilter, disputeFilter } = useStore((state) => ({
    setDisputeFilter: state.setDisputeFilter,
    disputeFilter: state.disputeFilter,
  }));
  const [values, setValues] = useState<Values>({
    order: "",
  });

  // Load filter fields default values from market filter in store
  useEffect(() => {
    if (Object.keys(disputeFilter).length === 0) return;

    let update = { ...values };

    update = {
      ...update,
      market: disputeFilter?.marketAddress || "",
      creator: disputeFilter?.creator || "",
      order: disputeFilter?.orderId?.toString() || "",
      dispute: disputeFilter?.disputeId?.toString() || "",
      status: disputeFilter?.status || "",
      from_date: disputeFilter?.fromDate
        ? moment(disputeFilter.fromDate).toDate().toLocaleDateString("en-US")
        : "",
      to_date: disputeFilter?.toDate
        ? moment(disputeFilter.toDate).toDate().toLocaleDateString("en-US")
        : "",
    };

    setValues(update);
  }, [disputeFilter]);

  // Build filter from query params
  useEffect(() => {
    const filter: Partial<DisputeFilter> = {};
    filter.marketAddress = query.get("market") as string;
    filter.creator = query.get("creator") as string;
    filter.orderId = query.get("order")
      ? parseInt(query.get("order") || "")
      : undefined;
    filter.disputeId = query.get("dispute")
      ? parseInt(query.get("dispute") || "")
      : undefined;
    filter.status = query.get("status") as string;
    filter.fromDate = moment(
      query.get("from_date") as string,
      "MM/DD/YYYY",
    ).toISOString();
    filter.toDate = moment(
      query.get("to_date") as string,
      "MM/DD/YYYY",
    ).toISOString();

    setDisputeFilter && setDisputeFilter(filter);
  }, [query, setDisputeFilter]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <ScrollOverflowIndicator side="bottom" className="h-full">
          <ScrollArea
            type="scroll"
            viewportClassName="absolute xl:relative"
            className="h-full relative"
          >
            <Accordion type="multiple">
              <FilterItem
                title="By Creator"
                tip="Find disputes created by an address"
              >
                <Input2
                  type="text"
                  placeholder="e.g. 0x0..."
                  className="pl-2"
                  value={values.creator || ""}
                  onChange={(e) => {
                    setValues({ ...values, creator: e.target.value });
                  }}
                />
              </FilterItem>

              <FilterItem
                title="By Market ID"
                tip="Find disputes by their market address or ID"
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
                title="By Order ID"
                tip="Find disputes by their order ID"
              >
                <Input2
                  type="number"
                  placeholder="e.g. 1234"
                  className="pl-2 !w-6/12"
                  value={values.order}
                  onChange={(e) => {
                    setValues({
                      ...values,
                      order: e.target.value,
                    });
                  }}
                />
              </FilterItem>

              <FilterItem title="By Dispute ID" tip="Find a dispute by its ID">
                <Input2
                  type="number"
                  placeholder="e.g. 323"
                  className="pl-2 !w-6/12"
                  value={values.dispute}
                  onChange={(e) => {
                    setValues({
                      ...values,
                      dispute: e.target.value,
                    });
                  }}
                />
              </FilterItem>

              <FilterItem
                title="Status"
                tip="Find disputes based on their current status"
              >
                <div className="mr-1 w-full">
                  <Select2
                    value={values.status || ""}
                    placeholder="All"
                    className="w-[160px]"
                    triggerClassName="w-full"
                    onValueChange={(val) => {
                      setValues({ ...values, status: val });
                    }}
                  >
                    <>
                      <SelectItem value="">All</SelectItem>
                      <SelectItem value="draft">Draft Phase</SelectItem>
                      <SelectItem value="undraft">Undraft Phase</SelectItem>
                      <SelectItem value="evidence">Evidence Phase</SelectItem>
                      <SelectItem value="commit">Commit Phase</SelectItem>
                      <SelectItem value="reveal">Reveal Phase</SelectItem>
                      <SelectItem value="released">Released</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="stalled">Stalled</SelectItem>
                      <SelectItem value="redispute">Redisputed</SelectItem>
                      <SelectItem value="executed">Executed</SelectItem>
                    </>
                  </Select2>
                </div>
              </FilterItem>

              <FilterItem
                title="Date Range"
                tip="Find disputes created within a certain date range"
              >
                <div className="flex w-full gap-3">
                  <div className="flex flex-1 flex-col gap-2 tracking-wide">
                    <div className="text-xs text-gray-400 font-light">
                      From Date:
                    </div>
                    <Calendar2
                      className="w-full"
                      defaultValue={
                        values.from_date
                          ? new Date(values.from_date)
                          : undefined
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
                    <div className="text-xs text-gray-400 font-light">
                      To Date:
                    </div>
                    <Calendar2
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
          </ScrollArea>
        </ScrollOverflowIndicator>
      </div>
      <div className="p-5">
        <Button
          size="full"
          variant="outline"
          onClick={() => {
            const cloned = { ...values };
            navigate({
              pathname: "/my/disputes",
              search: new URLSearchParams(
                rmUndefinedAndNull(cloned, true),
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
