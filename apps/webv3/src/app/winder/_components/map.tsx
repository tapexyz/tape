import { IPFS_GATEWAY_URL, WORKER_AVATAR_URL } from "@tape.xyz/constants";
import {
  Avatar,
  AvatarImage,
  Badge,
  Button,
  Card,
  EmptyState,
  ShowMore,
  Spinner,
  ThemeSwitcher,
  ThemeSwitcherExpanded,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  VideoPlayer,
  toast
} from "@tape.xyz/winder";
import {
  ArrowsClockwise,
  Crown,
  CurrencyDollar,
  DeviceMobile,
  DotsThreeVertical,
  Heart,
  Info,
  Panorama,
  Plus,
  PlusCircle,
  ShareFat,
  Trash,
  USED_ICONS,
  Video,
  tw
} from "@tape.xyz/winder/common";
import Link from "next/link";

const VStack = ({
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

export const base = [
  {
    id: "brand",
    label: "Brand",
    component: () => {
      return <VStack>WIP</VStack>;
    }
  },
  {
    id: "icons",
    label: "Icons",
    component: () => (
      <div className="grid grid-cols-5 gap-5 md:grid-cols-12">
        {USED_ICONS.map(({ Icon, name }) => (
          <div key={name} className="p-3">
            <Icon className="size-5 shrink-0" />
          </div>
        ))}
      </div>
    )
  },
  {
    id: "colors",
    label: "Colors",
    description: "Shades of Black & White",
    component: () => {
      const blackShades = [
        "#000000F2",
        "#000000E6",
        "#000000D9",
        "#000000CC",
        "#000000BF",
        "#000000B3",
        "#000000A6",
        "#00000099",
        "#0000008C",
        "#00000080",
        "#00000073",
        "#00000066",
        "#00000059",
        "#0000004D",
        "#00000040",
        "#00000033",
        "#00000026",
        "#0000001A",
        "#0000000D"
      ];
      const whiteShades = [
        "#FFFFFFF2",
        "#FFFFFFE6",
        "#FFFFFFD9",
        "#FFFFFFCC",
        "#FFFFFFBF",
        "#FFFFFFB3",
        "#FFFFFFA6",
        "#FFFFFF99",
        "#FFFFFF8C",
        "#FFFFFF80",
        "#FFFFFF73",
        "#FFFFFF66",
        "#FFFFFF59",
        "#FFFFFF4D",
        "#FFFFFF40",
        "#FFFFFF33",
        "#FFFFFF26",
        "#FFFFFF1A",
        "#FFFFFF0D"
      ];
      return (
        <VStack>
          <div className="flex flex-wrap gap-0.5">
            {blackShades.map((color) => (
              <div
                key={color}
                className="size-10 flex-1 rounded-custom border border-custom"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-0.5">
            {whiteShades.map((color) => (
              <div
                key={color}
                className="size-10 flex-1 rounded-custom border border-custom"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </VStack>
      );
    }
  },
  {
    id: "typeface",
    label: "Typeface",
    component: () => {
      return (
        <VStack className="overflow-hidden">
          <Link
            href="https://pangrampangram.com/products/editorial-new"
            className="group space-y-4"
            target="_blank"
          >
            <div className="space-y-2">
              <div className="-mt-2 text-5xl">■</div>
              <div className="text-2xl">Editorial New</div>
            </div>
            <h1 className="select-none text-end font-serif text-9xl text-muted transition-colors duration-300 group-hover:text-primary">
              tape
            </h1>
          </Link>
          <Link
            href="https://vercel.com/font"
            className="group space-y-4"
            target="_blank"
          >
            <div className="space-y-2">
              <div className="text-4xl">▲</div>
              <div className="text-2xl">Geist Sans</div>
            </div>
            <h1 className="select-none text-end font-sans text-9xl text-muted transition-colors duration-300 group-hover:text-primary">
              tape
            </h1>
          </Link>
          <Link
            href="https://vercel.com/font"
            className="group space-y-4"
            target="_blank"
          >
            <div className="space-y-2">
              <div className="text-4xl">●</div>
              <div className="text-2xl">Geist Mono</div>
            </div>
            <h1 className="select-none text-end font-mono text-9xl text-muted transition-colors duration-300 group-hover:text-primary">
              1234
            </h1>
          </Link>
        </VStack>
      );
    }
  }
];

export const components = [
  {
    id: "avatar",
    label: "Avatar",
    component: () => {
      const image = <AvatarImage src={`${WORKER_AVATAR_URL}/0x2d`} />;
      return (
        <div className="flex flex-wrap items-center gap-2">
          <Avatar size="2xl">{image}</Avatar>
          <Avatar size="xl">{image}</Avatar>
          <Avatar size="lg">{image}</Avatar>
          <Avatar size="md">{image}</Avatar>
          <Avatar size="sm">{image}</Avatar>
          <Avatar size="xs">{image}</Avatar>
          <Avatar shape="circle" size="xs">
            {image}
          </Avatar>
          <Avatar shape="circle" size="sm">
            {image}
          </Avatar>
          <Avatar shape="circle" size="md">
            {image}
          </Avatar>
          <Avatar shape="circle" size="lg">
            {image}
          </Avatar>
          <Avatar shape="circle" size="xl">
            {image}
          </Avatar>
          <Avatar shape="circle" size="2xl">
            {image}
          </Avatar>
        </div>
      );
    }
  },
  {
    id: "badge",
    label: "Badge",
    component: () => {
      return (
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="inverted">Inverted</Badge>
          <Badge variant="fancy">
            <Crown className="mr-1 size-4" weight="duotone" />
            Fancy
          </Badge>
        </div>
      );
    }
  },
  {
    id: "button",
    label: "Button",
    component: () => {
      return (
        <VStack>
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
              Delete
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
              Delete
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
              Delete
            </Button>
          </div>
        </VStack>
      );
    }
  },
  {
    id: "card",
    label: "Card",
    component: () => {
      return (
        <div className="grid grid-flow-col grid-rows-2 gap-2">
          <Card className="h-64">
            <Video
              className="absolute top-5 right-6 size-5 text-muted"
              weight="thin"
            />
            This is a video, for example.
          </Card>
          <Card className="h-64">
            <Panorama
              className="absolute top-5 right-6 size-5 text-muted"
              weight="thin"
            />
            This is a thumbnail, for example.
          </Card>
          <Card className="row-span-2 min-h-96">
            <DeviceMobile
              className="absolute top-5 right-6 size-5 text-muted"
              weight="thin"
            />
            This is a byte, for example.
          </Card>
        </div>
      );
    }
  },
  {
    id: "description",
    label: "Description",
    component: () => {
      return (
        <VStack>
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
        </VStack>
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
      return (
        <VStack>
          <span>
            <Card className="h-64">
              <EmptyState
                title="No videos found"
                description="Creators can create videos by clicking the + button in the top right corner of the screen."
              />
            </Card>
          </span>
          <span>
            <Card className="h-64">
              <EmptyState
                title="No comments found"
                description="Users can comment on videos by clicking the + icon in the top right corner of the screen."
                action={
                  <Button
                    className="w-28"
                    variant="secondary"
                    onClick={() => toast.success("New comment created!")}
                  >
                    <span>Write</span>
                    <Plus className="size-5" />
                  </Button>
                }
              />
            </Card>
          </span>
        </VStack>
      );
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
    id: "player",
    label: "Player",
    component: () => {
      return (
        <div>
          <VideoPlayer
            src={`${IPFS_GATEWAY_URL}/bafybeidhpneide4akppcgx26j246juy6nqh6ibxp7olhk6br2r3aaatomi`}
            poster={`${IPFS_GATEWAY_URL}/bafybeiajrf65mlql6pgv24z6yfyaz3wromkk2rard6vpyuqtbv53f56yf4`}
            autoPlay={false}
          />
        </div>
      );
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
    id: "show-more",
    label: "Show more",
    component: () => {
      return <ShowMore onToggle={() => {}} />;
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
        <VStack>
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
        </VStack>
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
            className="text-green-500"
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
            className="text-destructive"
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
