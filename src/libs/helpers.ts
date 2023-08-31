import numeral from "numeral";
import Decimal from "decimal.js";
import { BigNumber, BigNumberish } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AxiosResponse } from "axios";
import * as approx from "approximate-number";
import * as humanizeDuration from "humanize-duration";
import { RequestError } from "./RequestError.ts";

// pow10 returns 10^decimals
export function pow10(decimals: number) {
  return BigNumber.from(10).pow(decimals);
}

// pow10D returns 10^decimals as a Decimal object
export function pow10D(decimals: number) {
  return toDec(10).pow(decimals);
}

// powOf returns n * 10^power
export function powOf(n: BigNumberish, power: number) {
  return toBN(
    toDec(n.toString())
      .mul(toDec(pow10(power).toString()))
      .toFixed(0)
  );
}
/**
 * Generate and merge css classes
 * @param inputs - The css classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert a number to a Decimal
 * @param val - The value to convert
 */
export function toDec(val: string | number) {
  return new Decimal(val);
}

/**
 * Convert a number to a BigNumber
 * @param val - The value to convert
 */
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
    console.error(error);
    return new RequestError(500, "something went wrong");
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
  return formatToMoney(formatUnits(v, decimals), format);
}

/**
 * Format a number to human-readable money format
 * @param v - The value to format
 * @param format - The format to use
 */
export function formatToMoney(v: string | number, format = undefined) {
  if (!v) return;
  const param = typeof v === "number" ? v.toLocaleString() : v;
  const fmt = format || (typeof v === "number" ? "0,0.[00]" : "0,0.[0000]");
  return numeral(param).format(fmt) !== "NaN" ? numeral(param).format(fmt) : 0;
}

/**
 * Shorten an address and include ellipsis at the middle
 * @param address - The address
 */
export function shortenAddress(address: string) {
  if (!address) return address;
  return `${address.substring(0, 6)}...${address.substring(
    address.length,
    address.length - 4
  )}`;
}

/**
 * Shorten an address and end it with ellipsis
 * @param address
 */
export function shortenAddress2(address: string) {
  if (!address) return address;
  return `${address.substring(0, 6)}...`;
}

/**
 * Approximate a number to human-readable format
 * @param num - The number to approximate
 * @param precision - The precision to use
 */
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

/**
 * Check if a value is true
 * @param val - The value
 */
export function isTrue(val: string | boolean) {
  return val === true || val === "true" || val === "1";
}

/**
 * Remove undefined and null values from an object.
 * @param obj - The object
 * @param includeEmptyString - Whether to remove empty string
 */
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

/**
 * Humanize a duration
 * @param sec - The duration in seconds
 */
export function humanizeDur(sec: number) {
  let units: humanizeDuration.Unit[] | undefined = [];
  if (sec < 3600) units = ["m", "s"];
  else if (sec < 86400) units = ["h", "m"];
  else if (sec > 86400) units = ["d", "h"];

  const humanizer = humanizeDuration.humanizer({
    units,
    maxDecimalPoints: 0,
    language: "shortEn",
    languages: {
      shortEn: {
        y: () => "y",
        mo: (v) => (v && v <= 1 ? "mo" : "mos"),
        d: (v) => (v && v <= 1 ? "day" : "days"),
        h: (v) => (v && v <= 1 ? "hr" : "hrs"),
        m: (v) => (v && v <= 1 ? "min" : "mins"),
        s: (v) => (v && v <= 1 ? "sec" : "secs"),
        ms: () => "ms",
      },
    },
  });

  return humanizer(sec * 1000);
}

/**
 * Check if a list of badges include a merchant badge
 * @param badges - The badges
 */
export function isMerchant(badges: string[]) {
  return badges.includes(import.meta.env.VITE_MERCHANT_BADGE);
}

/**
 * Check if a string is equal to another string, ignoring case.
 * @param a - The first string
 * @param b - The second string
 * @return false if either string is undefined
 * @return true if the strings are equal
 */
export function isEqlStr(a: string, b: string) {
  if (a == undefined || b == undefined) return false;
  return a.toLowerCase() === b.toLowerCase();
}
