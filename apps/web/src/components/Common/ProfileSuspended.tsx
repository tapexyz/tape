import { Button } from "@tape.xyz/ui";
import Link from "next/link";

import MetaTags from "@/components/Common/MetaTags";

const ProfileSuspended = () => {
  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center space-y-4 text-center">
      <MetaTags title="Not Found" />
      <h1 className="font-bold text-4xl">Not Found</h1>
      <div className="mb-6 max-w-sm text-center">
        Author profile has been masked. If you believe this is an error, please
        <Link href="/terms"> contact us</Link>.
      </div>
      <Link href="/">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
};

export default ProfileSuspended;
