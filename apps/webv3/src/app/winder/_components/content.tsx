"use client";

import { IntroSection } from "./intro";
import { base, components } from "./map";

const ContentItem = ({ item }: { item: (typeof base)[0] }) => (
  <div id={item.id} className="scroll-mt-[135px] space-y-9">
    <div className="space-y-4">
      <h2 className="font-serif text-3xl">{item.label}</h2>
      <p>{item.description}</p>
    </div>
    <div className="rounded-card border border-primary/20 border-dashed p-6">
      {item.component()}
    </div>
  </div>
);

export const Content = () => {
  const contentItems = [...base, ...components];

  return (
    <div className="space-y-20 scroll-smooth border-custom p-6 md:border-r">
      <IntroSection />
      {contentItems.map((item) => (
        <ContentItem key={item.id} item={item} />
      ))}
    </div>
  );
};
