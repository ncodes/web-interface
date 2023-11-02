import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import { handleAxiosError } from "../../../libs/helpers.ts";
import { useConnectorContext } from "../../connectors/useConnectorContext.tsx";
import { GrantSigInfo } from "./useInstructionsService.ts";

export interface GetPaymentMethodsParams {
  network: string;
}

export interface GetPaymentMethodGrantSignatureParams {
  network: string;
  badge: string;
  address: string;
  liquidityAddress: string;
  disable?: boolean;
}

/**
 * usePaymentService provides access to v1/payments endpoints
 */
export function usePaymentService() {
  const { getChainInfo } = useConnectorContext();

  /**
   * Get payment methods
   * @param ctx - The query function context
   */
  async function getPaymentMethods(
    ctx: QueryFunctionContext<[string, GetPaymentMethodsParams]>
  ): Promise<PaymentMethod[]> {
    try {
      const [, params] = ctx.queryKey;
      const { network } = params;
      const resp = await axios({
        method: "get",
        url: `${getChainInfo().apiUrl}/v1/payments/methods`,
        params: {
          net: "ethereum" || network, // TODO: remove mock
        },
      });
      return Promise.resolve(resp.data.data);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Get payment method grant signature
   * @param ctx - The query function context
   */
  async function getPaymentMethodGrantSignature(
    ctx: QueryFunctionContext<[string, GetPaymentMethodGrantSignatureParams]>
  ): Promise<GrantSigInfo> {
    try {
      const [, params] = ctx.queryKey;
      const { network } = params;
      const resp = await axios({
        method: "get",
        url: `${getChainInfo().apiUrl}/v1/payments/methods/grant-signature`,
        params: {
          net: "ethereum" || network, // TODO: remove mock
          badge: params.badge,
          address: params.address,
          liquidityAddress: params.liquidityAddress,
          disable: params.disable ? "true" : "false",
        },
      });
      return Promise.resolve(resp.data.data);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  return {
    getPaymentMethods,
    getPaymentMethodGrantSignature,
  };
}
