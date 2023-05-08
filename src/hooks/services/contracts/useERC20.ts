import { Web3Provider } from '@ethersproject/providers';
import { BigNumber, BigNumberish, Contract } from 'ethers';
import erc20ABI from '../../../abi/erc20.json';


/**
 * useERC20 provides functions for interacting with an ERC20 contract
 * @param provider
 */
export default function useERC20(provider: Web3Provider) {
  /**
   * Get token balance of an account
   * @param token - The token's address
   * @param account - The account's address
   * @returns BigNumber
   */
  async function balanceOf(token: string, account: string): Promise<BigNumber> {
    const contract = new Contract(token, erc20ABI, provider);
    return Promise.resolve(await contract.balanceOf(account));
  }

  /**
   * Get the remaining token allowance for the given spender
   * @param token - The token's address
   * @param owner - The owner of the token
   * @param spender - The address of the spender
   * @returns BigNumber
   */
  async function allowance(
    token: string,
    owner: string,
    spender: string
  ): Promise<BigNumber> {
    const contract = new Contract(token, erc20ABI, provider);
    return Promise.resolve(await contract.allowance(owner, spender));
  }

  /**
   * Get total supply of token
   * @param token - The token's address
   * @returns BigNumber
   */
  async function totalSupply(token: string): Promise<BigNumber> {
    const contract = new Contract(token, erc20ABI, provider);
    return Promise.resolve(await contract.totalSupply());
  }

  /**
   * Approve a spender
   * @param token - The target token
   * @param spender - The address of the spender
   * @param amount - The amount to be approved
   */
  async function approve(
    token: string,
    spender: string,
    amount: BigNumberish
  ): Promise<TransactionResponse> {
    const contract = new Contract(token, erc20ABI, provider.getSigner());
    return Promise.resolve(await contract.approve(spender, amount));
  }

  return {
    balanceOf,
    allowance,
    totalSupply,
    approve
  };
}
