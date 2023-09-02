import { useConnectorContext } from "../connectors/context.tsx";
import {
  GrantSigInfo,
  NewGrantValues,
} from "../services/backend/useInstructionsService.ts";
import { TransactionExecutionError } from "viem";

/**
 * Providers utilities for managing instructions
 */
export default function useInstructions() {
  const { readContract, writeContract } = useConnectorContext();

  /**
   * Load instructions from IPFS
   * @param address  The address of the grantee
   */
  async function load(address: string): Promise<Instructions | undefined> {
    const hasBadge = await readContract<boolean>("badgeManager", "hasBadge", [
      address,
      import.meta.env.VITE_INSTRUCTION_BADGE,
      "",
    ]);

    if (!hasBadge) return;

    const cid = await readContract<string>(
      "badgeManager",
      "getGranteeMetaValue",
      [import.meta.env.VITE_INSTRUCTION_BADGE, "", address, "hash"]
    );

    try {
      const gateway = import.meta.env.VITE_IPFS_GATEWAY;
      return await fetch(`${gateway}/${cid}`).then(async (res) => {
        return await res.json();
      });
    } catch (error) {
      return;
    }
  }

  /**
   * Create a new instruction badge from a signature
   * @param sigInfo The signature info
   */
  async function update(sigInfo: GrantSigInfo) {
    if (sigInfo.isNew) {
      const values = sigInfo.values as NewGrantValues;
      return await writeContract("badgeManager", "grantBadgeBySig", [
        ...values,
        sigInfo.sig,
      ]);
    } else {
      const values = sigInfo.values as NewGrantValues;
      return await writeContract("badgeManager", "upsertGranteeMetaBySig", [
        ...values,
        sigInfo.sig,
      ]);
    }
  }

  /**
   * Parse transaction error
   * @param error The error object
   */
  function parseError(error: { message: string } | unknown) {
    // prettier-ignore
    if (error instanceof TransactionExecutionError && error.message.includes("User rejected the request")) {
      return "Transaction was rejected";
    }
    return "Transaction failed";
  }

  return {
    load,
    update,
    parseError,
  };
}
