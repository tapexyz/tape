import { Badge, BellSimple, Button } from "@tape.xyz/winder";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@tape.xyz/winder";

export const Notifications = () => {
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
      <PopoverContent align="end" className="w-96">
        <Tabs defaultValue="unread">
          <TabsList>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="all-time">All time</TabsTrigger>
          </TabsList>
          <TabsContent value="unread">
            <div>unread</div>
          </TabsContent>
          <TabsContent value="all-time">
            <div>all time</div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};
