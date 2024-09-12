import type { Metadata } from "next";
import type React from "react";

import common from "@/common";

export const metadata: Metadata = common;

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
