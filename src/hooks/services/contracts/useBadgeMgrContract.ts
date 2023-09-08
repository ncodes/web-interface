import { useConnectorContext } from "../../connectors/context.tsx";
import {
  GrantSigInfo,
  NewGrantValues,
} from "../backend/useInstructionsService.ts";
import { TransactionExecutionError } from "viem";

/**
 * Providers utilities for reading and writing to the badge manager contract
 */
export default function useBadgeMgrContract() {
  const { readContract, simulateAndWriteContract } = useConnectorContext();

  /**
   * Load instructions from IPFS
   * @param address  The address of the grantee
   */
  async function loadInstruction(
    address: string
  ): Promise<Instructions | undefined> {
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
  async function updateInstruction(sigInfo: GrantSigInfo) {
    if (sigInfo.isNew) {
      const values = sigInfo.values as NewGrantValues;
      return simulateAndWriteContract("badgeManager", "grantBadgeBySig", [
        ...values,
        sigInfo.sig,
      ]);
    } else {
      const values = sigInfo.values as NewGrantValues;
      return simulateAndWriteContract(
        "badgeManager",
        "upsertGranteeMetaBySig",
        [...values, sigInfo.sig]
      );
    }
  }

  /**
   * Parse transaction error into human-friendly message
   * @param error The error object
   */
  function humanizeErrors(error: { message: string } | unknown) {
    const execError = error instanceof TransactionExecutionError;
    if (execError && error.message.includes("User rejected the request")) {
      return "Transaction was rejected";
    }
    return "Transaction failed";
  }

  return {
    loadInstruction,
    updateInstruction,
    humanizeErrors,
  };
}
