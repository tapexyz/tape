"use client";

import { Button } from "./_components/button";
import { Spinner } from "./_components/spinner";
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
        <div>
          <Spinner className="size-5" />
        </div>
      </div>
    </div>
  );
}
