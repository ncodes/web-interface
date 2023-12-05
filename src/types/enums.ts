export enum Events {
  LiquidityAdd = "liq_add",
  LiquidityRemove = "liq_remove",
  LiquiditySwap = "liq_swap",
  LiquidityOffer = "liq_offer",
  LiquidityPause = "liq_pause",
  LiquidityManagerUpdate = "liq_manager_update",
  LiquidityTargetUpdate = "liq_target_update",
  LiquidityPriceUpdate = "liq_price_update",
  LiquiditySwapLimitUpdate = "liq_swap_limit_update",
  LiquidityTimeToPayUpdate = "liq_time_to_pay_update",
  SwapNew = "swap_new",
  SwapPaid = "swap_paid",
  SwapReleased = "swap_released",
  SwapCancelled = "swap_cancelled",
  SwapDisputed = "swap_disputed",
  SwapDrafted = "swap_drafted",
  SwapCommitted = "swap_committed",
  SwapRevealed = "swap_revealed",
  SwapExecuted = "swap_executed",
  SwapUndrafted = "swap_undrafted",
  OfferCreate = "offer_create",
  OfferUpdate = "offer_update",
  OfferAccept = "offer_accept",
  OfferUnaccept = "offer_unaccept",
  OfferCancel = "offer_cancel",
  OfferExecute = "offer_execute",
}

export enum AssetType {
  SYNTH,
  ERC20,
  ERC721,
  ERC1155,
}

export enum NotificationType {
  TypeChatNotification = "chat:new-message",
}
