import { useQuery } from "@tanstack/react-query";
import { AlertOctagon, PlugZapIcon } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ConnectWalletButton } from "../components/ConnectWalletButton";
import { Button } from "../components/ui/Button";
import { useConnectorContext } from "../hooks/connectors/useConnectorContext";
import { useAuthService } from "../hooks/services/backend/useAuthService";

export default function ConnectPage() {
  const { address, disconnect } = useConnectorContext();
  const navigate = useNavigate();
  const { isAllowedPrivateTestAddress } = useAuthService();

  const isAllowedQuery = useQuery({
    queryKey: ["isAllowedAddress", { address }],
    queryFn: isAllowedPrivateTestAddress,
    enabled: !!address,
    refetchInterval: false,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (address && isAllowedQuery.data) navigate("/");
    if (address && isAllowedQuery.data == false) disconnect();
  }, [address, isAllowedQuery.data]);

  return (
    <div className="fixed w-full h-screen bg-gray-900 z-50 left-0 flex flex-col">
      <div className="flex justify-center items-center text-gray-200 pt-10">
        <img src="images/logo-w.svg" />
      </div>
      <div className="flex-1 flex flex-col w-[300px] items-center mx-auto ">
        {isAllowedQuery.data == undefined && (
          <span className="block mt-[300px]">
            <ConnectWalletButton>
              <Button className="w-[220px] flex gap-2 hover:scale-105 duration-500">
                <PlugZapIcon className="w-[20px]" /> Connect your wallet
              </Button>
            </ConnectWalletButton>
          </span>
        )}

        {isAllowedQuery.data == false && (
          <span className="text-gray-200 flex gap-2 items-center mt-[300px]">
            <span>
              <AlertOctagon width="20" />
            </span>
            <span>You do not have permission!</span>
          </span>
        )}
      </div>
    </div>
  );
}
