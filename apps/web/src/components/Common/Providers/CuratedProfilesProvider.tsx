import { useQuery } from "@tanstack/react-query";
import { WORKER_CURATED_PROFILES_URL } from "@tape.xyz/constants";
import axios from "axios";

import useCuratedProfiles from "@/lib/store/idb/curated";

const CuratedProfilesProvider = () => {
  const setCuratedProfiles = useCuratedProfiles(
    (state) => state.setCuratedProfiles,
  );

  const fetchCuratedProfiles = async () => {
    const { data } = await axios.get(WORKER_CURATED_PROFILES_URL);
    setCuratedProfiles(data?.ids ?? []);
  };

  useQuery({
    queryKey: ["fetchCuratedProfiles"],
    queryFn: fetchCuratedProfiles,
  });

  return null;
};

export default CuratedProfilesProvider;
