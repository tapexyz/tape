import { Tabs, TabsContent, TabsList, TabsTrigger } from "@tape.xyz/winder";

export const Curated = () => {
  return (
    <Tabs defaultValue="all-time">
      <div className="space-x-10 text-xl">
        <span>Curated by Tape</span>
        <TabsList>
          <TabsTrigger value="all-time">All time</TabsTrigger>
          <TabsTrigger value="this-month">This month</TabsTrigger>
          <TabsTrigger value="this-week">This week</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="all-time">
        <div>Content all time.</div>
      </TabsContent>
      <TabsContent value="month">
        <div>Content this month.</div>
      </TabsContent>
      <TabsContent value="week">
        <div>Content this week.</div>
      </TabsContent>
    </Tabs>
  );
};
