import { useCallback, useMemo, useRef, useState } from "react";
import {
  type StateSnapshot,
  Virtuoso,
  VirtuosoGrid,
  type VirtuosoHandle
} from "react-virtuoso";

type VirtuosoHelperProps<T> = {
  data: T[];
  grid?: boolean;
  hasNextPage: boolean;
  endReached: () => void;
  restoreScroll?: boolean;
  itemContent: (index: number, item: T) => React.ReactNode;
};

export const Virtualized = <T extends { id: string }>({
  data,
  itemContent,
  endReached,
  hasNextPage,
  grid = false,
  restoreScroll = false
}: VirtuosoHelperProps<T>) => {
  const virtuoso = useRef<VirtuosoHandle>(null);
  const [virtuosoState, setVirtuosoState] = useState<StateSnapshot>({
    ranges: [],
    scrollTop: 0
  });

  const onScrolling = useCallback((scrolling: boolean) => {
    if (!scrolling && virtuoso?.current) {
      virtuoso.current.getState((state: StateSnapshot) => {
        setVirtuosoState({ ...state });
      });
    }
  }, []);

  const memoizedItemContent = useCallback(itemContent, [itemContent]);
  const memoizedEndReached = useCallback(
    () => (hasNextPage ? endReached() : null),
    [hasNextPage, endReached]
  );

  const commonProps = useMemo(
    () => ({
      ref: virtuoso,
      data,
      useWindowScroll: true,
      increaseViewportBy: 100,
      initialTopMostItemIndex: 0,
      endReached: memoizedEndReached,
      itemContent: memoizedItemContent,
      computeItemKey: (_index: number, item: T) => item.id,
      isScrolling: restoreScroll ? onScrolling : undefined
    }),
    [data, memoizedEndReached, memoizedItemContent, onScrolling, restoreScroll]
  );

  return grid ? (
    <VirtuosoGrid
      {...commonProps}
      listClassName="grid gap-x-2 gap-y-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    />
  ) : (
    <Virtuoso
      {...commonProps}
      restoreStateFrom={restoreScroll ? virtuosoState : undefined}
    />
  );
};
