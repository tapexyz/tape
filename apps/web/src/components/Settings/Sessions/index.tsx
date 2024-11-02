import MetaTags from "@/components/Common/MetaTags";
import useAuthPersistStore from "@/lib/store/auth";
import useProfileStore from "@/lib/store/idb/profile";
import { FEATURE_FLAGS } from "@tape.xyz/constants";
import { getIsFeatureEnabled } from "@tape.xyz/generic";
import { Button } from "@tape.xyz/ui";
import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";
import List from "./List";

const Sessions = () => {
  const { hydrateAuthTokens } = useAuthPersistStore();
  const { refreshToken } = hydrateAuthTokens();
  const [showQRCode, setShowQRCode] = useState(false);

  const activeProfile = useProfileStore((state) => state.activeProfile);
  return (
    <>
      <MetaTags title="Sessions" />
      <div className="mb-5 space-y-2">
        <h1 className="font-bold text-brand-400 text-xl">
          Authorized Sessions
        </h1>
        <p className="text opacity-80">
          Here is a list of devices that have logged into your account. If any
          of these sessions seem unfamiliar to you, kindly revoke their access.
        </p>
      </div>
      <List />
      {getIsFeatureEnabled(FEATURE_FLAGS.TAPE_CONNECT, activeProfile?.id) && (
        <div className="mt-5 flex flex-col">
          <h1 className="font-bold text-brand-400 text-xl">Tape Connect</h1>
          <div className="mt-5 flex">
            <Button onClick={() => setShowQRCode(!showQRCode)}>
              Toggle QR Code
            </Button>
          </div>
          {showQRCode ? (
            <div className="my-5">
              <QRCodeCanvas value={refreshToken ?? ""} marginSize={2} />
            </div>
          ) : null}
        </div>
      )}
    </>
  );
};

export default Sessions;
