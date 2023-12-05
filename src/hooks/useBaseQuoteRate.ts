import { useQuery } from "@tanstack/react-query";
import { isERC20, isSynth } from "../libs/api_utils.ts";
import { useMiscService } from "./services/backend/useMiscService.ts";

import { useConnectorContext } from "./connectors/useConnectorContext.tsx";

export function useBaseQuoteRate(
  { base, baseType, baseAddress, quoteAddress, quote, quoteType }: Market,
  baseEnabled: boolean,
  quoteEnabled: boolean,
) {
  const { getCryptoRate, getSynthRate } = useMiscService();
  const { getChainInfo } = useConnectorContext();

  const baseUsdRate = useQuery({
    queryKey: [
      "getBaseRate",
      {
        net: getChainInfo().queryName,
        symbolOrAddress: baseAddress,
        symbol: base,
      },
    ],
    queryFn: isERC20(baseType)
      ? getCryptoRate
      : isSynth(baseType)
        ? getSynthRate
        : getCryptoRate,
    refetchInterval: 60000,
    enabled: baseEnabled,
  });

  const quoteUsdRate = useQuery({
    queryKey: [
      "getQuoteRate",
      {
        net: getChainInfo().queryName,
        symbolOrAddress: quoteAddress,
        symbol: quote,
      },
    ],
    queryFn: isERC20(quoteType)
      ? getCryptoRate
      : isSynth(quoteType)
        ? getSynthRate
        : getCryptoRate,
    refetchInterval: 60000,
    enabled: quoteEnabled,
  });

  return {
    baseUsdRate,
    quoteUsdRate,
  };
}
