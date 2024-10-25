import { Button, DotsThreeVertical, UserPlus } from "@tape.xyz/winder";

export const Actions = () => {
  return (
    <>
      <Button variant="secondary" size="icon">
        <DotsThreeVertical className="size-5" weight="bold" />
      </Button>
      <Button>
        <span className="inline-flex space-x-1.5">
          <span>Follow</span>
          <UserPlus className="size-5" />
        </span>
      </Button>
    </>
  );
};
