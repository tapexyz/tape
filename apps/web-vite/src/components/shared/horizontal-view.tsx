import { Button, CaretLeft, CaretRight } from "@tape.xyz/winder";
import { useRef } from "react";

type Props = {
  heading: string;
  children: React.ReactNode;
};

export const HorizontalView = ({ heading, children }: Props) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sectionOffsetWidth = sectionRef.current?.offsetWidth ?? 1000;
  const scrollOffset = sectionOffsetWidth / 1.2;

  const scroll = (offset: number) => {
    if (sectionRef.current) {
      sectionRef.current.scrollLeft += offset;
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-end justify-between">
        <h1 className="text-xl">{heading}</h1>
        <div className="inline-flex space-x-1.5">
          <Button
            size="icon"
            variant="outline"
            onClick={() => scroll(-scrollOffset)}
          >
            <CaretLeft className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => scroll(scrollOffset)}
          >
            <CaretRight className="size-4" />
          </Button>
        </div>
      </div>
      <div
        ref={sectionRef}
        className="no-scrollbar relative mt-5 flex items-start space-x-1.5 overflow-x-auto overflow-y-hidden scroll-smooth"
      >
        {children}
      </div>
    </div>
  );
};
