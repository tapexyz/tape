import { useMutation } from "@apollo/client";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import Modal from "@components/ui/Modal";
import useAppStore from "@lib/store";
import { getHandle } from "@utils/functions/getHandle";
import { getRandomProfilePicture } from "@utils/functions/getRandomProfilePicture";
import { CREATE_PROFILE_MUTATION } from "@utils/gql/queries";
import usePendingTxn from "@utils/hooks/usePendingTxn";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const CreateChannel = () => {
  const { setShowCreateChannel, showCreateChannel } = useAppStore();
  const [txnHash, setTxnHash] = useState("");
  const [creating, setCreating] = useState(false);
  const { indexed } = usePendingTxn(txnHash);
  const [handle, setHandle] = useState("");
  const router = useRouter();

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
      router.push(getHandle(handle));
    }
  }, [indexed, handle, setShowCreateChannel, router]);

  const onCancel = () => {
    setShowCreateChannel(false);
    setCreating(false);
    reset();
  };

  const create = () => {
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
      <div className="space-y-4">
        <div className="mt-4">
          <Input
            label="Channel Name"
            type="text"
            placeholder="T Series"
            autoComplete="off"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <span>
            {data?.createProfile?.reason && (
              <div>
                <p className="font-bold text-red-500">Create profile failed!</p>
              </div>
            )}
          </span>
          <span>
            <Button
              disabled={creating}
              onClick={() => onCancel()}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button onClick={() => create()} disabled={creating}>
              {creating ? "Creating..." : "Create"}
            </Button>
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default CreateChannel;
