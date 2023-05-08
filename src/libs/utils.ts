import numeral from 'numeral';
import Decimal from 'decimal.js';
import { BigNumber, BigNumberish } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';

export class RequestError extends Error {
  constructor(public code: number,  public message: string) {
    super(message);
    Object.setPrototypeOf(this, RequestError.prototype);
  }

  public toString = (): string => {
    return `RequestError: ${this.message}`;
  };
}

export function toDec(val: any) {
  return new Decimal(val);
}

export function toBN(val: any) {
  return BigNumber.from(val);
}

/**
 * Handle AXIOS error
 * @param error - The error object
 */
export function handleAxiosError(error: any): RequestError {
  if (error.response) {
    return new RequestError(error.response.status, error.response.data.error);
  } else if (error.request) {
    return new RequestError(500, 'request error');
  } else {
    return new RequestError(
      500,
      'network error: check your internet connection'
    );
  }
}

export function formatAmount(
  v: BigNumberish,
  decimals = 18,
  format = undefined
) {
  return formatMoney(formatUnits(v, decimals), format);
}

export function formatMoney(v: string | number, format = undefined) {
  if (!v) return;
  const param = typeof v === 'number' ? v.toLocaleString() : v;
  const fmt = format || (typeof v === 'number' ? '0,0.[00]' : '0,0.[0000]');
  return numeral(param).format(fmt) !== 'NaN' ? numeral(param).format(fmt) : 0;
}



/**
 * Shorten an address
 * @param address - The address
 */
export function shortenAddress(address: string) {
  if (!address) return address;
  return `${address.substring(0, 6)}...${address.substring(
    address.length,
    address.length - 4
  )}`;
}

export function shortenAddress2(address: string) {
  if (!address) return address;
  return `${address.substring(0, 6)}...`;
}
