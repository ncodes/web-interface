import Helmet from "react-helmet";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import { MainContainerConnectButton } from "../MainContainerConnectButton.tsx";
import { TabsContent } from "../ui/Tabs.tsx";
import { GalxeConversion } from "./GalxeConversion.tsx";

export function GalxeConverstionTabContent() {
  const { address } = useConnectorContext();

  return (
    <TabsContent value="galxe" className="p-0 m-0 flex flex-1 flex-col gap-3">
      <Helmet>
        <title>{`Galxe Points To Joint Points - Joint`}</title>
      </Helmet>

      {address && (
        <div className="flex-1 flex justify-center mt-20">
          <GalxeConversion />
        </div>
      )}

      {!address && <MainContainerConnectButton />}
    </TabsContent>
  );
}
