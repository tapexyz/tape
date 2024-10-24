import { Actions } from "./actions";
import { Stats } from "./stats";

export const StatsAndActions = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-5">
      <Stats />
      <Actions />
    </div>
  );
};
