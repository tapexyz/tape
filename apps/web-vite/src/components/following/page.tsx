import { Tabs, TabsContent, TabsList, TabsTrigger } from "@tape.xyz/winder";

export const FollowingPage = () => {
  return (
    <div className="flex flex-col justify-between space-y-36 rounded-card bg-theme p-5">
      <h1 className="font-serif text-[58px] leading-[58px]">Following</h1>
      <Tabs defaultValue="all-time">
        <TabsList className="text-[20px]">
          <TabsTrigger value="all-time">All time</TabsTrigger>
          <TabsTrigger value="this-month">This month</TabsTrigger>
          <TabsTrigger value="this-week">This week</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
        </TabsList>
        <TabsContent value="all-time">
          <div>Content all time.</div>
        </TabsContent>
        <TabsContent value="this-month">
          <div>Content this month.</div>
        </TabsContent>
        <TabsContent value="this-week">
          <div>Content this week.</div>
        </TabsContent>
        <TabsContent value="today">
          <div>Content today.</div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
