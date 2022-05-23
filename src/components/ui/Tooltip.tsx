import "tippy.js/dist/tippy.css";
import "tippy.js/themes/material.css";
import "tippy.js/themes/light-border.css";

import Tippy from "@tippyjs/react";
import clsx from "clsx";
import { useTheme } from "next-themes";
import React from "react";
import type { Placement } from "tippy.js";

type Props = {
  children: React.ReactElement;
  content: React.ReactNode;
  placement?: Placement;
  className?: string;
};

const Tooltip = ({
  children,
  content,
  placement = "bottom",
  className,
  ...props
}: Props) => {
  const { theme } = useTheme();

  return (
    <Tippy
      {...props}
      placement={placement}
      content={content}
      arrow={false}
      className={clsx(
        className,
        "!shadow md:block hidden !font-medium !rounded !px-2"
      )}
      theme={theme === "dark" ? "material" : "light-border"}
    >
      {children}
    </Tippy>
  );
};

export default Tooltip;
