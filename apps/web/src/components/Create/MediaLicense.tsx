import { MetadataLicenseType } from "@lens-protocol/metadata";
import { Select, SelectItem } from "@tape.xyz/ui";

import useAppStore from "@/lib/store";

const MediaLicense = () => {
  const uploadedMedia = useAppStore((state) => state.uploadedMedia);
  const setUploadedMedia = useAppStore((state) => state.setUploadedMedia);

  return (
    <div className="flex-1 space-y-1">
      <span className="font-medium text-sm">License</span>
      <Select
        value={uploadedMedia.mediaLicense}
        onValueChange={(mediaLicense: MetadataLicenseType) =>
          setUploadedMedia({ mediaLicense })
        }
      >
        <SelectItem value={MetadataLicenseType.CC_BY}>
          Use or share content with attribution
        </SelectItem>
        <SelectItem value={MetadataLicenseType.CC_BY_ND}>
          Use or share with attribution but no modifications
        </SelectItem>
        <SelectItem value={MetadataLicenseType.CC_BY_NC}>
          Use or share content with attribution for non-commercial purposes
        </SelectItem>
        <SelectItem value={MetadataLicenseType.CCO}>
          Use or share content without any restrictions
        </SelectItem>
      </Select>
    </div>
  );
};

export default MediaLicense;
