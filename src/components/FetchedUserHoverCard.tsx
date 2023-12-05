import { ReactNode } from "react";
import { useUserService } from "../hooks/services/backend/useUserService.ts";
import { useQuery } from "@tanstack/react-query";
import { UserHoverCard } from "./UserHoverCard.tsx";

export function FetchedUserHoverCard(props: {
  address: string;
  children: ReactNode;
  className?: string;
}) {
  const { getUser } = useUserService();
  const user = useQuery({
    queryKey: ["getUser", { address: props.address, noAuth: true }],
    queryFn: getUser,
    enabled: !!props.address,
  });
  return (
    <UserHoverCard className={props.className} user={user.data as User}>
      {props.children}
    </UserHoverCard>
  );
}
