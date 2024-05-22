import Helmet from "react-helmet";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import { MainContainerConnectButton } from "../MainContainerConnectButton.tsx";
import { TabsContent } from "../ui/Tabs.tsx";
import { EnergonConversion } from "./EnergonConversion.tsx";

export function EnergonConversionTabContent() {
  const { address } = useConnectorContext();

  return (
    <TabsContent value="energon" className="p-0 m-0 flex flex-1 flex-col gap-3">
      <Helmet>
        <title>{`Energon To Points - Joint`}</title>
      </Helmet>

      {address && (
        <div className="flex-1 flex justify-center mt-20">
          <EnergonConversion />
        </div>
      )}

      {!address && <MainContainerConnectButton />}
    </TabsContent>
  );
}
