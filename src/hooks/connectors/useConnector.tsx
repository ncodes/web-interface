import { ChainInfo, ContractNames, getChain } from '@jointlabs/chains-info';
import { useEffect, useState } from 'react';
import { Address, Chain, PublicClient, TransactionReceipt, createPublicClient, erc20Abi, http } from 'viem';
import { hardhat } from 'viem/chains';
import {
	useAccount,
	useChainId,
	useDisconnect,
	usePublicClient,
	useSignMessage,
	useSwitchChain,
	useWalletClient,
} from 'wagmi';
import { logError } from '../../libs/helpers.ts';
import { IConnector } from './interface.ts';

/**
 * UseConnector provides wallet connection functionalities.
 * @returns
 */
export default function useConnector() {
	const defaultNetwork = (getChain(import.meta.env.VITE_DEFAULT_NETWORK) ?? getChain(hardhat.id))?.chainId;
	const [connected, setConnected] = useState<boolean | undefined>(undefined);
	const [address, setAddress] = useState<string | undefined>(undefined);
	const [ready, setReady] = useState(false);
	const [network, setNetwork] = useState<string | undefined>(undefined);
	const { disconnectAsync } = useDisconnect();
	const chainId = useChainId();
	const [chain, setChain] = useState<Chain | undefined>(undefined);
	const { isConnected, address: _address } = useAccount();
	const { data: walletClient } = useWalletClient();
	const { switchChain, chains } = useSwitchChain();
	const publicClient = usePublicClient();
	const { data: signedData, status: signStatus, signMessageAsync } = useSignMessage();

	useEffect(() => {
		setConnected(isConnected);
		setAddress(_address);
	}, [isConnected, _address]);

	useEffect(() => {
		if (!chainId) return;
		setChain(getChain(chainId)?.chain);
		setNetwork(getChain(chainId)?.queryName);
		localStorage.setItem('lastChainId', chainId.toString());
	}, [connected, chainId]);

	useEffect(() => {
		setReady(
			publicClient !== undefined &&
				connected == true &&
				address !== undefined &&
				chainId !== undefined &&
				walletClient != undefined &&
				chainId !== undefined,
		);
	}, [publicClient, connected, address, chainId, chainId, walletClient]);

	/**
	 * Disconnect from supported wallet provider
	 */
	async function disconnect() {
		try {
			await disconnectAsync();
			return Promise.resolve();
		} catch (error) {
			return Promise.reject(new Error(`failed to disconnect: ${(error as Error).message}`));
		}
	}

	/**
	 * Sign the message
	 * @param msg - The message to be signed
	 */
	async function sign(msg: string): Promise<string> {
		try {
			if (!connected) return Promise.reject(new Error('not connected to a wallet'));
			const sig = await signMessageAsync({ message: msg });
			return Promise.resolve(sig);
		} catch (error) {
			logError('sign:', error);
			return Promise.reject(new Error(`User rejected the signing request`));
		}
	}

	/**
	 * Switch network
	 * @param id - The network ID
	 */
	async function switchNetwork(id: number) {
		try {
			if (!connected) return Promise.reject(new Error('not connected to a wallet'));
			if (!switchChain) return Promise.reject(new Error('switch function not set'));
			switchChain({ chainId: id });
			return Promise.resolve();
		} catch (error) {
			return Promise.reject(error);
		}
	}

	/**
	 * Get coin balance of the connected wallet
	 */
	async function getBalance(): Promise<bigint> {
		if (!publicClient) throw new Error('no provider found');
		return publicClient.getBalance({ address: address as Address });
	}

	/**
	 * Get token balance of an account
	 * @param tokenAddress - The token address
	 * @param accountAddress - The account's address
	 */
	async function getTokenBalance(tokenAddress: Address | string, accountAddress: Address | string): Promise<bigint> {
		if (!publicClient) throw new Error('no provider found');
		if (!walletClient) throw new Error('wallet not connected');
		return publicClient.readContract({
			address: tokenAddress as Address,
			abi: erc20Abi,
			functionName: 'balanceOf',
			args: [accountAddress as Address],
		});
	}

	/**
	 * Get token supply
	 * @param tokenAddress - The token address
	 */
	async function getTokenSupply(tokenAddress: Address): Promise<bigint> {
		if (!publicClient) throw new Error('no provider found');
		if (!walletClient) throw new Error('wallet not connected');
		return publicClient.readContract({
			address: tokenAddress,
			abi: erc20Abi,
			functionName: 'totalSupply',
		});
	}

	/**
	 * Get allowance of a spender for an account
	 * @param tokenAddress - The token address
	 * @param accountAddress - The account's address
	 * @param spenderAddress - The spender's address
	 */
	async function getTokenAllowance(
		tokenAddress: Address | string,
		accountAddress: Address | string,
		spenderAddress: Address | string,
	): Promise<bigint> {
		if (!publicClient) throw new Error('no provider found');
		if (!walletClient) throw new Error('wallet not connected');
		return publicClient.readContract({
			address: tokenAddress as Address,
			abi: erc20Abi,
			functionName: 'allowance',
			args: [accountAddress as Address, spenderAddress as Address],
		});
	}

	/**
	 * Get token balance of an account
	 * @param tokenAddress - The token address
	 * @param spenderAddress - The spender's address
	 * @param amount - The amount to be approved
	 * @param noWait - If true, the function will not wait for the transaction to be mined
	 * @param confirmations - The number of confirmations to wait for
	 */
	async function approveAllowance(
		tokenAddress: Address,
		spenderAddress: Address,
		amount: bigint,
		noWait = false,
		_confirmations = 1,
	) {
		if (!publicClient) throw new Error('no provider found');
		if (!walletClient) throw new Error('wallet not connected');
		const netInfo = getChain(chainId as number);
		if (!netInfo || !netInfo.contracts) throw new Error('unknown contract');
		const [address] = await walletClient.getAddresses();

		const { request } = await publicClient.simulateContract({
			address: tokenAddress,
			abi: erc20Abi,
			functionName: 'approve',
			args: [spenderAddress, amount],
			account: address,
		});

		const txHash = await walletClient.writeContract(request);
		if (!noWait) {
			await publicClient.waitForTransactionReceipt({
				hash: txHash,
				confirmations: 0,
				timeout: 1800000,
			});
		}

		return txHash;
	}

	/**
	 * Get ERC20 token name
	 * @param tokenAddress - The token address
	 * @returns
	 */
	async function getTokenName(tokenAddress: Address | string): Promise<string> {
		if (!publicClient) throw new Error('no provider found');
		return publicClient.readContract({
			address: tokenAddress as Address,
			abi: erc20Abi,
			functionName: 'name',
		});
	}

	/**
	 * Get ERC20 token decimals
	 * @param tokenAddress - The token address
	 * @returns
	 */
	async function getTokenDecimals(tokenAddress: Address | string): Promise<number> {
		if (!publicClient) throw new Error('no provider found');
		return publicClient.readContract({
			address: tokenAddress as Address,
			abi: erc20Abi,
			functionName: 'decimals',
		});
	}

	/**
	 * Get ERC20 token symbol
	 * @param tokenAddress - The token address
	 * @returns
	 */
	async function getTokenSymbol(tokenAddress: Address | string): Promise<string> {
		if (!publicClient) throw new Error('no provider found');
		return publicClient.readContract({
			address: tokenAddress as Address,
			abi: erc20Abi,
			functionName: 'symbol',
		});
	}

	/**
	 * Send transaction
	 * @param to The recipient's address
	 * @param value The amount to be sent
	 * @param noWait If true, the function will not wait for the transaction to be mined
	 * @param confirmations The number of confirmations to wait for
	 * @returns
	 */
	async function sendTransaction(to: string, value: bigint, noWait = false, _confirmations = 1) {
		if (!publicClient) throw new Error('no provider found');
		if (!walletClient) throw new Error('wallet not connected');
		const txHash = await walletClient.sendTransaction({
			account: walletClient.account,
			to: to as Address,
			value,
		});
		if (!noWait) {
			await publicClient.waitForTransactionReceipt({
				hash: txHash,
				confirmations: 0,
				timeout: 1800000,
			});
		}
		return txHash;
	}

	/**
	 * Read a contract
	 * @param name - The name of the contract
	 * @param targetFunc - The target function to be called
	 * @param args - The arguments to be passed to the target function
	 * @param useAltRpc - If true, the function will use the RPC endpoint specified in the networks.ts file
	 */
	async function readContract<T>(
		name: ContractNames,
		targetFunc: string,
		args: unknown[] = [],
		useAltRpc = false,
	): Promise<T> {
		if (!publicClient) throw new Error('no provider found');
		let client = publicClient as PublicClient;

		if (useAltRpc) {
			const chainInfo = getChainInfo();
			const chain = chains.find((c) => c.id === chainInfo.chainId);
			if (!chain) throw new Error('unknown chain');
			if (!chainInfo.rpcUrl) throw new Error('unknown rpc url');

			client = createPublicClient({
				chain: chains.find((c) => c.id === (chainId as number)),
				transport: http(chainInfo.rpcUrl),
			});
		}

		if (!client) throw new Error('no provider found');
		const netInfo = getChain(chainId as number);
		if (!netInfo || !netInfo.contracts) throw new Error('unknown contract');
		return client.readContract({
			address: netInfo.contracts[name].address as Address,
			abi: netInfo.contracts[name].abi,
			functionName: targetFunc as never,
			args: args,
		}) as Promise<T>;
	}

	/**
	 * Write to a contract
	 * @param name - The name of the contract
	 * @param targetFunc - The target function to be called
	 * @param args - The arguments to be passed to the target function
	 */
	async function writeContract(name: ContractNames, targetFunc: string, args: unknown[] = []): Promise<Address> {
		if (!walletClient) throw new Error('wallet not connected');
		const netInfo = getChain(chainId as number);
		if (!netInfo || !netInfo.contracts) throw new Error('unknown contract');
		const [address] = await walletClient.getAddresses();
		return walletClient.writeContract({
			address: netInfo.contracts[name].address as Address,
			abi: netInfo.contracts[name].abi,
			functionName: targetFunc,
			args: args,
			account: address,
		});
	}

	/**
	 * Simulate a contract call
	 * @param name - The name of the contract
	 * @param targetFunc - The target function to be called
	 * @param args - The arguments to be passed to the target function
	 * @param noWait - If true, the function will not wait for the transaction to be mined
	 * @param confirmations - The number of confirmations to wait for
	 */
	async function simulateAndWriteContract(
		name: ContractNames,
		targetFunc: string,
		args: unknown[] = [],
		noWait = false,
		_confirmations = 1,
	): Promise<[Address, TransactionReceipt]> {
		if (!publicClient) throw new Error('no provider found');
		if (!walletClient) throw new Error('wallet not connected');

		const netInfo = getChain(chainId as number);
		if (!netInfo || !netInfo.contracts) throw new Error('unknown contract');
		const [address] = await walletClient.getAddresses();
		const { request } = await publicClient.simulateContract({
			address: netInfo.contracts[name].address as Address,
			abi: netInfo.contracts[name].abi,
			functionName: targetFunc,
			args: args,
			account: address,
		});

		const txHash = await walletClient.writeContract(request);
		let receipt: TransactionReceipt | undefined = undefined;
		if (!noWait) {
			receipt = await publicClient.waitForTransactionReceipt({
				hash: txHash,
				confirmations: 0,
				timeout: 1800000,
			});
		}

		return [txHash, receipt as TransactionReceipt];
	}

	/**
	 * Withdraw wrapped token
	 * @param amount The amount to be withdrawn
	 * @param noWait If true, the function will not wait for the transaction to be mined
	 * @param confirmations The number of confirmations to wait for
	 * @returns
	 */
	async function withdrawWrappedToken(amount: bigint, noWait = false, _confirmations = 1) {
		if (!publicClient) throw new Error('no provider found');
		if (!walletClient) throw new Error('wallet not connected');
		const netInfo = getChainInfo();
		const [address] = await walletClient.getAddresses();
		const { request } = await publicClient.simulateContract({
			address: netInfo.wrappedTokenInfo.address as Address,
			abi: netInfo.wrappedTokenInfo.abi,
			functionName: 'withdraw',
			args: [amount],
			account: address,
		});
		const txHash = await walletClient.writeContract(request);
		if (!noWait) {
			await publicClient.waitForTransactionReceipt({
				hash: txHash,
				confirmations: 0,
				timeout: 1800000,
			});
		}
		return txHash;
	}

	// Get the current chain info.
	// If wallet is not connected, the chain info of the default network is returned.
	// @throws Error if default network is not set
	// @throws Error if chainId is unknown
	function getChainInfo(): ChainInfo {
		console.log('No chain', defaultNetwork, chainId);
		if (!chainId) {
			if (!defaultNetwork) throw new Error('default network not set');
			return getChain(defaultNetwork) as ChainInfo;
		}
		const chain = getChain(chainId);
		if (!chain) throw new Error('unknown chain');
		return chain;
	}

	/**
	 * Parse transaction error into human-friendly message
	 * @param error The error object
	 */
	function humanizeErc20Errors(error: { message: string } | unknown): string {
		if (error instanceof Error) {
			// if (error.message.includes("MC: MARKET_EXIST"))
			//   return "Market already exists";
		}
		return 'Transaction failed';
	}

	return {
		// Write and read network
		getBalance,
		readContract,
		simulateAndWriteContract,
		writeContract,
		sendTransaction,
		withdrawWrappedToken,

		// ERC20 operations
		getTokenBalance,
		getTokenSupply,
		getTokenAllowance,
		approveAllowance,
		getTokenName,
		getTokenDecimals,
		getTokenSymbol,
		humanizeErc20Errors,

		// Wallet operations
		wallet: walletClient,
		defaultNetwork,
		ready,
		connected,
		disconnect,
		sign,
		signedData,
		signStatus,
		address,
		chainId,
		switchNetwork,
		chains,
		chain,
		network,
		getChainInfo,
	} as IConnector;
}
