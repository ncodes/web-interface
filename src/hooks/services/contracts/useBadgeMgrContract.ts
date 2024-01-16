import { TransactionExecutionError } from 'viem';
import { useConnectorContext } from '../../connectors/useConnectorContext.tsx';
import { GrantSigInfo, NewGrantValues } from '../backend/useInstructionsService.ts';

/**
 * Providers utilities for reading and writing to the badge manager contract
 */
export default function useBadgeMgrContract() {
	const { readContract, simulateAndWriteContract } = useConnectorContext();

	/**
	 * Load instructions from IPFS
	 * @param address  The address of the grantee
	 */
	async function loadInstruction(address: string): Promise<Instructions | undefined> {
		const hasBadge = await readContract<boolean>('badgeManager', 'hasBadge', [
			address,
			import.meta.env.VITE_INSTRUCTION_BADGE,
			'',
		]);

		if (!hasBadge) return;

		const cid = await readContract<string>('badgeManager', 'getGranteeMetaValue', [
			import.meta.env.VITE_INSTRUCTION_BADGE,
			'',
			address,
			'hash',
		]);

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
	 * Create a new badge or upset the metadata of the existing badge using a signature from the issuer
	 * @param sigInfo The signature info
	 */
	async function grantNewOrUpsetBadgeMetaBySig(sigInfo: GrantSigInfo) {
		if (sigInfo.isNew) {
			const values = sigInfo.values as NewGrantValues;
			const res = await simulateAndWriteContract('badgeManager', 'grantBadgeBySig', [...values, sigInfo.sig]);
			return res[0];
		} else {
			const values = sigInfo.values as NewGrantValues;
			const res = await simulateAndWriteContract('badgeManager', 'upsertGranteeMetaBySig', [...values, sigInfo.sig]);
			return res[0];
		}
	}

	/**
	 * Check if an address has been granted a badge
	 * @param address The address to check
	 * @param badge The badge to check
	 * @param path The path of the badge
	 */
	async function hasBadge(address: string, badge: string, path: string) {
		return await readContract<boolean>('badgeManager', 'hasBadge', [address, badge, path]);
	}

	/**
	 * Get the metadata value of a badge
	 * @param address The address of the grantee
	 * @param badge The badge to check
	 * @param path The path of the badge
	 * @param key The key of the metadata
	 */
	async function getGranteeMetaValue(address: string, badge: string, path: string, key: string) {
		return await readContract<string>('badgeManager', 'getGranteeMetaValue', [badge, path, address, key]);
	}

	/**
	 * Parse transaction error into human-friendly message
	 * @param error The error object
	 */
	function humanizeErrors(error: { message: string } | unknown) {
		const execError = error instanceof TransactionExecutionError;
		if (execError && error.message.includes('User rejected the request')) {
			return 'Transaction was rejected';
		}

		if (execError && error.message.includes('replacement transaction underpriced')) {
			return 'Rejected: Not enough gas to replace pending tx';
		}

		return 'Transaction failed';
	}

	return {
		loadInstruction,
		grantNewOrUpsetBadgeMetaBySig,
		hasBadge,
		getGranteeMetaValue,
		humanizeErrors,
	};
}
