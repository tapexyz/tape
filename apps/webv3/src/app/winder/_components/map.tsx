import { IPFS_GATEWAY_URL, WORKER_AVATAR_URL } from "@tape.xyz/constants";
import { imageCdn } from "@tape.xyz/generic";
import {
  AudioPlayer,
  Avatar,
  AvatarImage,
  Badge,
  Button,
  Card,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  EmptyState,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ShowMore,
  Spinner,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  ThemeSwitcher,
  ThemeSwitcherExpanded,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  VPlayButton,
  VideoPlayer,
  toast
} from "@tape.xyz/winder";
import {
  ArrowsClockwise,
  Crown,
  CurrencyDollar,
  DotsThreeVertical,
  Heart,
  Info,
  Plus,
  PlusCircle,
  ShareFat,
  SignOut,
  Trash,
  USED_ICONS,
  User,
  tw
} from "@tape.xyz/winder/common";
import Link from "next/link";
import { useState } from "react";

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
              <DotsThreeVertical className="size-5" weight="bold" />
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
          <Card className="h-64">This is a video, for example.</Card>
          <Card className="h-64">This is a thumbnail, for example.</Card>
          <Card className="row-span-2 min-h-96">
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
    id: "dialog",
    label: "Dialog",
    component: () => {
      return (
        <div className="flex flex-wrap gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Image</Button>
            </DialogTrigger>
            <DialogContent className="p-0">
              <img
                className="size-full"
                loading="eager"
                src={imageCdn(
                  `${IPFS_GATEWAY_URL}/bafybeihoqqifnyzrx66h4i7om4f6prc7xgs3qydlce4ujrmjjazomyvoxq`
                )}
                alt="poster"
                draggable={false}
              />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <DialogClose>
                  <Button
                    onClick={() =>
                      toast.success("Permanently deleted", {
                        description:
                          "There is no turning back, careful next time!"
                      })
                    }
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    }
  },
  {
    id: "dropdown",
    label: "Dropdown",
    component: () => {
      return (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">My Profile</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem className="flex items-center gap-2">
                <User />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <PlusCircle />
                <span>Create</span>
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Publication</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Mirror</DropdownMenuItem>
                    <DropdownMenuItem>Collect</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuItem className="flex items-center gap-2">
                <SignOut />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
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
      return (
        <Card className="flex flex-col space-y-6">
          <Input placeholder="Enter recipient" />
          <Input placeholder="Enter your first name" label="First Name" />
        </Card>
      );
    }
  },
  {
    id: "player",
    label: "Player",
    component: () => {
      return (
        <VStack>
          <span>
            <VideoPlayer
              className="rounded-card-sm"
              src={{
                src: `${IPFS_GATEWAY_URL}/bafybeidmkqbs66odew6ddtiwgpjmmirk4lh5uux7w4bheeogjwlagefoje`,
                type: "video/mp4"
              }}
              poster={imageCdn(
                `${IPFS_GATEWAY_URL}/bafybeiaikdpxnqig7ta5z5ahqav7p2z3lrijp5ym3ctg4on5reiktdh2lu`
              )}
              load="visible"
              autoPlay={false}
            />
          </span>
          <div className="grid gap-2 md:grid-cols-2">
            <VideoPlayer
              aspectRatio="9/16"
              className="rounded-card-sm"
              src={{
                src: `${IPFS_GATEWAY_URL}/bafybeifwjnt5mkuneq4taxc2ybpfkhri6h6ipqfjnsndcvguxklwbumrse`,
                type: "video/mp4"
              }}
              poster={`${IPFS_GATEWAY_URL}/bafybeib3rptof3clasb4llm247zupf5pspequwu5wntzedn5nnh75ljgea`}
              load="visible"
              autoPlay={false}
              loop={true}
              top={
                <div className="flex justify-end">
                  <VPlayButton />
                </div>
              }
            />
            <div className="flex flex-col gap-[6px]">
              <div className="grid flex-1 place-items-center rounded-card-sm border border-primary/20 border-dashed p-6 font-serif text-2xl">
                Audio
              </div>
              <AudioPlayer
                src={{
                  src: `${IPFS_GATEWAY_URL}/bafybeihj5l4agwyv276nvwdpdey4wp646c2lqrfjmq4v6hmttszb3gd4xm`,
                  type: "audio/mp3"
                }}
                poster={`${IPFS_GATEWAY_URL}/bafkreiam4w73hooyzel2674k6vr52civh4miazhfuxefqpy6n4qwqvwtp4`}
                load="visible"
                autoPlay={false}
              />
            </div>
          </div>
          <div className="no-scrollbar overflow-x-auto">
            <AudioPlayer
              src={{
                src: `${IPFS_GATEWAY_URL}/QmQSZHzsR3nhqJYPo8RC9eCUptTh2BVqGWzMDWwqbcyzrd`,
                type: "audio/mp3"
              }}
              poster={imageCdn(
                `${IPFS_GATEWAY_URL}/QmVg5mLJJsx9JZvyR6j4ej1b8WGBXZmi9bQNbwQDQ7pLEc`
              )}
              load="visible"
              layout="horizontal"
              autoPlay={false}
            />
          </div>
        </VStack>
      );
    }
  },
  {
    id: "select",
    label: "Select",
    component: () => {
      return (
        <VStack>
          <div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </VStack>
      );
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
      const [loading, setLoading] = useState(false);
      return (
        <VStack>
          <div className="flex flex-wrap items-center gap-2">
            <Spinner className="size-4" />
            <Spinner className="size-5" />
            <Spinner className="size-6" />
            <Spinner className="size-7" />
            <Spinner className="size-6" />
            <Spinner className="size-5" />
            <Spinner className="size-4" />
          </div>
          <div className="inline-flex flex-wrap items-center gap-2">
            <Button
              className="w-32"
              loading={loading}
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                }, 2000);
              }}
            >
              Post now
            </Button>
            <Button
              variant="destructive"
              className="w-32"
              loading={loading}
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                }, 2000);
              }}
            >
              Delete
            </Button>
          </div>
        </VStack>
      );
    }
  },
  {
    id: "switch",
    label: "Switch",
    component: () => <Switch label="Collectible" />
  },
  {
    id: "tabs",
    label: "Tabs",
    component: () => {
      return (
        <VStack>
          <Tabs defaultValue="all-time">
            <TabsList className="text-lg">
              <TabsTrigger value="all-time">All time</TabsTrigger>
              <TabsTrigger value="month">This month</TabsTrigger>
              <TabsTrigger value="week">This week</TabsTrigger>
            </TabsList>
            <TabsContent value="all-time">
              <Card>Content all time.</Card>
            </TabsContent>
            <TabsContent value="month">
              <Card>Content this month.</Card>
            </TabsContent>
            <TabsContent value="week">
              <Card>Content this week.</Card>
            </TabsContent>
          </Tabs>
          <Tabs defaultValue="videos">
            <TabsList className="text-xl">
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="bytes">Bytes</TabsTrigger>
            </TabsList>
            <TabsContent value="videos">
              <Card>All your videos are here.</Card>
            </TabsContent>
            <TabsContent value="bytes">
              <Card>All your bytes are here.</Card>
            </TabsContent>
          </Tabs>
        </VStack>
      );
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
      return (
        <Card className="flex flex-col space-y-6">
          <Textarea placeholder="More about yourself" />
          <Textarea placeholder="More about the video" label="Description" />
        </Card>
      );
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
