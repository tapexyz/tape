import "tippy.js/themes/light.css";
import "tippy.js/themes/translucent.css";
import "tippy.js/dist/tippy.css";

import { tw } from "@tape.xyz/browser";
import Tippy from "@tippyjs/react";
import { useTheme } from "next-themes";
import type React from "react";
import type { Placement } from "tippy.js";

type Props = {
  children: React.ReactElement;
  content: React.ReactNode;
  placement?: Placement;
  visible?: boolean;
};

export const Tooltip = ({
  children,
  content,
  visible = true,
  placement = "bottom",
  ...props
}: Props) => {
  const { resolvedTheme } = useTheme();
  return (
    <Tippy
      {...props}
      placement={placement}
      content={content}
      arrow={false}
      theme={resolvedTheme === "dark" ? "translucent" : "light"}
      className={tw("!rounded-lg !font-normal hidden", {
        "sm:block": visible
      })}
    >
      {children}
    </Tippy>
  );
};
