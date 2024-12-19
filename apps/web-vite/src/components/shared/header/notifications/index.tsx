import { useNotificationsQuery } from "@/queries/notification";
import type { Notification } from "@tape.xyz/indexer";
import { Badge, BellSimple, Button } from "@tape.xyz/winder";
import { Popover, PopoverContent, PopoverTrigger } from "@tape.xyz/winder";
import { Virtualized } from "../../virtualized";
import { Followed } from "./followed";

export const Notifications = () => {
  const { data, hasNextPage, fetchNextPage } = useNotificationsQuery();

  const notifications = data?.pages.flatMap(
    (page) => page.notifications.items
  ) as Notification[];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          <Button size="icon" variant="secondary" className="text-primary/50">
            <BellSimple className="size-5" weight="bold" />
          </Button>
          <Badge className="-top-1 -left-1 absolute z-10 size-4 justify-center bg-[#2A59FF] p-0 text-[10px] text-white">
            6
          </Badge>
        </div>
      </PopoverTrigger>
      <PopoverContent align="end" className="min-h-[500px] w-96">
        <h6 className="p-4 font-medium text-lg">Notifications</h6>
        <hr className="w-full border-custom" />
        <Virtualized
          data={notifications}
          endReached={fetchNextPage}
          hasNextPage={hasNextPage}
          itemContent={(_index, notification) => {
            if (notification.__typename === "FollowNotification") {
              return <Followed notification={notification} />;
            }
            return null;
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
