import numeral from "numeral";
import Decimal from "decimal.js";
import { BigNumber, BigNumberish } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AxiosResponse } from "axios";
import * as approx from "approximate-number";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export class RequestError extends Error {
  constructor(public code: number, public message: string) {
    super(message);
    Object.setPrototypeOf(this, RequestError.prototype);
  }

  public toString = (): string => {
    return `RequestError: ${this.message}`;
  };
}

export function toDec(val: string | number) {
  return new Decimal(val);
}

export function toBN(val: BigNumberish) {
  return BigNumber.from(val);
}

/**
 * Handle AXIOS error
 * @param error - The error object
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
export function handleAxiosError(error: {
  response: AxiosResponse;
  request: unknown;
}): RequestError {
  if (error.response) {
    return new RequestError(
      error.response.status,
      error.response.data.error.message
    );
  } else if (error.request) {
    return new RequestError(500, "request error");
  } else {
    return new RequestError(
      500,
      "network error: check your internet connection"
    );
  }
}

/**
 * Format a number to a high denomination (e.g 1,000,000,000,000,000,000 WEI -> 1.0 ETH)
 * @param v - The value to format
 * @param decimals - The number of decimals
 * @param format - The format to use
 */
export function formatToHighDenom(
  v: BigNumberish,
  decimals = 18,
  format = undefined
) {
  return formatMoney(formatUnits(v, decimals), format);
}

/**
 * Format a number to human-readable money format
 * @param v - The value to format
 * @param format - The format to use
 */
export function formatMoney(v: string | number, format = undefined) {
  if (!v) return;
  const param = typeof v === "number" ? v.toLocaleString() : v;
  const fmt = format || (typeof v === "number" ? "0,0.[00]" : "0,0.[0000]");
  return numeral(param).format(fmt) !== "NaN" ? numeral(param).format(fmt) : 0;
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

export function approxNumber(num: number | string, precision?: number) {
  return approx(num, { precision: precision });
}

/**
 * Convert a number to a high denomination and approximate
 * @param v - The value to convert
 * @param decimals - The number of decimals
 * @param precision - The precision
 */
export function toHighDenomAndApprox(
  v: BigNumberish,
  decimals = 18,
  precision?: number
) {
  return approxNumber(
    toDec(v.toString()).div(toDec(10).pow(decimals)).toNumber(),
    precision
  );
}

export function isTrue(val: string | boolean) {
  return val === true || val === "true" || val === "1";
}

export function rmUndefinedAndNull(
  obj: { [key: string]: any },
  includeEmptyString = false
) {
  Object.keys(obj).forEach((key) => {
    if (
      obj[key] === undefined ||
      obj[key] === null ||
      (includeEmptyString && obj[key] === "")
    ) {
      delete obj[key];
    }
  });
  return obj;
}
