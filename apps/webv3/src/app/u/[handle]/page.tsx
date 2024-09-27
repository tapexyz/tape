import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { LENS_NAMESPACE_PREFIX } from "@tape.xyz/constants";
import { getProfile, getProfilePicture } from "@tape.xyz/generic";
import type { Profile as ProfileType } from "@tape.xyz/lens/gql";
import type { Metadata } from "next";

import { rqClient } from "@/providers/react-query";

import { Profile } from "./_components/profile";
import { profileQuery } from "./queries";

type Props = {
  params: { handle: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await rqClient.fetchQuery(
    profileQuery(`${LENS_NAMESPACE_PREFIX}${params.handle}`)
  );
  if (!data.profile) {
    return {};
  }
  const profile = data.profile as ProfileType;
  const pfp = getProfilePicture(profile, "AVATAR_LG");

  return {
    title: `${getProfile(profile).displayName} on Tape`,
    description: profile.metadata?.bio,
    openGraph: {
      images: [pfp]
    },
    twitter: {
      images: [pfp],
      card: "summary"
    }
  };
}

export function generateStaticParams() {
  return [{ handle: "titannode" }];
}

export default function ProfilePage({ params }: Props) {
  void rqClient.prefetchQuery(
    profileQuery(`${LENS_NAMESPACE_PREFIX}${params.handle}`)
  );

  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <HydrationBoundary state={dehydrate(rqClient)}>
        <Profile />
      </HydrationBoundary>
    </div>
  );
}
