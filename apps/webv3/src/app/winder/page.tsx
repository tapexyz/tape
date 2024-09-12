"use client";

import { Button } from "./_components/button";
import { Tabs } from "./_components/tabs";

export default function WinderPage() {
  return (
    <div className="grid h-screen place-items-center">
      <div className="flex flex-col gap-10">
        <div>
          <Button />
        </div>
        <div>
          <Tabs />
        </div>
      </div>
    </div>
  );
}
