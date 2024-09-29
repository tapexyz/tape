"use client";

import { components } from "./map";

export const Content = () => {
  return (
    <div className="space-y-10 scroll-smooth border-custom p-6 md:border-r">
      {components.map(({ id, label, component }) => (
        <div key={id} id={id} className="scroll-mt-32">
          <h2 className="font-semibold text-2xl tracking-tighter">{label}</h2>
          <div className="mt-4 rounded-card border border-primary/20 border-dashed p-6">
            {component()}
          </div>
        </div>
      ))}
    </div>
  );
};
