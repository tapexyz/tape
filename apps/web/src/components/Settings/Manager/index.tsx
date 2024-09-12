import { Tabs, TabsContent, TabsList, TabsTrigger } from "@tape.xyz/ui";
import React from "react";

import MetaTags from "@/components/Common/MetaTags";

import LensManager from "./LensManager";
import Managers from "./Managers";
import Managing from "./Managing";

const ProfileManager = () => {
  return (
    <div className="space-y-4">
      <MetaTags title="Manager" />

      <div className="mb-2 space-y-2">
        <h1 className="text-brand-400 text-xl font-bold">Profile Manager</h1>
        <p className="opacity-80">
          Allows a profile to authorize specific addresses to handle its social
          operations.
        </p>
      </div>
      <Tabs defaultValue="managers">
        <TabsList>
          <TabsTrigger
            className="rounded-t-lg border-black px-4 py-1.5 text-sm font-medium data-[state=active]:border-b data-[state=active]:bg-gray-100 dark:border-white data-[state=active]:dark:bg-gray-800"
            value="managers"
          >
            Managers
          </TabsTrigger>
          <TabsTrigger
            className="rounded-t-lg border-black px-4 py-1.5 text-sm font-medium data-[state=active]:border-b data-[state=active]:bg-gray-100 dark:border-white data-[state=active]:dark:bg-gray-800"
            value="managing"
          >
            Managing
          </TabsTrigger>
        </TabsList>

        <div className="pb-2 pt-3">
          <TabsContent value="managers">
            <Managers />
          </TabsContent>
          <TabsContent value="managing">
            <Managing />
          </TabsContent>
        </div>
      </Tabs>

      <hr className="border-[0.5px] border-gray-200 dark:border-gray-800" />
      <LensManager />
    </div>
  );
};

export default ProfileManager;
