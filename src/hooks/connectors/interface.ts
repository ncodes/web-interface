import { ChainInfo, ContractNames } from '@jointlabs/chains-info';
import { Address, Chain, SimulateContractReturnType, TransactionReceipt, WalletClient } from 'viem';

export interface IConnector {
	defaultNetwork: number;

	readContract<T>(name: ContractNames, targetFunc: string, args?, useAltRpc?): Promise<T>;
	simulateContract(name: ContractNames, targetFunc: string, args?): Promise<SimulateContractReturnType>;
	writeContract(name: ContractNames, targetFunc: string, args?): Promise<Address>;
	simulateAndWriteContract(
		name: ContractNames,
		targetFunc: string,
		args?,
		noWait?: boolean,
	): Promise<[Address, TransactionReceipt]>;
	sendTransaction(to: string, value: bigint, noWait?: boolean, confirmations?: number): Promise<Address>;
	withdrawWrappedToken(amount: bigint, noWait?: boolean, confirmations?: number): Promise<Address>;
	getTokenBalance(tokenAddress: Address | string, accountAddress: Address | string): Promise<bigint>;
	approveAllowance(
		tokenAddress: Address,
		spenderAddress: Address,
		amount: bigint,
		noWait?: boolean,
		confirmations?: number,
	): Promise<`0x${string}`>;
	getTokenAllowance(
		tokenAddress: Address | string,
		accountAddress: Address | string,
		spenderAddress: Address | string,
	): Promise<bigint>;
	getTokenSupply(tokenAddress: Address): Promise<bigint>;
	getTokenName(tokenAddress: Address | string): Promise<string>;
	getTokenDecimals(tokenAddress: Address | string): Promise<number>;
	getTokenSymbol(tokenAddress: Address | string): Promise<string>;
	humanizeErc20Errors(error: { message: string } | unknown): string;

	connected: boolean;
	disconnect: () => Promise<void>;
	getBalance: () => Promise<bigint>;
	ready: boolean;
	address: string;

	sign: (msg: string) => Promise<string>;
	signedData: string;
	signStatus: string;

	wallet: WalletClient;
	switchNetwork: (id: number) => Promise<void>;
	chainId: number;
	chains: Chain[];
	chain: Chain;
	network: string;
	getChainInfo(): ChainInfo;
}
