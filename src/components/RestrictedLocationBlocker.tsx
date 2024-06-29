import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useConnectorContext } from "../hooks/connectors/useConnectorContext.tsx";
import { useGeofence } from "../hooks/geofence/useGeofence.ts";
import { useOfferService } from "../hooks/services/backend/useOfferService.ts";
import useStore, { RestrictScope } from "../hooks/store/useStore.ts";
import { Button } from "./ui/Button.tsx";
import { Dialog, DialogContent, DialogHeader } from "./ui/Dialog.tsx";

export default function RestrictedLocationBlocker() {
  const {
    isGlobalDisallowed,
    isDisallowedForInteractiveMarket,
    isDisallowedForMarket,
    isAllowedForMarket,
  } = useGeofence();
  const { network, address } = useConnectorContext();
  const { getOffer } = useOfferService();
  const countryCode = useStore((state) => state.countryCode);
  const restricted = useStore((state) => state.restricted);
  const setRestricted = useStore((state) => state.setRestricted);
  const restrictedScope = useStore((state) => state.restrictedScope);
  const setRestrictedScope = useStore((state) => state.setRestrictedScope);
  const loc = useLocation();
  const { id, market } = useParams();

  // Check if the user is restricted from accessing the entire platform
  // Check if the user is restricted from accessing a market
  // then check if the user is restricted from accessing an interactive market
  useEffect(() => {
    if (!network || !countryCode) return;
    setRestricted(false);

    if (isGlobalDisallowed(countryCode)) {
      setRestricted(true);
      setRestrictedScope(RestrictScope.GLOBAL);
      return;
    }

    const check = (
      network: string,
      marketAddress: string,
      countryCode: string,
      scope = RestrictScope.MARKET
    ) => {
      isDisallowedForMarket(network, marketAddress, countryCode).then(
        (restricted) => {
          setRestricted(restricted);
          setRestrictedScope(scope);

          if (!restricted) {
            isDisallowedForInteractiveMarket(
              network,
              marketAddress,
              countryCode
            ).then((restricted) => {
              setRestricted(restricted);
              setRestrictedScope(RestrictScope.MARKET);

              if (!restricted) {
                isAllowedForMarket(network, marketAddress, address).then(
                  (allowed) => {
                    setRestricted(!allowed);
                    setRestrictedScope(RestrictScope.MARKET_PERM);
                  }
                );
              }
            });
          }
        }
      );
    };

    (async () => {
      if (
        (loc.pathname.includes("/market/") && id) ||
        (loc.pathname.includes("/liquidity/") && market)
      ) {
        const marketAddress = id || market;
        if (!marketAddress) return;
        check(network, marketAddress, countryCode);
      }

      if (loc.pathname.includes("/offer/")) {
        const offerId = id;
        if (!offerId) return;

        const offer = await getOffer({
          queryKey: ["getOffer", { network, offerId: parseInt(offerId) }],
        } as any);
        if (!offer) return;

        check(network, offer.market.address, countryCode, RestrictScope.OFFER);
      }
    })();
  }, [loc, network, id, market, countryCode]);

  return (
    <Dialog defaultOpen={restricted} modal={true} open={restricted}>
      <DialogContent className="bg-modal-background border-gray-700 mx-2 md:mx-0 md:w-[400px] top-[25%] ring-0 outline-0 shadow-sm shadow-gray-800">
        <RestrictedLocationNotice restrictedScope={restrictedScope} />
      </DialogContent>
    </Dialog>
  );
}

export function RestrictedLocationNotice({
  restrictedScope,
  hideBtns,
}: {
  restrictedScope: RestrictScope;
  hideBtns?: boolean;
}) {
  return (
    <div>
      <DialogHeader>
        <div className="flex text-[17px] items-center gap-2 tracking-wide text-chinese-green ">
          <span>
            <AlertTriangle width="19" />
          </span>
          <span>Restricted Location</span>
        </div>
      </DialogHeader>
      <div className="text-sm text-gray-300 tracking-wide font-light relative top-1 pt-2 [&_a]:text-chinese-green">
        {restrictedScope === RestrictScope.GLOBAL && (
          <>
            This Interface is not available to people or organizations who are
            residents of, or are located, incorporated or have a registered
            agent in the U.S or a{" "}
            <a
              href="https://docs.joint.exchange/others/prohibited-jurisdictions"
              target="_blank"
            >
              restricted territory
            </a>
            .
          </>
        )}

        {restrictedScope === RestrictScope.MARKET && (
          <>
            <span>
              This market is not available to people or organizations who are
              residents of, or are located, incorporated or have a registered
              agent in the U.S or a{" "}
              <a
                href="https://docs.joint.exchange/others/prohibited-jurisdictions"
                target="_blank"
              >
                restricted territory
              </a>
              .
            </span>
          </>
        )}

        {restrictedScope === RestrictScope.OFFER && (
          <>
            <span>
              On this Interface, this offer's market is not available to people
              or organizations who are residents of, or are located,
              incorporated or have a registered agent in the U.S or a restricted
              territory.
            </span>
          </>
        )}

        {restrictedScope === RestrictScope.MARKET_PERM && (
          <>
            <span>
              You have not been whitelisted to access this market. Please
              contact support in our Discord server if you think this is an
              error.
            </span>
          </>
        )}

        {!hideBtns && restrictedScope != RestrictScope.GLOBAL && (
          <Button
            onClick={() => {
              window.history.back();
            }}
            className="mt-5"
            size="full"
            variant="outline"
          >
            Back
          </Button>
        )}
      </div>
    </div>
  );
}
