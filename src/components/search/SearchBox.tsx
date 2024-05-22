import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import { useMarketService } from "../../hooks/services/backend/useMarketService.ts";
import { cn } from "../../libs/utils.ts";
import { SearchContent } from "./SearchContent.tsx";

export default function SearchBox({
  children,
  open: op,
  onOpen,
  query: qry,
}: {
  children: React.ReactElement;
  open?: boolean;
  onOpen?: (open: boolean) => void;
  query?: string;
}) {
  const [open, setOpen] = useState(op);
  const { listMarkets } = useMarketService();
  const { getChainInfo } = useConnectorContext();
  const [query, setQuery] = useState(qry);
  const queryClient = useQueryClient();

  useEffect(() => {
    setQuery(qry);
  }, [qry]);

  useEffect(() => {
    setOpen(op);
  }, [op]);

  useEffect(() => {
    if (!query) return;
    queryClient.refetchQueries({ queryKey: ["searchMarkets"] });
  }, [query]);

  const queryResult = useQuery({
    queryKey: [
      "searchMarkets",
      {
        network: getChainInfo().queryName,
        marketFilter: { query },
        limit: 5,
        offset: 0,
      },
    ],
    queryFn: listMarkets,
    enabled: !!query,
  });

  return (
    <div className="z-[30]">
      {open && (
        <div
          className="fixed w-full h-full top-0 left-0 right-0"
          onClick={() => {
            setOpen(!open);
            onOpen && onOpen(!open);
          }}
        />
      )}
      <div className="md:relative">
        <div>{children}</div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ scale: 1.05, opacity: 0, display: "hidden" }}
              animate={{
                opacity: 1,
                display: "block",
                scale: 1.05,
                transition: { delay: 0.1, ease: "easeInOut" },
              }}
              exit={{
                opacity: 0,
                display: "block",
                scale: 1,
                transition: { delay: 0, ease: "easeInOut" },
              }}
              className={cn(
                "overflow-hidden absolute bg-card-background md:w-[500px] xl:w-full min-h-[70px] border border-gray-700 ring-chinese-green rounded-xl mt-4",
              )}
            >
              <SearchContent
                renderInput={true}
                onQueryChange={(value) => setQuery(value)}
                queryResult={queryResult.data?.markets}
                queryLoading={
                  (queryResult.isLoading &&
                    queryResult.fetchStatus != "idle") ||
                  queryResult.isRefetching
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
