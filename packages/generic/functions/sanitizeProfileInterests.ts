import type { ProfileInterestTypes } from "@tape.xyz/lens";
import type { ProfileInterest } from "@tape.xyz/lens/custom-types";

export const sanitizeProfileInterests = (
  profileInterests: ProfileInterestTypes[]
) => {
  if (!profileInterests) {
    return [];
  }
  const interests: Array<ProfileInterest> = [];
  const categories = profileInterests.filter(
    (interest) => !interest.includes("__")
  );
  for (const category of categories) {
    const subCategories = profileInterests
      .filter(
        (interest) => interest.includes(category) && interest.includes("__")
      )
      .map((item) => {
        return {
          label: item.toLowerCase().split("__")[1]!.replaceAll("_", " & "),
          id: item
        };
      });
    interests.push({
      category: {
        label: category.toLowerCase().replaceAll("_", " & "),
        id: category
      },
      subCategories
    });
  }
  return interests;
};
