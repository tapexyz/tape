import { STATIC_FILES, WORKER_AVATAR_URL } from "@tape.xyz/constants";
import {
  AudioPlayer,
  Avatar,
  AvatarImage,
  Badge,
  BellSimple,
  Button,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
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
  TooltipTrigger,
  VPlayButton,
  VideoPlayer,
  X,
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
} from "@tape.xyz/winder";
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
      return (
        <VStack>
          <span>
            <img
              src={`${STATIC_FILES}/images/brand/wordmark-xy.svg`}
              className="h-80 w-full rounded-card bg-white object-cover object-center"
              alt="wordmark-xy"
              draggable={false}
            />
          </span>
          <span>
            <img
              src={`${STATIC_FILES}/images/brand/wordmark-dark.svg`}
              className="h-64 w-full rounded-card bg-white object-cover"
              alt="wordmark-dark"
              draggable={false}
            />
          </span>
          <div className="grid grid-cols-3">
            <img
              src={`${STATIC_FILES}/images/brand/mark-dark.svg`}
              className="aspect-square rounded-l-card bg-white p-10"
              alt="mark-dark"
              draggable={false}
            />
            <img
              src={`${STATIC_FILES}/images/brand/mark.svg`}
              className="aspect-square p-10"
              alt="mark"
              draggable={false}
            />
            <img
              src={`${STATIC_FILES}/images/brand/mark-light.svg`}
              className="aspect-square rounded-r-card bg-black p-10"
              alt="mark-light"
              draggable={false}
            />
          </div>
          <span>
            <img
              src={`${STATIC_FILES}/images/brand/wordmark-light.svg`}
              className="h-64 w-full rounded-card bg-black object-cover"
              alt="wordmark-light"
              draggable={false}
            />
          </span>
        </VStack>
      );
    }
  },
  {
    id: "icons",
    label: "Icons",
    description: "A collection of icons used throughout the product.",
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
    description:
      "The three typefaces that defines the look and feel of the brand.",
    component: () => {
      return (
        <VStack className="overflow-hidden">
          <a
            href="https://rsms.me/inter"
            className="group space-y-4"
            target="_blank"
            rel="noreferrer"
          >
            <div className="space-y-2">
              <div className="text-4xl">▲</div>
              <div className="text-2xl">Inter</div>
            </div>
            <h1 className="select-none text-end text-9xl text-muted transition-colors duration-300 group-hover:text-primary">
              tape
            </h1>
          </a>
          <a
            href="https://pangrampangram.com/products/editorial-new"
            className="group space-y-4"
            target="_blank"
            rel="noreferrer"
          >
            <div className="space-y-2">
              <div className="text-4xl">■</div>
              <div className="font-serif text-2xl">Editorial New</div>
            </div>
            <h1 className="select-none text-end font-serif text-9xl text-muted transition-colors duration-300 group-hover:text-primary">
              tape
            </h1>
          </a>
          <a
            href="https://vercel.com/font"
            className="group space-y-4"
            target="_blank"
            rel="noreferrer"
          >
            <div className="space-y-2">
              <div className="text-4xl">●</div>
              <div className="text-2xl">Geist Mono</div>
            </div>
            <h1 className="select-none text-end font-mono text-9xl text-muted transition-colors duration-300 group-hover:text-primary">
              1234
            </h1>
          </a>
        </VStack>
      );
    }
  }
];

export const components = [
  {
    id: "avatar",
    label: "Avatar",
    description: "An avatar is a visual representation of a user.",
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
    description: "A label that emphasizes an element that requires attention",
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
    description: "A clickable element that performs an action",
    component: () => {
      return (
        <VStack>
          <div className="flex flex-wrap gap-2">
            <Button size="icon">
              <Heart className="size-5" />
            </Button>
            <Button size="icon" variant="outline">
              <ArrowsClockwise className="size-5" />
            </Button>
            <Button size="icon" variant="secondary">
              <ShareFat className="size-5" />
            </Button>
            <Button size="icon" variant="outline">
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
            <Button className="w-28" variant="outline">
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
            <Button className="w-28" variant="outline" loading={true}>
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
            <Button className="w-28" variant="outline">
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
            <Button size="lg" className="w-28" variant="outline">
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
    id: "description",
    label: "Description",
    description:
      "Brief text that provides additional information about a feature or media",
    component: () => (
      <VStack>
        <p>
          Go behind the scenes of an electrifying street performance that
          showcases raw talent and vibrant urban culture. Experience the energy,
          passion, and creativity that bring the city’s streets to life, all
          captured through a dynamic, artistic lens.
        </p>
        <p className="line-clamp-2">
          Go behind the scenes of an electrifying street performance that
          showcases raw talent and vibrant urban culture. Experience the energy,
          passion, and creativity that bring the city’s streets to life, all
          captured through a dynamic, artistic lens.
        </p>
      </VStack>
    )
  },
  {
    id: "dialog",
    label: "Dialog",
    description: "A modal window that appears on top of the page",
    component: () => (
      <div className="flex flex-wrap gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Image</Button>
          </DialogTrigger>
          <DialogContent>
            <img
              className="size-full"
              loading="eager"
              src={`${STATIC_FILES}/images/torb.png`}
              alt="poster"
              draggable={false}
            />
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete</Button>
          </DialogTrigger>
          <DialogContent className="gap-4 p-6">
            <DialogHeader className="space-y-2">
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
            <DialogClose className="absolute top-5 right-5 rounded-full p-1 opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none">
              <X />
              <span className="sr-only">Close</span>
            </DialogClose>
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
    )
  },
  {
    id: "dropdown",
    label: "Dropdown",
    description: "A menu that displays a list of options",
    component: () => (
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">My Profile</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            <DropdownMenuItem className="flex items-center gap-2">
              <User />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <PlusCircle />
              <span>Create</span>
            </DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center gap-2">
                <PlusCircle />
                <span>Publication</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="w-44">
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
    )
  },
  {
    id: "empty-state",
    label: "Empty State",
    description: "A placeholder for when there is no content to display",
    component: () => (
      <VStack>
        <span>
          <div className="grid h-64 place-items-center">
            <EmptyState
              title="No videos found"
              description="Creators can create videos by clicking the + button in the top right corner of the screen."
            />
          </div>
        </span>
        <span>
          <div className="grid h-64 place-items-center">
            <EmptyState
              title="No comments found"
              description="Users can comment on videos by clicking the + icon in the top right corner of the screen."
              more={
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
          </div>
        </span>
      </VStack>
    )
  },
  {
    id: "input",
    label: "Input",
    description: "A field for entering text",
    component: () => (
      <div className="flex flex-col space-y-6">
        <Input placeholder="Enter recipient" />
        <Input placeholder="Enter your first name" label="First Name" />
      </div>
    )
  },
  {
    id: "player",
    label: "Player",
    description: "A media player that plays video or audio files",
    component: () => (
      <VStack>
        <span>
          <VideoPlayer
            className="rounded-card-sm"
            posterClassName="rounded-card-sm"
            src={{
              src: "https://files.tape.xyz/samples/16-9.mp4",
              type: "video/mp4"
            }}
            poster={`${STATIC_FILES}/images/poster-16-9.png`}
            load="visible"
            posterLoad="idle"
            autoPlay={false}
          />
        </span>
        <div className="grid gap-2 md:grid-cols-2">
          <VideoPlayer
            aspectRatio="9/16"
            className="rounded-card-sm"
            posterClassName="rounded-card-sm"
            src={{
              src: "https://files.tape.xyz/samples/9-16.mp4",
              type: "video/mp4"
            }}
            poster={`${STATIC_FILES}/images/poster-9-16.png`}
            load="visible"
            posterLoad="idle"
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
                src: "https://files.tape.xyz/samples/audio-1.mp3",
                type: "audio/mp3"
              }}
              poster={`${STATIC_FILES}/images/poster-1-1.png`}
              load="visible"
              posterLoad="idle"
              autoPlay={false}
            />
          </div>
        </div>
        <div className="no-scrollbar overflow-x-auto">
          <AudioPlayer
            src={{
              src: "https://files.tape.xyz/samples/audio-2.wav",
              type: "audio/mp3"
            }}
            poster={`${STATIC_FILES}/images/poster-1-1.jpeg`}
            load="visible"
            posterLoad="idle"
            layout="horizontal"
            autoPlay={false}
          />
        </div>
      </VStack>
    )
  },
  {
    id: "popover",
    label: "Popover",
    description: "Displays rich content in a portal, triggered by a button",
    component: () => (
      <Popover>
        <PopoverTrigger>
          <Button variant="secondary" size="icon">
            <BellSimple />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="p-4">
          <h1 className="mb-2 font-medium text-xl">Notifications</h1>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem nobis
          quidem similique! Consequatur ut quasi fugit ex earum cumque
          temporibus ab fugiat! Ipsa quis repudiandae fugit reprehenderit facere
          voluptatem corporis!
        </PopoverContent>
      </Popover>
    )
  },
  {
    id: "select",
    label: "Select",
    description: "Display a dropdown list of items",
    component: () => (
      <VStack>
        <div>
          <Select defaultValue="light">
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
          <Select defaultValue="light">
            <SelectTrigger className="w-1/2">
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
          <Select defaultValue="light">
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
    )
  },
  {
    id: "show-more",
    label: "Show more",
    description: "A button that expands a section to show more content",
    component: () => {
      return <ShowMore onToggle={() => {}} />;
    }
  },
  {
    id: "spinner",
    label: "Spinner",
    description:
      "A loading indicator that indicates that a task is in progress",
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
              variant="secondary"
              className="w-32"
              loading={loading}
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                }, 2000);
              }}
            >
              Submit
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
    description:
      "A toggle switch that allows users to turn an option on or off",
    component: () => <Switch label="Collectible" />
  },
  {
    id: "tabs",
    label: "Tabs",
    description: "A set of tabs that display different content",
    component: () => {
      return (
        <VStack>
          <Tabs defaultValue="all-time">
            <TabsList className="text-lg">
              <TabsTrigger value="all-time">All time</TabsTrigger>
              <TabsTrigger value="month">This month</TabsTrigger>
              <TabsTrigger value="week">This week</TabsTrigger>
            </TabsList>
            <TabsContent value="all-time" className="mt-4">
              <div>Content all time.</div>
            </TabsContent>
            <TabsContent value="month" className="mt-4">
              <div>Content this month.</div>
            </TabsContent>
            <TabsContent value="week" className="mt-4">
              <div>Content this week.</div>
            </TabsContent>
          </Tabs>
          <Tabs defaultValue="videos">
            <TabsList className="text-xl">
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="bytes">Bytes</TabsTrigger>
            </TabsList>
            <TabsContent value="videos" className="mt-4">
              <div>All your videos are here.</div>
            </TabsContent>
            <TabsContent value="bytes" className="mt-4">
              <div>All your bytes are here.</div>
            </TabsContent>
          </Tabs>
        </VStack>
      );
    }
  },
  {
    id: "text",
    label: "Text",
    description: "A block of text that displays information",
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
    description: "A field for entering multiple lines of text",
    component: () => {
      return (
        <div className="flex flex-col space-y-6">
          <Textarea placeholder="More about yourself" />
          <Textarea placeholder="More about the video" label="Description" />
        </div>
      );
    }
  },
  {
    id: "theme-switcher",
    label: "Theme Switcher",
    description: "A button that toggles between light and dark themes",
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
    description: "A succinct message that is displayed temporarily",
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
    description: "A brief message that provides additional information",
    component: () => {
      return (
        <div className="flex items-center gap-6">
          <Tooltip>
            <TooltipTrigger>
              <Info className="size-5" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Something informative</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <CurrencyDollar className="size-5" />
            </TooltipTrigger>
            <TooltipContent>
              <p>This is a dollar</p>
            </TooltipContent>
          </Tooltip>
        </div>
      );
    }
  }
];
