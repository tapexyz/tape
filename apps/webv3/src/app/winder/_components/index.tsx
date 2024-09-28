import {
  Button,
  Spinner,
  ThemeSwitcher,
  ThemeSwitcherExpanded,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  toast
} from "@tape.xyz/winder";
import {
  ArrowsClockwise,
  CurrencyDollar,
  DotsThreeVertical,
  Heart,
  Info,
  PlusCircle,
  ShareFat,
  Trash,
  tw
} from "@tape.xyz/winder/common";

const Wrapper = ({
  children,
  className
}: Readonly<{ children: React.ReactNode; className?: string }>) => {
  return (
    <div
      className={tw(
        "flex flex-col divide-y divide-dashed divide-custom *:py-6 [&>*:first-child]:pt-0 [&>*:last-child]:pb-0",
        className
      )}
    >
      {children}
    </div>
  );
};

export const components = [
  {
    id: "avatar",
    label: "Avatar",
    component: () => {
      return <div>Avatar</div>;
    }
  },
  {
    id: "button",
    label: "Button",
    component: () => {
      return (
        <Wrapper>
          <div className="flex flex-wrap gap-2">
            <Button size="icon">
              <Heart className="size-5" />
            </Button>
            <Button size="icon" variant="secondary">
              <ArrowsClockwise className="size-5" />
            </Button>
            <Button size="icon" variant="secondary">
              <ShareFat className="size-5" />
            </Button>
            <Button size="icon" variant="secondary">
              <DotsThreeVertical className="size-5" />
            </Button>
            <Button size="icon" variant="destructive">
              <Trash className="size-5" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button className="w-28">Upload</Button>
            <Button className="w-28" variant="secondary">
              Upload
            </Button>
            <Button className="w-28" variant="destructive">
              Upload
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button className="w-28" loading={true}>
              Upload
            </Button>
            <Button className="w-28" variant="secondary" loading={true}>
              Upload
            </Button>
            <Button className="w-28" variant="destructive" loading={true}>
              Upload
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button className="w-28">
              <span>Upload</span>
              <PlusCircle className="size-5" />
            </Button>
            <Button className="w-28" variant="secondary">
              <span>Upload</span>
              <PlusCircle className="size-5" />
            </Button>
            <Button className="w-28" variant="destructive">
              <span>Delete</span>
              <Trash className="size-5" />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" className="w-28">
              Upload
            </Button>
            <Button size="md" className="w-28" variant="secondary">
              Upload
            </Button>
            <Button size="lg" className="w-28" variant="secondary">
              Upload
            </Button>
            <Button size="xl" className="w-28" variant="destructive">
              Upload
            </Button>
          </div>
        </Wrapper>
      );
    }
  },
  {
    id: "card",
    label: "Card",
    component: () => {
      return <div>Card</div>;
    }
  },
  {
    id: "description",
    label: "Description",
    component: () => {
      return (
        <Wrapper>
          <p>
            Go behind the scenes of an electrifying street performance that
            showcases raw talent and vibrant urban culture. Experience the
            energy, passion, and creativity that bring the city’s streets to
            life, all captured through a dynamic, artistic lens.
          </p>
          <p className="line-clamp-2">
            Go behind the scenes of an electrifying street performance that
            showcases raw talent and vibrant urban culture. Experience the
            energy, passion, and creativity that bring the city’s streets to
            life, all captured through a dynamic, artistic lens.
          </p>
        </Wrapper>
      );
    }
  },
  {
    id: "dropdown",
    label: "Dropdown",
    component: () => {
      return <div>Dropdown</div>;
    }
  },
  {
    id: "empty-state",
    label: "Empty State",
    component: () => {
      return <div>Empty State</div>;
    }
  },
  {
    id: "floating-nav",
    label: "Floating Nav",
    component: () => {
      return <div>Floating Nav</div>;
    }
  },
  {
    id: "input",
    label: "Input",
    component: () => {
      return <div>Input</div>;
    }
  },
  {
    id: "modal",
    label: "Modal",
    component: () => {
      return <div>Modal</div>;
    }
  },
  {
    id: "popover",
    label: "Popover",
    component: () => {
      return <div>Popover</div>;
    }
  },
  {
    id: "select",
    label: "Select",
    component: () => {
      return <div>Select</div>;
    }
  },
  {
    id: "spinner",
    label: "Spinner",
    component: () => {
      return (
        <div className="flex flex-wrap items-center gap-2">
          <Spinner className="size-4" />
          <Spinner className="size-5" />
          <Spinner className="size-6" />
          <Spinner className="size-7" />
          <Spinner className="size-6" />
          <Spinner className="size-5" />
          <Spinner className="size-4" />
        </div>
      );
    }
  },
  {
    id: "switch",
    label: "Switch",
    component: () => {
      return <div>Switch</div>;
    }
  },
  {
    id: "tabs",
    label: "Tabs",
    component: () => {
      return <div>Tabs</div>;
    }
  },
  {
    id: "text",
    label: "Text",
    component: () => {
      return (
        <Wrapper>
          <p className="font-serif text-6xl">Remix till it works</p>
          <p className="font-bold text-5xl">Remix till it works</p>
          <p className="font-semibold text-4xl">Remix till it works</p>
          <p className="font-medium text-3xl">Remix till it works</p>
          <p className="text-2xl">Remix till it works</p>
          <p className="text-xl">Remix till it works</p>
          <p className="text-lg">Remix till it works</p>
          <p className="text-base">Remix till it works</p>
          <p className="text-sm">Remix till it works</p>
          <p className="text-xs">Remix till it works</p>
        </Wrapper>
      );
    }
  },
  {
    id: "textarea",
    label: "Textarea",
    component: () => {
      return <div>Textarea</div>;
    }
  },
  {
    id: "theme-switcher",
    label: "Theme Switcher",
    component: () => {
      return (
        <div className="flex gap-2">
          <ThemeSwitcher />
          <ThemeSwitcherExpanded id="winder-content" />
        </div>
      );
    }
  },
  {
    id: "toast",
    label: "Toast",
    component: () => {
      return (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => toast("You clicked the button!")}
            variant="secondary"
          >
            Toast
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast("Oh wait...", {
                description: "You are awesome!"
              })
            }
          >
            Description
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast.success("Yay!", {
                description: "Successfully toasted"
              })
            }
          >
            Success
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast.error("Oops, something went wrong", {
                description: "There was an error toasting, please try again"
              })
            }
          >
            Error
          </Button>
        </div>
      );
    }
  },
  {
    id: "tooltip",
    label: "Tooltip",
    component: () => {
      return (
        <div className="flex items-center gap-6">
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger>
                <Info className="size-5" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Something informative</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip delayDuration={200}>
              <TooltipTrigger>
                <CurrencyDollar className="size-5" />
              </TooltipTrigger>
              <TooltipContent>
                <p>This is a dollar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    }
  }
];
