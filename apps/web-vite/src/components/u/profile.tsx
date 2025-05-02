import { getAccountMetadata } from "@/helpers/metadata";
import { useAccountSuspenseQuery } from "@/queries/account";
import { Route } from "@/routes/_layout-hoc/u/$handle";
import { WORKER_AVATAR_URL } from "@tape.xyz/constants";
import type { Account } from "@tape.xyz/indexer";
import {
  Avatar,
  AvatarImage,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  XLogo,
  YoutubeLogo
} from "@tape.xyz/winder";
import { Actions } from "./actions";
import { Bytes } from "./bytes";
import { Stats } from "./stats";
import { Videos } from "./videos";

export const Profile = () => {
  const { handle: handleParam } = Route.useParams();
  const { data } = useAccountSuspenseQuery(handleParam);

  if (!data?.account) {
    return null;
  }

  const account = data.account as Account;

  const { name, bio, handleWithPrefix, picture, coverPicture } =
    getAccountMetadata(account);

  return (
    <div>
      <div className="relative">
        <img
          src={coverPicture}
          className="-z-10 h-72 w-full select-none object-cover"
          alt="cover"
          draggable={false}
        />
        <div className="absolute bottom-0 h-10 w-full bg-gradient-to-t from-theme dark:from-theme" />
      </div>
      <div className="space-y-5 p-5">
        <div className="-mt-[100px] relative z-10 flex">
          <div className="flex w-full items-end justify-between">
            <span className="rounded-xl bg-theme p-1">
              <Avatar size="3xl">
                <AvatarImage src={picture} />
              </Avatar>
            </span>
            <div className="flex items-center space-x-1.5">
              <div className="flex">
                <span className="-space-x-1.5 flex rounded-full bg-primary/10 p-1">
                  {[6000, 3090, 4000, 5600].map((item) => (
                    <Avatar size="xs" shape="circle" key={item}>
                      <AvatarImage src={`${WORKER_AVATAR_URL}/${item}`} />
                    </Avatar>
                  ))}
                </span>
              </div>

              <Button variant="outline" size="icon">
                <YoutubeLogo className="size-5" weight="fill" />
              </Button>
              <Button variant="outline" size="icon">
                <XLogo className="size-5" weight="fill" />
              </Button>
              <span>
                <div className="mx-3 h-5 w-[1px] rounded-sm bg-primary/10" />
              </span>
              <Actions />
            </div>
          </div>
        </div>
        <div className="space-y-2.5">
          <span className="font-semibold">{handleWithPrefix}</span>
          <h1 className="font-serif text-[44px] leading-[44px]">{name}</h1>
          <Stats address={account.address} />

          <div>{bio && <p className="my-6">{bio}</p>}</div>

          <Tabs defaultValue="videos">
            <TabsList className="text-[20px]">
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="bytes">Bytes</TabsTrigger>
            </TabsList>
            <TabsContent value="videos" className="mt-4">
              <Videos address={account.address} />
            </TabsContent>
            <TabsContent value="bytes" className="mt-4">
              <Bytes address={account.address} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
