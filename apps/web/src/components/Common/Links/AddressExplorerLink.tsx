import { POLYGONSCAN_URL } from "@tape.xyz/constants";
import Link from "next/link";
import type { ReactElement } from "react";

const AddressExplorerLink = ({
  address,
  children
}: {
  address: string;
  children: ReactElement;
}) => {
  return (
    <Link
      href={`${POLYGONSCAN_URL}/address/${address}`}
      rel="noreferer noreferrer"
      target="_blank"
    >
      {children}
    </Link>
  );
};

export default AddressExplorerLink;
