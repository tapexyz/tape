import { useMutation } from "@apollo/client";
import { Button } from "@components/ui/Button";
import { ErrorMessage } from "@components/ui/ErrorMessage";
import { Form, useZodForm } from "@components/ui/Form";
import { Input } from "@components/ui/Input";
import Modal from "@components/ui/Modal";
import useAppStore from "@lib/store";
import { getHandle } from "@utils/functions/getHandle";
import { getRandomProfilePicture } from "@utils/functions/getRandomProfilePicture";
import { CREATE_PROFILE_MUTATION } from "@utils/gql/queries";
import usePendingTxn from "@utils/hooks/usePendingTxn";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { object, string } from "zod";

const newUserSchema = object({
  handle: string()
    .min(5, { message: "Name should be atleast 5 characters" })
    .max(31, { message: "Name should be maximum 31 characters" })
    .regex(/^[a-z0-9]+$/, {
      message: "Handle should only contain alphanumeric characters",
    }),
});

const CreateChannel = () => {
  const { setShowCreateChannel, showCreateChannel } = useAppStore();
  const [txnHash, setTxnHash] = useState("");
  const [creating, setCreating] = useState(false);
  const { indexed } = usePendingTxn(txnHash);
  const router = useRouter();

  const form = useZodForm({
    schema: newUserSchema,
  });

  const [createProfile, { data, reset }] = useMutation(
    CREATE_PROFILE_MUTATION,
    {
      onCompleted({ createProfile }) {
        if (createProfile.txHash) {
          setTxnHash(createProfile.txHash);
        } else {
          setCreating(false);
        }
      },
      onError() {
        setCreating(false);
      },
    }
  );

  useEffect(() => {
    if (indexed) {
      setCreating(false);
      setShowCreateChannel(false);
      const handle = form.getValues("handle").toLowerCase();
      form.reset();
      router.push(getHandle(handle));
    }
  }, [indexed, form, setShowCreateChannel, router]);

  const onCancel = () => {
    setShowCreateChannel(false);
    setCreating(false);
    form.reset();
    reset();
  };

  const create = (handle: string) => {
    setCreating(true);
    const username = handle.toLowerCase();
    createProfile({
      variables: {
        request: {
          handle: username,
          profilePictureUri: getRandomProfilePicture(username),
        },
      },
    });
  };

  return (
    <Modal
      title="Create Channel 🌿"
      onClose={() => setShowCreateChannel(false)}
      show={showCreateChannel}
      panelClassName="max-w-md"
    >
      <Form
        form={form}
        className="space-y-4"
        onSubmit={({ handle }) => create(handle)}
      >
        <div className="mt-4">
          <Input
            label="Channel Name"
            type="text"
            placeholder="T Series"
            autoComplete="off"
            {...form.register("handle")}
          />
        </div>

        <div className="flex items-center justify-between">
          <span>
            {data?.createProfile?.reason && (
              <ErrorMessage
                error={{
                  name: "Create profile failed!",
                  message: data?.createProfile?.reason,
                }}
              />
            )}
          </span>
          <span>
            <Button
              disabled={creating}
              onClick={() => onCancel()}
              outline="none"
              className="opacity-60"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={creating}>
              {creating ? "Creating..." : "Create"}
            </Button>
          </span>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateChannel;
