import { useCreateAccountMutation } from "@/queries/account";
import { Button, Input } from "@tape.xyz/winder";
import { useState } from "react";

export const CreateAccount = () => {
  const { mutateAsync, isPending } = useCreateAccountMutation();
  const [username, setUsername] = useState("");

  const create = async () => {
    await mutateAsync({
      username
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button className="h-11 w-full" onClick={create} loading={isPending}>
        Create
      </Button>
    </div>
  );
};
