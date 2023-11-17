import { isEqlStr } from "../../libs/helpers";

/**
 * TokenInfo describes an ERC20-like token EVM chain
 */
export default class TokenInfo {
  address?: string;
  name?: string;
  symbol?: string;
  decimals?: number;
  logoURI?: string;
  abi?: any;

  constructor(props: Partial<TokenInfo>) {
    return Object.assign(this, props);
  }

  /**
   * Checks whether the object is equal to o
   * @param o - The other object
   */
  isEqual(o: TokenInfo) {
    return isEqlStr(this.address, o.address);
  }
}
