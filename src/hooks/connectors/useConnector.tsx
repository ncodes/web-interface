import { useEffect, useState } from "react";
import { BigNumberish } from "ethers";
import { getNetworkByChainId, Nets } from "./networks";
import {
  Chain,
  useAccount,
  useDisconnect,
  useNetwork,
  usePublicClient,
  useSignMessage,
  useSwitchNetwork,
  useWalletClient,
} from "wagmi";
import { Address, SimulateContractReturnType } from "viem";
import { erc20Abi } from "../../abi";

type ContractNames = "energon" | "nft";

export interface IConnector {
  defaultNetwork: number;

  readContract(name: ContractNames, targetFunc: string, args?): Promise<never>;
  simulateContract(
    name: ContractNames,
    targetFunc: string,
    args?
  ): Promise<SimulateContractReturnType<any, string, Chain, undefined>>;
  writeContract(
    name: ContractNames,
    targetFunc: string,
    args?
  ): Promise<Address>;

  connected: boolean;
  disconnect: () => Promise<void>;
  getBalance: () => Promise<BigNumberish>;
  ready: boolean;
  address: string;

  sign: (msg: string) => Promise<string>;
  signedData: string;
  signStatus: string;

  switchNetwork: (id: number) => Promise<void>;
  chainId: number;
  chains: Chain[];
  chain: Chain;
}

/**
 * UseConnector provides wallet connection functionalities.
 * @returns
 */
export default function useConnector() {
  const defaultNetwork = Nets[import.meta.env.VITE_NETWORK] || Nets.localhost;
  const [connected, setConnected] = useState<boolean | undefined>(undefined);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [chainId, setChainId] = useState<number | undefined>(undefined);
  const [ready, setReady] = useState(false);

  const { disconnectAsync } = useDisconnect();
  const { chain } = useNetwork();
  const { isConnected, address: _address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const {
    data: signedData,
    status: signStatus,
    signMessageAsync,
  } = useSignMessage();
  const { switchNetwork: _switchNetwork, chains } = useSwitchNetwork();
  const publicClient = usePublicClient();

  useEffect(() => {
    setConnected(isConnected);
    setAddress(_address);
  }, [isConnected, _address]);

  useEffect(() => {
    if (!chain) return;
    setChainId(connected ? chain.id : undefined);
  }, [connected, chain]);

  useEffect(() => {
    setReady(
      publicClient !== undefined &&
        connected == true &&
        address !== undefined &&
        chainId !== undefined &&
        walletClient != undefined &&
        chain !== undefined
    );
  }, [publicClient, connected, address, chainId, chain, walletClient]);

  /**
   * Disconnect from supported wallet provider
   */
  async function disconnect() {
    try {
      await disconnectAsync();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(
        new Error(`failed to disconnect: ${(error as Error).message}`)
      );
    }
  }

  /**
   * Sign the message
   * @param msg - The message to be signed
   */
  async function sign(msg: string): Promise<string> {
    try {
      if (!connected)
        return Promise.reject(new Error("not connected to a wallet"));
      const sig = await signMessageAsync({ message: msg });
      return Promise.resolve(sig);
    } catch (error) {
      return Promise.reject(new Error(`User rejected the signing request`));
    }
  }

  /**
   * Switch network
   * @param id - The network ID
   */
  async function switchNetwork(id: number) {
    try {
      if (!connected)
        return Promise.reject(new Error("not connected to a wallet"));
      if (!_switchNetwork)
        return Promise.reject(new Error("switch function not set"));
      await _switchNetwork(id);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Get coin balance of the connected wallet
   */
  async function getBalance(): Promise<BigNumberish> {
    try {
      return Promise.resolve(
        await publicClient.getBalance({ address: address as Address })
      );
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * Simulate a contract call
   * @param name - The name of the contract
   * @param targetFunc - The target function to be called
   * @param args - The arguments to be passed to the target function
   */
  async function simulateContract(
    name: ContractNames,
    targetFunc: string,
    args?
  ) {
    if (!publicClient) throw new Error("no provider found");
    if (!walletClient) throw new Error("wallet not connected");
    const netInfo = getNetworkByChainId(chainId as number);
    if (!netInfo || !netInfo.contracts) throw new Error("unknown contract");
    const [address] = await walletClient.getAddresses();
    return publicClient.simulateContract({
      address: netInfo.contracts[name].address as Address,
      abi: netInfo.contracts[name].abi,
      functionName: targetFunc,
      args: args,
      account: address,
    });
  }

  /**
   * Read a contract
   * @param name - The name of the contract
   * @param targetFunc - The target function to be called
   * @param args - The arguments to be passed to the target function
   */
  async function readContract(name: ContractNames, targetFunc: string, args?) {
    if (!publicClient) throw new Error("no provider found");
    const netInfo = getNetworkByChainId(chainId as number);
    if (!netInfo || !netInfo.contracts) throw new Error("unknown contract");
    return publicClient.readContract({
      address: netInfo.contracts[name].address as Address,
      abi: erc20Abi,
      functionName: targetFunc as never,
      args: args,
    });
  }

  /**
   * Write to a contract
   * @param name - The name of the contract
   * @param targetFunc - The target function to be called
   * @param args - The arguments to be passed to the target function
   */
  async function writeContract(
    name: ContractNames,
    targetFunc: string,
    args?
  ): Promise<Address> {
    if (!walletClient) throw new Error("wallet not connected");
    const netInfo = getNetworkByChainId(chainId as number);
    if (!netInfo || !netInfo.contracts) throw new Error("unknown contract");
    const [address] = await walletClient.getAddresses();
    return walletClient.writeContract({
      address: netInfo.contracts[name].address as Address,
      abi: netInfo.contracts[name].abi,
      functionName: targetFunc,
      args: args,
      account: address,
    });
  }

  return {
    defaultNetwork,
    getBalance,
    readContract,
    simulateContract,
    writeContract,
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
  } as IConnector;
}
