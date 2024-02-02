import { QueryFunctionContext } from '@tanstack/react-query';
import axios from 'axios';
import { handleAxiosError } from '../../../libs/helpers.ts';
import { useConnectorContext } from '../../connectors/useConnectorContext.tsx';

export interface GetLeaderboardParams {
	address?: string;
	limit?: number;
}

export interface GetLatestPointsParams {
	from?: string;
	limit?: number;
}

export interface CreatePointFromEnergonBalanceParams {
	signer: string;
	beneficiary: string;
	sig: string;
}

/**
 * usePointService provides access to v1/points endpoints
 */
export function usePointService() {
	const { getChainInfo } = useConnectorContext();

	/**
	 * Get points leaderboard
	 * @param ctx
	 */
	async function getLeaderboard(
		ctx: QueryFunctionContext<[string, GetLeaderboardParams]>,
	): Promise<{ points: Point[]; total: number }> {
		try {
			const [, params] = ctx.queryKey;
			const { address, limit } = params;
			const headers = {};
			const resp = await axios({
				method: 'get',
				url: `${getChainInfo().apiUrl}/v1/points/leaderboard`,
				params: {
					address,
					limit,
				},
				headers,
			});

			return Promise.resolve(resp.data.data);
		} catch (e) {
			return Promise.reject(handleAxiosError(e as never));
		}
	}

	/**
	 * Get latest points
	 * @param ctx The query context
	 * @returns
	 */
	async function getLatestPoints(ctx: QueryFunctionContext<[string, GetLatestPointsParams]>): Promise<Point[]> {
		try {
			const [, params] = ctx.queryKey;
			const { from, limit } = params;
			const headers = {};
			const queryParams: any = {
				limit,
			};
			if (from) {
				queryParams.from = from;
			}

			const resp = await axios({
				method: 'get',
				url: `${getChainInfo().apiUrl}/v1/points/latest`,
				params: queryParams,
				headers,
			});

			return Promise.resolve(resp.data.data);
		} catch (e) {
			return Promise.reject(handleAxiosError(e as never));
		}
	}

	/**
	 * Create points from Energon balance
	 * @param ctx The query context
	 * @returns
	 */
	async function createPointFromEnergonBalance(body: CreatePointFromEnergonBalanceParams): Promise<undefined> {
		try {
			const { beneficiary, signer, sig } = body;
			const headers = {};

			await axios({
				method: 'post',
				url: `${getChainInfo().apiUrl}/v1/points/from-energon-balance`,
				data: { beneficiary, signer, sig },
				headers,
			});

			return;
		} catch (e) {
			return Promise.reject(handleAxiosError(e as never));
		}
	}

	/**
	 * Check if a point exists
	 * @param ctx The query context
	 * @returns
	 */
	async function checkPointExists(ctx: QueryFunctionContext<[string, string]>): Promise<boolean> {
		try {
			const [, name] = ctx.queryKey;
			const resp = await axios({
				method: 'get',
				url: `${getChainInfo().apiUrl}/v1/points/${name}/exist`,
			});
			return Promise.resolve(resp.data.data.exist);
		} catch (e) {
			return Promise.reject(handleAxiosError(e as never));
		}
	}

	return {
		getLeaderboard,
		getLatestPoints,
		createPointFromEnergonBalance,
		checkPointExists,
	};
}
