"use client";

import { Button } from "@tape.xyz/winder";
import { useState } from "react";

export default function WinderPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="grid h-screen place-items-center">
      <div className="flex flex-col gap-10">
        <div>
          <Button
            label="Create"
            className="w-32"
            loading={loading}
            onClick={() => {
              if (loading) return;

              setLoading(true);

              setTimeout(() => {
                setLoading(false);
              }, 3500);
            }}
          />
        </div>
      </div>
    </div>
  );
}
