// Mapping of revert messages to their human-friendly message
const messages = {
  'OC: UNKNOWN_MARKET': '',
  'OC: NOT_DISPUTE_MGR': '',
  'OC: EXPIRED_TX': '',
  'OC: NOT_INVENTOR': '',
  'OC: UNKNOWN_ORDER': '',
  'OC: OUT_OF_RANGE': '',
  'OC: ZERO_AMOUNT': '',
  'OC: ZERO_MAX_PRICE': '',
  'OC: ZERO_LIQUIDITY': '',
  'OC: LIQUIDITY_PAUSED': '',
  'OC: LOW_LIQUIDITY': '',
  'OC: AMOUNT_BELOW_MIN_SWAP': '',
  'OC: AMOUNT_ABOVE_MAX_SWAP': '',
  'OC: OVER_MAX_PRICE': '',
  'OC: MAX_OPEN_ORDERS':
    'The liquidity provider has too many open swap orders. Try another liquidity provider.',
  'OC: MAX_OPEN_DISPUTES': '',
  'OC: LOW_QUOTE_BAL': '',
  'OC: ALREADY_FINALIZED': '',
  'OC: NOT_RELEASER': '',
  'OC: ORDER_UNPAID': '',
  'OC: NOT_AUTHORIZED': '',
  'OC: NOT_INACTIVE': '',
  'OC: NOT_CANCEL_TIME': '',
  'OC: NOT_ACTIVE': '',
  'OC: NOT_PAYER': '',
  'OC: BAD_START_TIME': '',
  'OC: BAD_END_TIME': '',
  'OC: BAD_SUPPLY': '',
  'OC: LOW_TIME_TO_PAY': '',
  'OC: REQ_AMOUNT': '',
  'OC: REQ_PRICE': '',
  'OC: LOW_LIQ': '',
  'OC: MIN_SWAP_OVER_MAX': '',
  'OC: NOT_SET': '',
  'OC: NOT_MANAGER': '',
  'OC: NO_LIQUIDITY': '',

  // Non-contract errors
  'user rejected transaction': 'User rejected swap transaction',
};

/**
 * Get revert message
 * @param str - The error message to be checked
 */
export default function getRevertMsg(str: string): string {
  for (const msg in messages) {
    if (str.indexOf(msg) > -1) {
      const m = messages[msg];
      return m ? m : msg;
    }
  }
  return str;
}
