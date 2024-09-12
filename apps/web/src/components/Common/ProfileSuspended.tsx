import { Button } from "@tape.xyz/ui";
import Link from "next/link";

import MetaTags from "@/components/Common/MetaTags";

const ProfileSuspended = () => {
  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center space-y-4 text-center">
      <MetaTags title="Suspended" />
      <h1 className="text-4xl font-bold">Suspended</h1>
      <div className="mb-6">Author profile has been suspended.</div>
      <Link href="/">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
};

export default ProfileSuspended;
