import { useRef } from "react";
import {
  type StateSnapshot,
  Virtuoso,
  type VirtuosoHandle
} from "react-virtuoso";

type VirtuosoHelperProps<T> = {
  data: T[];
  itemContent: (index: number, item: T) => React.ReactNode;
  endReached: () => void;
  hasNextPage: boolean;
  restoreScroll?: boolean;
};

let virtuosoState: StateSnapshot = { ranges: [], scrollTop: 0 };

export const Virtualized = <T,>({
  data,
  itemContent,
  endReached,
  hasNextPage,
  restoreScroll = false
}: VirtuosoHelperProps<T>) => {
  const virtuoso = useRef<VirtuosoHandle>(null);

  const onScrolling = (scrolling: boolean) => {
    if (!scrolling && virtuoso?.current) {
      virtuoso.current.getState((state: StateSnapshot) => {
        virtuosoState = { ...state };
      });
    }
  };

  return (
    <Virtuoso
      ref={virtuoso}
      data={data}
      useWindowScroll
      increaseViewportBy={100}
      initialTopMostItemIndex={0}
      itemContent={itemContent}
      computeItemKey={(_index, item) => (item as any).id}
      endReached={() => (hasNextPage ? endReached() : null)}
      isScrolling={restoreScroll ? onScrolling : undefined}
      restoreStateFrom={restoreScroll ? virtuosoState : undefined}
    />
  );
};
