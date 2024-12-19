import { useCreateAccountMutation } from "@/queries/account";
import { Button, Input } from "@tape.xyz/winder";

export const CreateAccount = () => {
  const { mutateAsync, isPending } = useCreateAccountMutation();

  const create = async () => {
    await mutateAsync({
      username: "test"
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <Input label="Username" />
      <Button className="h-11 w-full" onClick={create} loading={isPending}>
        Create
      </Button>
    </div>
  );
};
