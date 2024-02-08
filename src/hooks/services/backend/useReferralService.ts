import { QueryFunctionContext } from '@tanstack/react-query';
import axios from 'axios';
import { handleAxiosError } from '../../../libs/helpers.ts';
import { useConnectorContext } from '../../connectors/useConnectorContext.tsx';

export interface GetLeaderboardParams {
	referrer: string;
	referee?: string;
	limit?: number;
}

export interface GetLatestPointsParams {
	referrer?: string;
	from?: string;
	limit?: number;
	order?: 'asc' | 'desc';
}

export interface GetInfoParams {
	address: string;
}

/**
 * useReferralService provides access to v1/referrals endpoints
 */
export function useReferralService() {
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
			const { referee, limit, referrer } = params;
			const headers = {};
			const resp = await axios({
				method: 'get',
				url: `${getChainInfo().apiUrl}/v1/referrals/leaderboard`,
				params: {
					referee,
					referrer,
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
	 * Get referral info
	 * @param ctx The query context
	 */
	async function getInfo(ctx: QueryFunctionContext<[string, GetInfoParams]>): Promise<GetReferralInfo> {
		try {
			const [, params] = ctx.queryKey;
			const { address } = params;
			const headers = {};
			const resp = await axios({
				method: 'get',
				url: `${getChainInfo().apiUrl}/v1/referrals/${address}/info`,
				params: {},
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
			const { from, limit, order, referrer } = params;
			const headers = {};
			const queryParams: any = {
				limit,
				referrer,
			};
			if (from) {
				queryParams.from = from;
			}

			if (order) {
				queryParams.order = order;
			}

			const resp = await axios({
				method: 'get',
				url: `${getChainInfo().apiUrl}/v1/referrals/latest`,
				params: queryParams,
				headers,
			});

			return Promise.resolve(resp.data.data);
		} catch (e) {
			return Promise.reject(handleAxiosError(e as never));
		}
	}

	return {
		getLeaderboard,
		getLatestPoints,
		getInfo,
	};
}
