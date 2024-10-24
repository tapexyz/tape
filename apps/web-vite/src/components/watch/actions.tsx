import {
  ArrowsClockwise,
  Button,
  DotsThreeVertical,
  Heart,
  Lightning,
  ShareFat
} from "@tape.xyz/winder";

export const Actions = () => {
  return (
    <div className="flex items-center space-x-1.5 py-2 font-medium text-sm">
      <Button>
        <span>Collect</span>
        <Lightning className="size-5" weight="fill" />
      </Button>
      <Button size="icon" variant="secondary">
        <Heart className="size-5" weight="bold" />
      </Button>
      <Button size="icon" variant="secondary">
        <ShareFat className="size-5" weight="bold" />
      </Button>
      <Button size="icon" variant="secondary">
        <ArrowsClockwise className="size-5" weight="bold" />
      </Button>
      <Button size="icon" variant="secondary">
        <DotsThreeVertical className="size-5" weight="bold" />
      </Button>
    </div>
  );
};
