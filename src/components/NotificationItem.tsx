import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import { useConnectorContext } from "../hooks/connectors/useConnectorContext.tsx";
import { useNotificationService } from "../hooks/services/backend/useNotificationService.ts";
import { cn } from "../libs/helpers.ts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.tsx";

const humanizedNoteType = {
  "swap:instant": "Instant Swap",
  "swap:interactive": "Interactive Swap",
  "order:cancellation": "Order Cancelled",
  "order:paid": "Order Paid",
  "order:released": "Order Released",
  "market:perm:put:approved": "LP Permission Approved",
  "market:perm:put:revoked": "LP Permission Revoked",
  "market:perm:swap:approved": "Swap Permission Approved",
  "market:perm:swap:revoked": "Swap Permission Revoked",
  "market:liquidity-manager:updated": "Liquidity Manager Updated",
  "market:liquidity-manager:removed": "Liquidity Manager Removed",
  "dispute:created": "New Dispute",
  "dispute:ticket-drafted": "Ticket Draft",
  "dispute:evidence-submission": "Evidence Submission Started",
  "dispute:evidence-phase-started": "Evidence Submission Started",
  "dispute:ticket-slashed": "Ticket Slashed",
  "dispute:evidence-phase-ended": "Commit Phase Started",
  "dispute:commit-phase-ended": "Commit Phase Ended",
  "dispute:reveal-phase-ended": "Reveal Phase Ended",
  "dispute:executed": "Dispute Executed",
  "offer:new": "New Offer",
  "offer:updated": "Offer Updated",
  "offer:accepted": "Offer Accepted",
  "offer:unaccepted": "Offer Unaccepted",
  "offer:cancelled": "Offer Cancelled",
  "offer:executed": "Offer Executed",
  "chat:new-message": "New Message Interaction",
};

function getLink(body: string) {
  const match = body.match(/<\/?a[^>].*>.*?/g);
  if (!match) return;
  const href = match[0].match(/href="([^"]*)/);
  if (!href) return;
  return href[1];
}

export function NotificationItem({ note }: { note: Notification }) {
  const link = getLink(note.body);
  const { getChainInfo } = useConnectorContext();
  const { markNotificationsAsRead } = useNotificationService();
  const queryClient = useQueryClient();

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationsAsRead,
  });

  async function doMarkAsRead() {
    if (note.read) return;
    await markAsReadMutation.mutateAsync({
      id: note.id,
      net: getChainInfo().queryName,
    });
    queryClient.refetchQueries(["getNotifications", "countNotifications"]);
  }

  return (
    <NavLink
      to={link || "#"}
      onClick={() => {
        doMarkAsRead();
      }}
    >
      <Card
        className={cn(
          "w-full shrink-0 border  border-card-border bg-card-background shadow-gray-900 shadow-lg hover:border-gray-500 transition-all duration-500 cursor-pointer",
          {
            "border-chinese-green hover:border-chinese-green": !note.read,
          }
        )}
      >
        <CardHeader className="p-0 ">
          <CardTitle
            className={cn(
              "text-gray-300 text-xs tracking-wide p-2 px-3 font-medium border-b border-gray-800 cursor-pointer",
              {
                "text-chinese-green": !note.read,
              }
            )}
          >
            {humanizedNoteType[note.type]}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 px-3 pb-3 text-gray-300 font-extralight text-xs">
          {note.body.replace(/<\/?a[^>].*>.*?/g, "")}
        </CardContent>
      </Card>
    </NavLink>
  );
}
