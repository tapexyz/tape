"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { LENS_NAMESPACE_PREFIX } from "@tape.xyz/constants";
import type { Profile as ProfileType } from "@tape.xyz/lens/gql";
import { notFound, useParams } from "next/navigation";

import { profileQuery } from "../queries";

export const Profile = () => {
  const { handle } = useParams<{ handle: string }>();

  const { data } = useSuspenseQuery(
    profileQuery(`${LENS_NAMESPACE_PREFIX}${handle}`)
  );

  if (!data.profile) {
    return notFound();
  }
  const profile = data.profile as ProfileType;

  return <div>{profile.handle?.fullHandle}</div>;
};
